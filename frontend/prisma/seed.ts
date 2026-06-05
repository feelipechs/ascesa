import { hashPassword } from '@/lib/password'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seed essencial — Ascesa')

  const adminEmail = process.env.ADMIN_EMAIL
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.error('❌ ADMIN_EMAIL e ADMIN_PASSWORD devem ser definidos no .env')
    process.exit(1)
  }

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existing) {
    const hashedPassword = await hashPassword(adminPassword)
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: 'Admin',
        role: 'ADMIN',
        accounts: {
          create: {
            providerId: 'credential',
            accountId: '',
            password: hashedPassword,
          },
        },
      },
    })
    console.log(` 👤 Admin criado: ${adminEmail}`)
  } else {
    console.log(` 👤 Admin já existe: ${adminEmail}`)
  }

  console.log('✅ Seed concluído!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
