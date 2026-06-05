import { hashPassword } from '@/lib/password'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! })
const prisma = new PrismaClient({ adapter })

async function ensureMedia(url: string, prefix: string): Promise<string> {
  const key = `${prefix}/${url.replace(/[^a-zA-Z0-9]/g, '_').slice(-80)}`
  const media = await prisma.media.upsert({
    where: { key },
    update: {},
    create: { key, hash: key, url, mimeType: 'image/jpeg', size: 0 },
  })
  return media.id
}

async function main() {
  await prisma.registration.deleteMany()
  await prisma.volunteer.deleteMany()
  await prisma.post.deleteMany()
  await prisma.stat.deleteMany()
  await prisma.teamMemberArea.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.document.deleteMany()
  await prisma.documentCategory.deleteMany()
  await prisma.partner.deleteMany()
  await prisma.fiscalNote.deleteMany()
  await prisma.pixConfig.deleteMany()
  await prisma.bankConfig.deleteMany()
  await prisma.paymentMethod.deleteMany()
  await prisma.animal.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.galleryImage.deleteMany()
  await prisma.project.deleteMany()
  await prisma.media.deleteMany()
  await prisma.area.deleteMany()
  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.verification.deleteMany()
  await prisma.user.deleteMany()
  await prisma.siteSettings.deleteMany()

  const password = await hashPassword(process.env.ADMIN_PASSWORD!)
  await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL!,
      name: 'Admin',
      role: 'ADMIN',
      accounts: {
        create: {
          providerId: 'credential',
          accountId: '',
          password,
        },
      },
    },
  })

  await prisma.siteSettings.create({
    data: {
      id: 'main',
      email: 'contato@ascesa.org',
      phone: '(11) 99999-8888',
      address: 'Rua das Flores, 123 — Centro, São Paulo — SP',
      cnpj: '12.345.678/0001-99',
      mission: 'Resgatar, cuidar e encontrar lares para animais.',
      vision: 'Ser referência nacional em resgate e adoção responsável.',
      about: 'Fundada em 2018, a Ascesa resgata e cuida de animais abandonados.',
      values: 'Respeito, Transparência, Compromisso, Amor',
      socialInstagram: 'https://instagram.com/ascesa',
      socialFacebook: 'https://facebook.com/ascesa',
      socialWhatsapp: '5511999999999',
    },
  })

  const coverMediaId = await ensureMedia('https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800', 'area')
  const area = await prisma.area.create({
    data: {
      title: 'Resgate e Acolhimento',
      slug: 'resgate-acolhimento',
      iconName: 'Heart',
      description: 'Resgate de animais em situação de risco e abandono.',
      coverMediaId,
    },
  })

  const projectCoverMediaId = await ensureMedia('https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800', 'project')
  const project = await prisma.project.create({
    data: {
      title: 'Operação Resgate',
      slug: 'operacao-resgate',
      description: 'Mutirão de resgate de animais em situação de risco.',
      content: 'A Operação Resgate é o braço mais urgente da Ascesa.',
      coverMediaId: projectCoverMediaId,
      featured: true,
      areaId: area.id,
      eventDate: new Date('2025-08-01T08:00:00Z'),
      location: 'Zona Sul, São Paulo — SP',
      vacancies: 40,
      metrics: [{ label: 'Resgates em 2024', value: '200+' }],
    },
  })

  await prisma.testimonial.create({
    data: {
      name: 'Carla Mendes',
      role: 'Adotante',
      message: 'Adotei o Thor pela Ascesa e foi a melhor decisão da minha vida.',
    },
  })

  const logoMediaId = await ensureMedia('https://placehold.co/200x80/7C5CBF/ffffff?text=Clinica', 'partner')
  await prisma.partner.create({
    data: {
      name: 'Clínica Veterinária Patinhas',
      websiteUrl: '#',
      logoMediaId,
    },
  })

  const docCategory = await prisma.documentCategory.create({
    data: { name: 'Documentos Institucionais', slug: 'institucionais' },
  })
  await prisma.document.create({
    data: {
      title: 'Estatuto Social',
      description: 'Estatuto social da Ascesa.',
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      year: 2020,
      categoryId: docCategory.id,
    },
  })

  // AnimalSpecies, AnimalSize, AnimalAgeRange are now enums — no tables needed

  const animalCoverMediaId = await ensureMedia('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', 'animal')
  const animal = await prisma.animal.create({
    data: {
      name: 'Thor',
      slug: 'thor',
      breed: 'SRD',
      gender: 'MALE',
      species: 'DOG',
      size: 'MEDIUM',
      ageRange: 'ADULT',
      birthDate: new Date('2020-03-15'),
      description: 'Cão dócil e brincalhão.',
      content: 'Thor foi resgatado em 2025.',
      coverMediaId: animalCoverMediaId,
      status: 'AVAILABLE',
      featured: true,
      shelterSince: new Date(),
    },
  })

  const postCoverMediaId = await ensureMedia('https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', 'post')
  await prisma.post.create({
    data: {
      title: 'Como preparar sua casa para receber um pet adotado',
      slug: 'como-preparar-casa-para-pet-adotado',
      excerpt: 'Dicas essenciais para receber seu novo amigo.',
      content: 'Adotar um animal é uma decisão linda e cheia de responsabilidade.',
      coverMediaId: postCoverMediaId,
      author: 'Camila Torres',
      publishedAt: new Date(),
    },
  })

  await prisma.stat.createMany({
    data: [
      { label: 'Animais Resgatados', value: '800+', order: 0 },
      { label: 'Castrações Realizadas', value: '1.500+', order: 1 },
      { label: 'Adoções Responsáveis', value: '600+', order: 2 },
      { label: 'Voluntários Ativos', value: '120+', order: 3 },
    ],
  })

  const volunteer = await prisma.volunteer.create({
    data: { name: 'Ana Lima', email: 'ana.lima@email.com', phone: '(11) 98888-1111' },
  })
  await prisma.registration.create({
    data: {
      volunteerId: volunteer.id,
      projectId: project.id,
      status: 'PENDING',
      message: 'Gostaria de participar!',
    },
  })

  const galleryMedia1 = await ensureMedia('https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200', 'gallery-home')
  const galleryMedia2 = await ensureMedia('https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800', 'gallery-project')
  const galleryMedia3 = await ensureMedia('https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', 'gallery-animal')
  await prisma.galleryImage.createMany({
    data: [
      { mediaId: galleryMedia1, caption: 'Resgate em ação', context: 'HOME', order: 0 },
      { mediaId: galleryMedia2, caption: 'Equipe durante resgate', context: 'PROJECT', projectId: project.id, order: 0 },
      { mediaId: galleryMedia3, caption: 'Thor feliz', context: 'ANIMAL', animalId: animal.id, order: 0 },
    ],
  })

  const pixMethod = await prisma.paymentMethod.create({
    data: { type: 'PIX', label: 'PIX', instructions: 'Use a chave CNPJ.', isActive: true, displayOrder: 0 },
  })
  await prisma.pixConfig.create({
    data: { id: pixMethod.id, key: '12.345.678/0001-99', receiverName: 'Ascesa', receiverCity: 'São Paulo' },
  })

  console.log('✅ Seed de teste concluído!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
