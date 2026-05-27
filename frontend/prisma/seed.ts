import { hashPassword } from '@/lib/utils-server'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seed essencial — Ascesa')

  // Admin user
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@ascesa.org'
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123'

  const existing = await prisma.user.findUnique({ where: { email: adminEmail } })
  if (!existing) {
    await prisma.user.create({
      data: {
        email: adminEmail,
        password: await hashPassword(adminPassword),
        name: 'Admin',
        role: 'ADMIN',
      },
    })
    console.log(`   👤 Admin criado: ${adminEmail}`)
  } else {
    console.log(`   👤 Admin já existe: ${adminEmail}`)
  }

  console.log('✅ Seed concluído!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
