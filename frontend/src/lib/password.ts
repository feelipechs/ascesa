import { randomBytes, scrypt } from 'node:crypto'

const config = {
  N: 16384,
  r: 16,
  p: 1,
  dkLen: 64,
  maxmem: 128 * 16384 * 16 * 2,
}

function generateKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(
      password.normalize('NFKC'),
      salt,
      config.dkLen,
      { N: config.N, r: config.r, p: config.p, maxmem: config.maxmem },
      (err, key) => {
        if (err) reject(err)
        else resolve(key)
      },
    )
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const key = await generateKey(password, salt)
  return `${salt}:${key.toString('hex')}`
}

export async function verifyPassword({
  password,
  hash,
}: {
  password: string
  hash: string
}): Promise<boolean> {
  const [salt, key] = hash.split(':')
  if (!salt || !key) {
    throw new Error('Invalid password hash')
  }
  const targetKey = await generateKey(password, salt)
  return targetKey.toString('hex') === key
}
