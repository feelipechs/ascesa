import crypto from 'node:crypto'
import { S3Client, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'

const env = {
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
}

for (const [key, value] of Object.entries(env)) {
  if (!value) {
    throw new Error(`Variável de ambiente ${key} não configurada`)
  }
}

const R2_ACCOUNT_ID = env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = env.R2_SECRET_ACCESS_KEY!
const BUCKET_NAME = env.R2_BUCKET_NAME!
const PUBLIC_URL = env.NEXT_PUBLIC_R2_PUBLIC_URL!

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
]
const MAX_SIZE = 5 * 1024 * 1024

export interface UploadResult {
  key: string
  url: string
  hash: string
  mimeType: string
  size: number
  originalName: string
  width: number | null
  height: number | null
  existed: boolean
}

function computeSha256(buffer: Buffer): string {
  return crypto.createHash('sha256').update(buffer).digest('hex')
}

function imageDimensionsFromBuffer(buffer: Buffer, mimeType: string): { width: number | null; height: number | null } {
  try {
    if (mimeType === 'image/png') {
      if (buffer.length >= 24 && buffer.readUInt32BE(0) === 0x89504e47) {
        return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) }
      }
    }

    if (mimeType === 'image/jpeg') {
      let offset = 2
      while (offset < buffer.length) {
        if (buffer[offset] !== 0xff) break
        const marker = buffer[offset + 1]
        if (marker === 0xc0 || marker === 0xc1 || marker === 0xc2) {
          return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) }
        }
        const segLen = buffer.readUInt16BE(offset + 2)
        offset += 2 + segLen
      }
    }

    if (mimeType === 'image/webp') {
      if (buffer.length >= 30 && buffer.toString('ascii', 8, 12) === 'WEBP') {
        const riff = buffer.toString('ascii', 0, 4)
        if (riff === 'RIFF') {
          const chunk = buffer.toString('ascii', 12, 16)
          if (chunk === 'VP8 ' && buffer.length >= 26) {
            const val = buffer.readUInt16LE(21)
            return { width: val & 0x3fff, height: (val >> 14) & 0x3fff }
          }
          if (chunk === 'VP8L' && buffer.length >= 25 && buffer[20] === 0x2f) {
            const val = buffer.readUInt32LE(21)
            return { width: (val & 0x3fff) + 1, height: ((val >> 14) & 0x3fff) + 1 }
          }
        }
      }
    }

    if (mimeType === 'image/gif') {
      if (buffer.length >= 10 && (buffer.toString('ascii', 0, 6) === 'GIF87a' || buffer.toString('ascii', 0, 6) === 'GIF89a')) {
        return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) }
      }
    }
  } catch {
    // fallthrough
  }
  return { width: null, height: null }
}

export function extractR2Key(url: string): string | null {
  if (!url.startsWith(PUBLIC_URL)) return null
  return url.slice(PUBLIC_URL.length + 1)
}

export async function uploadToR2(
  file: File,
  prefix = 'uploads'
): Promise<UploadResult> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`Tipo de arquivo não permitido: ${file.type}`)
  }

  if (file.size > MAX_SIZE) {
    throw new Error('Arquivo excede o limite de 5MB')
  }

  const ext = file.name.split('.').pop() || 'bin'
  const buffer = Buffer.from(await file.arrayBuffer())
  const hash = computeSha256(buffer)
  const key = `${prefix}/${hash}.${ext}`
  const url = `${PUBLIC_URL}/${key}`
  const { width, height } = imageDimensionsFromBuffer(buffer, file.type)

  let existed = false
  try {
    await r2Client.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }))
    existed = true
  } catch {
    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: file.type,
      })
    )
  }

  return {
    key,
    url,
    hash,
    mimeType: file.type,
    size: file.size,
    originalName: file.name,
    width,
    height,
    existed,
  }
}

export async function deleteFromR2(url: string): Promise<void> {
  const key = extractR2Key(url)
  if (!key) return

  await r2Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    })
  )
}

export async function deleteMultipleFromR2(urls: string[]): Promise<void> {
  await Promise.all(urls.map((url) => deleteFromR2(url)))
}
