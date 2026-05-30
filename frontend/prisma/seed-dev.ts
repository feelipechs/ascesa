import { hashPassword } from '@/lib/utils-server'
import { toSlug } from '../src/lib/utils'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { reorderGalleryImages } from '@/services/gallery-image.service'
import { reorderTeamMembers } from '@/services/team-member.service'
import { StatService } from '@/services/stat.service'
import { reorderAnimalSpecies } from '@/services/animal-species.service'
import { reorderAnimalSizes } from '@/services/animal-size.service'
import { reorderAnimalAgeRanges } from '@/services/animal-age-range.service'
import 'dotenv/config'

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL! })
const prisma = new PrismaClient({ adapter })

// --------------------
// HELPERS
// --------------------
// MEMBROS DA EQUIPE
// --------------------

const teamMembersData: {
  name: string
  role: string
  bio: string
  gender: 'male' | 'female'
  areaSlugs: string[]
}[] = [
  {
    name: 'Marina Albuquerque',
    role: 'Coordenadora Geral',
    bio: 'Médica veterinária há 15 anos, fundadora da Ascesa. Responsável pela coordenação geral dos projetos e parcerias estratégicas.',
    gender: 'female',
    areaSlugs: ['resgate-acolhimento', 'castracao', 'apoio-veterinario'],
  },
  {
    name: 'Dr. Ricardo Nunes',
    role: 'Veterinário Chefe',
    bio: 'Cirurgião veterinário especializado em ortopedia e clínica geral. Coordena os mutirões de castração e atendimentos emergenciais.',
    gender: 'male',
    areaSlugs: ['castracao', 'apoio-veterinario'],
  },
  {
    name: 'Camila Torres',
    role: 'Assistente Social',
    bio: 'Atua na triagem de famílias interessadas em adoção, visitas domiciliares e acompanhamento pós-adoção.',
    gender: 'female',
    areaSlugs: ['adocao-responsavel', 'educacao'],
  },
  {
    name: 'Felipe Araújo',
    role: 'Resgatista',
    bio: 'Responsável pelo resgate de animais em situação de risco, vítimas de maus-tratos e abandono. Atua há 8 anos na causa animal.',
    gender: 'male',
    areaSlugs: ['resgate-acolhimento'],
  },
  {
    name: 'Juliana Costa',
    role: 'Coordenadora de Adoção',
    bio: 'Psicóloga especializada em vínculo humano-animal. Coordena o processo de adoção responsável e as feiras de adoção.',
    gender: 'female',
    areaSlugs: ['adocao-responsavel'],
  },
  {
    name: 'Lucas Mendes',
    role: 'Educador',
    bio: 'Biólogo e educador ambiental. Ministra palestras e oficinas sobre guarda responsável, posse consciente e bem-estar animal.',
    gender: 'male',
    areaSlugs: ['educacao'],
  },
  {
    name: 'Dra. Patrícia Oliveira',
    role: 'Veterinária',
    bio: 'Clínica geral especializada em felinos. Atende no consultório da ONG e nos mutirões comunitários.',
    gender: 'female',
    areaSlugs: ['apoio-veterinario', 'castracao'],
  },
  {
    name: 'Rafael Santos',
    role: 'Auxiliar de Resgate',
    bio: 'Ex-adotante que se tornou voluntário fixo. Auxilia nos resgates, transporte e cuidados diários dos animais acolhidos.',
    gender: 'male',
    areaSlugs: ['resgate-acolhimento'],
  },
  {
    name: 'Fernanda Lima',
    role: 'Coordenadora de Apadrinhamento',
    bio: 'Administra o programa de apadrinhamento afetivo e financeiro, conectando padrinhos aos animais do abrigo.',
    gender: 'female',
    areaSlugs: ['educacao'],
  },
  {
    name: 'Gabriel Oliveira',
    role: 'Comunicador',
    bio: 'Jornalista e social media da Ascesa. Responsável pelas campanhas digitais, divulgação de feiras e conscientização nas redes.',
    gender: 'male',
    areaSlugs: ['educacao'],
  },
]

function avatarUrl(name: string, gender: 'male' | 'female') {
  const style = gender === 'female' ? 'lorelei' : 'adventurer'
  return `https://api.dicebear.com/9.x/${style}/png?seed=${encodeURIComponent(name)}&size=240`
}

// --------------------
// PARCEIROS
// --------------------

const partnersData = [
  {
    name: 'Clínica Veterinária Patinhas',
    logoUrl: 'https://placehold.co/200x80/7C5CBF/ffffff?text=Clínica+Patinhas',
    websiteUrl: '#',
  },
  {
    name: 'PetShop Amigo Bicho',
    logoUrl: 'https://placehold.co/200x80/5A9E7C/ffffff?text=Amigo+Bicho',
    websiteUrl: '#',
  },
  {
    name: 'Ração Premium Ltda',
    logoUrl: 'https://placehold.co/200x80/D4A373/ffffff?text=Racão+Premium',
    websiteUrl: '#',
  },
  {
    name: 'Instituto Proteção Animal',
    logoUrl: 'https://placehold.co/200x80/6B5A8A/ffffff?text=IPA',
    websiteUrl: '#',
  },
  {
    name: 'Universidade Federal — Vet Popular',
    logoUrl: 'https://placehold.co/200x80/2A1F45/ffffff?text=UFVet',
    websiteUrl: '#',
  },
  {
    name: 'Loja Pet Feliz',
    logoUrl: 'https://placehold.co/200x80/7C5CBF/ffffff?text=Pet+Feliz',
    websiteUrl: '#',
  },
]

// --------------------
// CATEGORIAS DE DOCUMENTOS
// --------------------

const docCategoriesData = [
  { name: 'Documentos Institucionais', slug: 'institucionais' },
  { name: 'Termos e Convênios', slug: 'convenios' },
  { name: 'Relatórios Anuais', slug: 'relatorios' },
  { name: 'Prestação de Contas', slug: 'prestacao-contas' },
]

// --------------------
// DOCUMENTOS POR CATEGORIA
// --------------------

const documentsByCategory: Record<string, { title: string; description: string; year: number }[]> = {
  institucionais: [
    {
      title: 'Estatuto Social da Ascesa',
      description: 'Estatuto social registrado em cartório, definindo missão, visão e estrutura organizacional da ONG.',
      year: 2020,
    },
    {
      title: 'Regimento Interno',
      description: 'Regimento interno com normas de funcionamento e código de conduta para colaboradores e voluntários.',
      year: 2021,
    },
    {
      title: 'Ata de Fundação',
      description: 'Ata de assembleia geral de fundação da Associação Ascesa.',
      year: 2018,
    },
  ],
  convenios: [
    {
      title: 'Convênio com Clínica Patinhas 2025',
      description: 'Termo de convênio para atendimento veterinário com desconto para animais resgatados pela ONG.',
      year: 2025,
    },
    {
      title: 'Termo de Cooperação com UFVet',
      description: 'Acordo de cooperação técnica para estágio de estudantes de medicina veterinária.',
      year: 2024,
    },
    {
      title: 'Parceria com PetShop Amigo Bicho',
      description: 'Convênio para fornecimento de ração e insumos com preço subsidiado.',
      year: 2024,
    },
  ],
  relatorios: [
    {
      title: 'Relatório Anual 2024',
      description: 'Relatório completo das atividades, projetos e impactos realizados ao longo de 2024.',
      year: 2024,
    },
    {
      title: 'Relatório de Atividades 2023',
      description: 'Relatório detalhado dos projetos executados, número de animais atendidos e indicadores de resultado.',
      year: 2023,
    },
    {
      title: 'Relatório de Impacto Social 2025',
      description: 'Relatório semestral com dados de resgates, adoções e castrações realizadas.',
      year: 2025,
    },
  ],
  'prestacao-contas': [
    {
      title: 'Prestação de Contas 2024',
      description: 'Demonstrativo financeiro anual com receitas, despesas e investimentos realizados.',
      year: 2024,
    },
    {
      title: 'Balanço Financeiro 2023',
      description: 'Balanço patrimonial e demonstração de resultados do exercício de 2023.',
      year: 2023,
    },
  ],
}

// --------------------
// CONFIGURAÇÕES DO SITE
// --------------------

const siteSettingsData = {
  email: 'contato@ascesa.org',
  phone: '(11) 99999-8888',
  address: 'Rua das Flores, 123 — Centro, São Paulo — SP, 01001-000',
  cnpj: '12.345.678/0001-99',
  mission: 'Resgatar, cuidar e encontrar lares amorosos para animais em situação de vulnerabilidade.',
  vision: 'Ser referência nacional em resgate, castração e adoção responsável, construindo uma sociedade mais consciente sobre o bem-estar animal.',
  about:
    'Fundada em 2018 na cidade de São Paulo, a Ascesa nasceu da vontade de transformar a realidade de animais abandonados. O que começou com resgates pontuais cresceu e se tornou uma organização que oferece acolhimento, castração solidária, apoio veterinário, feiras de adoção e programas de educação e conscientização. Já resgatamos mais de 800 animais e realizamos mais de 1.500 castrações, com uma equipe de profissionais dedicados e centenas de voluntários ativos.',
  homeTitle: 'Todo animal **merece** um lar',
  homeSubtitle:
    'Resgate, cuidado e adoção responsável. Transformamos vidas — deles e das famílias que os acolhem.',
  values:
    'Respeito, Transparência, Compromisso, Amor, Responsabilidade, Ética, Inclusão, Trabalho em Equipe',
  socialInstagram: 'https://instagram.com/ascesa',
  socialFacebook: 'https://facebook.com/ascesa',
  socialYoutube: 'https://youtube.com/@ascesa',
  socialWhatsapp: '5511999999999',
  socialLinkedin: 'https://linkedin.com/company/ascesa',
}

// --------------------
// ÁREAS
// --------------------

const areasData = [
  {
    title: 'Resgate e Acolhimento',
    slug: 'resgate-acolhimento',
    iconName: 'Heart',
    description:
      'Resgate de animais em situação de risco, maus-tratos e abandono. Acolhimento temporário com cuidados veterinários, alimentação e muito carinho.',
    coverUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
  },
  {
    title: 'Castração Solidária',
    slug: 'castracao',
    iconName: 'Syringe',
    description:
      'Mutirões de castração a preço popular para a comunidade. Controle populacional ético e prevenção de abandono.',
    coverUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
  },
  {
    title: 'Adoção Responsável',
    slug: 'adocao-responsavel',
    iconName: 'PawPrint',
    description:
      'Feiras de adoção, triagem de famílias, acompanhamento pós-adoção. Garantimos que cada animal encontre o lar ideal.',
    coverUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
  },
  {
    title: 'Apoio Veterinário',
    slug: 'apoio-veterinario',
    iconName: 'Stethoscope',
    description:
      'Consultas, exames, cirurgias e tratamentos a preço acessível para animais de famílias de baixa renda.',
    coverUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800',
  },
  {
    title: 'Educação e Conscientização',
    slug: 'educacao',
    iconName: 'BookOpen',
    description:
      'Palestras, oficinas e campanhas sobre guarda responsável, posse consciente, bem-estar animal e denúncia de maus-tratos.',
    coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
  },
]

// --------------------
// PROJETOS (EVENTOS + CAMPANHAS)
// --------------------

  const projectsByArea: Record<
    string,
    {
      title: string
      description: string
      content: string
      coverUrl: string
      featured: boolean
      eventDate?: string
      location?: string
      vacancies?: number
      metrics?: { label: string; value: string }[]
    }[]
  > = {
    'resgate-acolhimento': [
      {
        title: 'Operação Resgate',
        description:
          'Mutirão de resgate de animais em situação de risco nas regiões periféricas de São Paulo.',
        content:
          'A Operação Resgate é o braço mais urgente da Ascesa. Atendemos denúncias de maus-tratos, animais abandonados em vias públicas, vítimas de atropelamento e situações de risco iminente.\n\nContamos com uma equipe treinada de resgatistas e uma viatura equipada para transporte. Cada animal resgatado passa por avaliação veterinária imediata e é encaminhado para nosso abrigo temporário ou para lares adotivos.\n\nEm 2024 realizamos mais de 200 resgates. Nosso objetivo é ampliar a frota para atender cada vez mais ocorrências com agilidade e dignidade.',
        coverUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
        featured: true,
        eventDate: '2025-07-19T08:00:00Z',
        location: 'Zona Sul, São Paulo — SP',
        vacancies: 40,
        metrics: [
          { label: 'Resgates em 2024', value: '200+' },
          { label: 'Animais acolhidos', value: '150' },
          { label: 'Lares temporários', value: '45' },
        ],
      },
      {
        title: 'Mutirão de Resgate — Zona Norte',
        description:
          'Ação concentrada de resgate e acolhimento na região da Zona Norte de São Paulo.',
        content:
          'O Mutirão de Resgate da Zona Norte é uma ação intensiva de três dias, percorrendo bairros com maior incidência de abandono. Contamos com voluntários, veterinários e transporte dedicado.\n\nOs animais resgatados recebem microchipagem, vacinação e são cadastrados em nosso sistema para acompanhamento. Os tutores que desejam manter seus animais recebem orientação e suporte.\n\nAo final do mutirão, realizamos uma feira de adoção com os animais resgatados.',
        coverUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
        featured: false,
        eventDate: '2025-08-15T08:00:00Z',
        location: 'Zona Norte, São Paulo — SP',
        vacancies: 50,
      },
    ],
    castracao: [
      {
        title: 'Mutirão de Castração Gratuita',
        description:
          'Evento mensal de castração gratuita para cães e gatos de famílias de baixa renda cadastradas.',
        content:
          'O Mutirão de Castração Gratuita acontece todo último sábado do mês na sede da Ascesa. Cada edição atende até 60 animais entre cães e gatos.\n\nAs inscrições são abertas com 15 dias de antecedência, priorizando famílias cadastradas em programas sociais. Os animais passam por avaliação prévia e os tutores recebem orientações sobre pós-operatório.\n\nO projeto é realizado em parceria com clínicas veterinárias parceiras e conta com uma equipe de 4 veterinários e 6 auxiliares voluntários.',
        coverUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
        featured: true,
        eventDate: '2025-06-28T07:00:00Z',
        location: 'Sede Ascesa — Rua das Flores, 123, São Paulo — SP',
        vacancies: 60,
        metrics: [
          { label: 'Castrações em 2024', value: '1.200+' },
          { label: 'Atendidas por mês', value: '60' },
          { label: 'Parceiros veterinários', value: '8' },
        ],
      },
      {
        title: 'Campanha CastraVerão',
        description:
          'Mutirão de verão com castração a preço popular e conscientização sobre abandono de filhotes.',
        content:
          'O CastraVerão é uma campanha sazonal que ocorre entre dezembro e março, período de maior incidência de crias indesejadas. Oferecemos castração com valores subsidiados para toda a comunidade.\n\nAlém das cirurgias, realizamos ações educativas nas praças e parques sobre a importância da castração e os riscos do abandono de filhotes.\n\nNa última edição, castramos mais de 400 animais em 4 meses.',
        coverUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800',
        featured: false,
        eventDate: '2026-01-10T08:00:00Z',
        location: 'Sede Ascesa — Rua das Flores, 123, São Paulo — SP',
        vacancies: 80,
        metrics: [
          { label: 'Castrações realizadas', value: '400+' },
          { label: 'Famílias atendidas', value: '280' },
        ],
      },
    ],
    'adocao-responsavel': [
      {
        title: 'Feira de Adoção — Parque Ibirapuera',
        description:
          'Feira mensal de adoção responsável no Parque Ibirapuera, com animais vacinados, castrados e microchipados.',
        content:
          'Nossa Feira de Adoção no Parque Ibirapuera é um dos eventos mais aguardados do calendário da Ascesa. Acontece todo primeiro domingo do mês, das 9h às 15h, próximo ao portão principal.\n\nTodos os animais disponíveis para adoção são vacinados, castrados, microchipados e avaliamos cada candidato criteriosamente. Realizamos entrevista, visita domiciliar e assinatura do termo de adoção responsável.\n\nApós a adoção, acompanhamos o animal e a família por 6 meses, com suporte veterinário gratuito no período.',
        coverUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
        featured: true,
        eventDate: '2025-07-06T09:00:00Z',
        location: 'Parque Ibirapuera — Portão Principal, São Paulo — SP',
        vacancies: 30,
        metrics: [
          { label: 'Adoções em 2024', value: '180+' },
          { label: 'Feiras realizadas', value: '12' },
          { label: 'Animais por feira', value: '25' },
        ],
      },
      {
        title: 'Campanha Adote um Sênior',
        description:
          'Evento especial para incentivar a adoção de animais idosos, com taxas zero e suporte veterinário vitalício.',
        content:
          'A Campanha Adote um Sênior é nossa iniciativa para encontrar lares amorosos para animais com mais de 7 anos. Esses animais costumam ser os últimos a serem adotados, mas têm tanto amor para dar quanto os jovens.\n\nOferecemos isenção total das taxas de adoção, consulta veterinária gratuita por 1 ano, ração especial para idosos por 3 meses e acompanhamento veterinário vitalício.\n\nCada adoção de sênior é uma celebração — damos ao animal a chance de viver seus anos dourados com dignidade e carinho.',
        coverUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
        featured: false,
        eventDate: '2025-08-02T09:00:00Z',
        location: 'Parque Ibirapuera — Portão Principal, São Paulo — SP',
        vacancies: 30,
        metrics: [
          { label: 'Seniores adotados', value: '35' },
          { label: 'Taxa de sucesso', value: '92%' },
        ],
      },
      {
        title: 'Feira de Adoção — Pet Shop Amigo Bicho',
        description:
          'Feira de adoção em parceria com PetShop Amigo Bicho, com descontos especiais para adotantes.',
        content:
          'Em parceria com o PetShop Amigo Bicho, realizamos feiras de adoção quinzenais na loja. Os adotantes ganham um kit inicial com ração, coleira e brinquedo.\n\nA parceria inclui também descontos permanentes em ração e acessórios para todos os adotantes da Ascesa, facilitando os cuidados com o novo membro da família.',
        coverUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
        featured: false,
        eventDate: '2025-06-15T10:00:00Z',
        location: 'PetShop Amigo Bicho — Av. Paulista, 1000, São Paulo — SP',
        vacancies: 20,
      },
    ],
    'apoio-veterinario': [
      {
        title: 'Mutirão de Consultas Populares',
        description:
          'Mutirão de atendimento veterinário a preço popular para animais de famílias de baixa renda cadastradas.',
        content:
          'O Mutirão de Consultas Populares oferece atendimento clínico geral com valor social de R$ 40 para famílias cadastradas. Inclui consulta, prescrição e encaminhamento para exames.\n\nAtendemos cães e gatos durante o evento, com prioridade para casos urgentes.\n\nContamos com dois veterinários e um laboratório parceiro para exames com desconto.',
        coverUrl: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800',
        featured: true,
        eventDate: '2025-07-05T08:00:00Z',
        location: 'Sede Ascesa — Rua das Flores, 123, São Paulo — SP',
        vacancies: 100,
        metrics: [
          { label: 'Consultas/mês', value: '200+' },
          { label: 'Valor social', value: 'R$ 40' },
          { label: 'Exames realizados', value: '800+' },
        ],
      },
      {
        title: 'Campanha de Vacinação',
        description:
          'Mutirão de vacinação antirrábica e polivalente a preço popular para a comunidade.',
        content:
          'A Campanha de Vacinação acontece trimestralmente em pontos estratégicos da cidade. Oferecemos vacinas antirrábica e V8/V10 com valores subsidiados.\n\nCada edição vacina cerca de 300 animais. Além da vacinação, distribuímos material educativo sobre calendário vacinal e cuidados preventivos.\n\nA campanha é realizada em parceria com a Vigilância Sanitária municipal.',
        coverUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
        featured: false,
        eventDate: '2025-09-20T08:00:00Z',
        location: 'Praça da Sé, s/n — São Paulo — SP',
        vacancies: 300,
      },
    ],
    educacao: [
      {
        title: 'Palestras nas Escolas',
        description:
          'Mutirão educativo itinerante que leva conscientização sobre bem-estar animal para escolas públicas.',
        content:
          'O programa Palestras nas Escolas leva educação sobre guarda responsável para crianças e adolescentes da rede pública. As palestras são interativas, com vídeos, jogos e atividades práticas.\n\nOs temas incluem: cuidados básicos com animais, posse responsável, denúncia de maus-tratos, castração e adoção. Cada turma recebe material didático exclusivo.\n\nEm 2024 alcançamos mais de 3.000 estudantes em 25 escolas. O programa é um dos pilares da nossa atuação preventiva.',
        coverUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800',
        featured: true,
        eventDate: '2025-08-25T08:00:00Z',
        location: 'EMEF Professor José de Anchieta — São Paulo — SP',
        vacancies: 200,
        metrics: [
          { label: 'Estudantes alcançados', value: '3.000+' },
          { label: 'Escolas atendidas', value: '25' },
          { label: 'Palestras realizadas', value: '60' },
        ],
      },
      {
        title: 'Oficina de Férias — Pequeno Protetor',
        description:
          'Oficina de férias para crianças com atividades sobre cuidados com animais e conscientização ambiental.',
        content:
          'A Oficina de Férias Pequeno Protetor é um programa de imersão de uma semana para crianças de 7 a 12 anos. As atividades incluem:\n\n- Visita guiada ao abrigo\n- Oficina de enriquecimento ambiental para os animais\n- Aulas sobre nutrição e cuidados básicos\n- Confecção de brinquedos recicláveis para pets\n- Roda de conversa sobre sentimentos e empatia\n\nAs crianças saem transformadas, levando para casa o compromisso de serem protetores dos animais.',
        coverUrl: 'https://images.unsplash.com/photo-1518399681705-1c1a254e6e82?w=800',
        featured: false,
        eventDate: '2025-07-14T09:00:00Z',
        location: 'Sede Ascesa — Rua das Flores, 123, São Paulo — SP',
        vacancies: 30,
      },
      {
        title: 'Campanha Dezembro Verde',
        description:
          'Mutirão de conscientização contra o abandono de animais durante as festas de fim de ano.',
        content:
          'O Dezembro Verde é nossa campanha mais importante do ano. Durante todo o mês de dezembro, intensificamos as ações de conscientização sobre abandono de animais — crime que cresce até 30% nesta época.\n\nRealizamos panfletagem em pontos turísticos, postagens nas redes sociais, entrevistas em rádio e TV, e distribuição de materiais em pet shops e clínicas.\n\nA campanha também oferece descontos especiais em castração e microchipagem para prevenir crias indesejadas.',
        coverUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
        featured: false,
        eventDate: '2025-12-01T09:00:00Z',
        location: 'Praça da Sé, s/n — São Paulo — SP',
        vacancies: 100,
        metrics: [
          { label: 'Materiais distribuídos', value: '10.000+' },
          { label: 'Castrações na campanha', value: '150' },
        ],
      },
    ],
  }

// --------------------
// DEPOIMENTOS
// --------------------

const testimonialTemplates: {
  name: string
  role: string
  message: string
}[] = [
  {
    name: 'Carla Mendes',
    role: 'Adotante',
    message:
      'Adotei o Thor pela Ascesa e foi a melhor decisão da minha vida. A equipe me acompanhou em todo o processo, desde a visita até os meses seguintes. Hoje ele é minha sombra!',
  },
  {
    name: 'Pedro Alves',
    role: 'Voluntário',
    message:
      'Ser voluntário na Ascesa transformou minha visão sobre a causa animal. Ver um animal resgatado voltar a confiar nos humanos é algo que não tem preço.',
  },
  {
    name: 'Maria Helena',
    role: 'Adotante',
    message:
      'A Nina chegou na minha vida através da feira de adoção no Ibirapuera. Ela tinha 8 anos e ninguém queria por ser idosa. Hoje não imagino a vida sem ela. Campanha linda!',
  },
  {
    name: 'Roberto Carlos',
    role: 'Padrinho',
    message:
      'Apadrinhei a Mel há 2 anos. Mesmo não podendo adotar, sei que contribuo para os cuidados dela. Recebo fotos e notícias todos os meses. A transparência da Ascesa é admirável.',
  },
  {
    name: 'Juliana Oliveira',
    role: 'Adotante',
    message:
      'Castrei minha gata pelo mutirão da Ascesa. Atendimento excelente, equipe super atenciosa. Além de tudo, me explicaram a importância da castração com muito carinho.',
  },
  {
    name: 'Lucas Fernando',
    role: 'Voluntário',
    message:
      'Participei do mutirão de resgate na Zona Norte. Foram dias intensos, mas ver cada animal sendo acolhido e recebendo cuidado médico encheu meu coração.',
  },
  {
    name: 'Sandra Cristina',
    role: 'Adotante',
    message:
      'Adotamos um casal de gatinhos irmãos. A Ascesa fez questão de que fossem adotados juntos para não separá-los. Isso mostra o respeito que eles têm pelos animais.',
  },
  {
    name: 'Dr. Marcos Paulo',
    role: 'Veterinário parceiro',
    message:
      'Atuo como veterinário parceiro nos mutirões de castração. A organização e o cuidado da Ascesa com cada animal são exemplares. Orgulho de fazer parte dessa rede.',
  },
  {
    name: 'Fernanda Rocha',
    role: 'Adotante',
    message:
      'Resgatei um filhote na rua e a Ascesa me deu todo o suporte: consulta, vacinas e orientação. Agora o Bento faz parte da família oficialmente!',
  },
  {
    name: 'Dona Tânia Alves',
    role: 'Beneficiária',
    message:
      'Levei meu cachorro idoso na consulta popular e fui atendida com muito respeito. O preço é justo e o tratamento é de primeira. Deus abençoe a Ascesa!',
  },
  {
    name: 'Gabriel Oliveira',
    role: 'Padrinho',
    message:
      'Sou padrinho do Zé, um cãozinho paraplégico que foi resgatado. A Ascesa não mede esforços para dar qualidade de vida a ele. Ver a dedicação deles me motiva a contribuir mais.',
  },
  {
    name: 'Patrícia Nunes',
    role: 'Adotante',
    message:
      'Minha filha participou da Oficina Pequeno Protetor e voltou decidida a ser veterinária. O trabalho de educação que vocês fazem é fundamental para formar uma geração mais consciente.',
  },
  {
    name: 'Luiz Fernando Dias',
    role: 'Adotante',
    message:
      'Adotei um cão com dificuldades de socialização. A equipe da Ascesa me deu todo o suporte comportamental e hoje o Rex é um cão completamente diferente. Gratidão eterna.',
  },
  {
    name: 'Amanda Costa',
    role: 'Voluntária',
    message:
      'Comecei como voluntária nas feiras de adoção. Hoje coordeno o grupo de novos voluntários. A Ascesa é mais que uma ONG, é uma família que luta pelos que não têm voz.',
  },
  {
    name: 'Ricardo Almeida',
    role: 'Adotante',
    message:
      'Levei meus filhos na palestra da escola sobre guarda responsável. Eles não param de falar sobre o que aprenderam. Educação que transforma!',
  },
]

// --------------------
// HOME GALLERY
// --------------------

const homeGalleryData: { url: string; caption: string }[] = [
  {
    url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200',
    caption: 'Equipe de resgate em ação salvando animais',
  },
  {
    url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200',
    caption: 'Feira de adoção responsável',
  },
  {
    url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1200',
    caption: 'Mutirão de castração solidária',
  },
  {
    url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=1200',
    caption: 'Atendimento veterinário popular',
  },
  {
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200',
    caption: 'Palestra educativa em escola pública',
  },
  {
    url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=1200',
    caption: 'Campanha Adote um Sênior',
  },
]

// --------------------
// PROJECT GALLERY IMAGES BY AREA
// --------------------

const projectGalleryByArea: Record<string, { url: string; caption: string }[]> = {
  'resgate-acolhimento': [
    { url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800', caption: 'Equipe durante resgate' },
    { url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', caption: 'Animal sendo acolhido no abrigo' },
    { url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', caption: 'Cuidados veterinários pós-resgate' },
  ],
  castracao: [
    { url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800', caption: 'Sala de cirurgia do mutirão' },
    { url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800', caption: 'Equipe veterinária durante castração' },
  ],
  'adocao-responsavel': [
    { url: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800', caption: 'Feira de adoção no parque' },
    { url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', caption: 'Família conhecendo o novo pet' },
    { url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800', caption: 'Animais prontos para adoção' },
  ],
  'apoio-veterinario': [
    { url: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800', caption: 'Consulta veterinária popular' },
    { url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800', caption: 'Campanha de vacinação' },
  ],
  educacao: [
    { url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800', caption: 'Palestra em escola' },
    { url: 'https://images.unsplash.com/photo-1518399681705-1c1a254e6e82?w=800', caption: 'Crianças na Oficina Pequeno Protetor' },
  ],
}

// --------------------
// VOLUNTEERS
// --------------------

const volunteersData = [
  { name: 'Ana Beatriz Lima', email: 'ana.lima@email.com', phone: '(11) 98888-1111', birthDate: new Date('1995-03-15') },
  { name: 'Carlos Eduardo Santos', email: 'carlos.santos@email.com', phone: '(11) 97777-2222', birthDate: new Date('1988-07-22') },
  { name: 'Débora Oliveira', email: 'debora.oli@email.com', phone: '(11) 96666-3333', birthDate: new Date('1992-11-08') },
  { name: 'Eduardo Martins', email: 'edu.martins@email.com', phone: '(11) 95555-4444', birthDate: new Date('2000-01-30') },
  { name: 'Fernanda Souza', email: 'fernanda.souza@email.com', phone: '(11) 94444-5555', birthDate: new Date('1990-05-12') },
  { name: 'Gustavo Almeida', email: 'gustavo.almeida@email.com', phone: '(11) 93333-6666', birthDate: new Date('1985-09-18') },
  { name: 'Helena Costa', email: 'helena.costa@email.com', phone: '(11) 92222-7777', birthDate: new Date('1998-12-25') },
  { name: 'Igor Pereira', email: 'igor.pereira@email.com', phone: '(11) 91111-8888', birthDate: new Date('1993-04-03') },
  { name: 'Julia Carvalho', email: 'julia.carvalho@email.com', phone: '(11) 90000-9999', birthDate: new Date('1991-08-14') },
  { name: 'Kevin Barbosa', email: 'kevin.barbosa@email.com', phone: '(11) 98888-0000', birthDate: new Date('1996-02-28') },
]

// --------------------
// POSTS
// --------------------

const postsData = [
  {
    title: 'Como preparar sua casa para receber um pet adotado',
    slug: 'como-preparar-casa-para-pet-adotado',
    excerpt: 'Dicas essenciais para receber seu novo amigo de quatro patas com conforto, segurança e muito amor.',
    content:
      'Adotar um animal é uma decisão linda e cheia de responsabilidade. Antes da chegada do novo membro, é importante preparar o ambiente para que ele se sinta acolhido e seguro.\n\n## 1. Espaço próprio\nSepare um cantinho com cama, água fresca e potinhos de comida. Nos primeiros dias, o animal precisa de um refúgio onde se sinta protegido.\n\n## 2. Itens essenciais\nCompre ração de qualidade, potes de água e comida, coleira, guia, caminha e brinquedos. Se for gato, arranhador e caixa de areia são indispensáveis.\n\n## 3. Segurança\nVerifique telas em janelas, esconda fios elétricos e remova plantas tóxicas. Cães e gatos são curiosos e podem se machucar.\n\n## 4. Paciência\nCada animal tem seu tempo de adaptação. Alguns se soltam em horas, outros levam semanas. Respeite o ritmo do seu novo amigo.\n\nAdotar é um ato de amor. Com preparo e dedicação, vocês serão felizes juntos!',
    coverUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
    author: 'Camila Torres',
    publishedAt: new Date('2025-03-10'),
  },
  {
    title: 'A importância da castração para o controle populacional',
    slug: 'importancia-castracao-controle-populacional',
    excerpt: 'Entenda por que castrar seu pet é um ato de amor e responsabilidade social.',
    content:
      'A castração é um dos procedimentos mais importantes na medicina veterinária preventiva. Além dos benefícios individuais para a saúde do animal, ela tem um impacto social enorme.\n\n## Benefícios para a saúde\n- Previne tumores de mama e próstata\n- Elimina o risco de piometra (infecção uterina)\n- Reduz comportamentos indesejados como marcação de território e fugas\n\n## Impacto social\nO Brasil tem mais de 30 milhões de cães e gatos abandonados. A castração é a forma mais eficaz de controle populacional, evitando crias indesejadas que frequentemente são abandonadas.\n\n## Mitos comuns\n"Minha cadela precisa ter uma cria antes de castrar" — MITO. Não há nenhum benefício científico nessa prática.\n\n"Castrar engorda" — MITO. O ganho de peso está relacionado à alimentação e exercícios, não à castração.\n\nNa Ascesa, realizamos mutirões mensais de castração a preço popular. Consulte nosso calendário e agende a castração do seu pet!',
    coverUrl: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800',
    author: 'Dr. Ricardo Nunes',
    publishedAt: new Date('2025-02-20'),
  },
  {
    title: 'História de superação: Thor encontrou um lar',
    slug: 'historia-thor-encontrou-lar',
    excerpt: 'Conheça a emocionante história de Thor, um cão que foi resgatado das ruas e hoje é feliz com sua nova família.',
    content:
      'Thor foi encontrado pela equipe de resgate da Ascesa em julho de 2024. Ele estava muito magro, com ferimentos pelo corpo e claramente havia sido abandonado há semanas.\n\nApós o resgate, Thor passou por tratamento veterinário intensivo. Foram 3 meses de cuidados até que ele se recuperasse completamente. Durante esse período, ele ficou em um lar temporário com uma de nossas voluntárias.\n\nEm outubro, durante a Feira de Adoção no Ibirapuera, a Carla Mendes se apaixonou por ele. Após entrevista e visita domiciliar, a adoção foi aprovada.\n\nHoje Thor é um cão saudável, brincalhão e muito amado. Ele transformou a vida da Carla e prova que todo animal merece uma segunda chance.\n\nEssa história só foi possível graças ao apoio de nossos doadores e voluntários. Ajude você também!',
    coverUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    author: 'Equipe Ascesa',
    publishedAt: new Date('2025-01-15'),
  },
  {
    title: 'O que fazer ao encontrar um animal abandonado',
    slug: 'o-que-fazer-animal-abandonado',
    excerpt: 'Guia prático com os passos corretos para ajudar um animal em situação de rua com segurança.',
    content:
      'Encontrar um animal abandonado pode ser angustiante. Aqui está um guia rápido do que fazer:\n\n## 1. Avalie a situação\nO animal está ferido? Agressivo? Em via movimentada? Sua segurança em primeiro lugar.\n\n## 2. Aproxime-se com calma\nFale em tom suave, estenda a mão para que ele cheire. Se possível, ofereça água ou comida.\n\n## 3. Resgate seguro\nSe o animal permitir, coloque-o em local seguro (caixa de transporte ou coleira). Cuidado com animais assustados — podem reagir por medo.\n\n## 4. Leve ao veterinário\nO primeiro passo é sempre uma avaliação veterinária para verificar saúde geral, vacinas e microchip.\n\n## 5. Contate uma ONG\nSe não puder ficar com o animal, entre em contato com a Ascesa ou outra ONG da região. Quanto mais informações você fornecer, melhor.\n\n## 6. Divulgue\nTire fotos, publique nas redes sociais marcando a localização. O dono pode estar procurando.\n\nLembre-se: abandono é crime (Lei 9.605/98, Art. 32). Denuncie!',
    coverUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
    author: 'Felipe Araújo',
    publishedAt: new Date('2024-12-05'),
  },
]

// --------------------
// STATS
// --------------------

const statsData = [
  { label: 'Animais Resgatados', value: '800+' },
  { label: 'Castrações Realizadas', value: '1.500+' },
  { label: 'Adoções Responsáveis', value: '600+' },
  { label: 'Voluntários Ativos', value: '120+' },
]

// --------------------
// MAIN
// --------------------

async function main() {
  console.log('🗑️  Limpando dados dependentes...')
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
  await prisma.animalAgeRange.deleteMany()
  await prisma.animalSize.deleteMany()
  await prisma.animalSpecies.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.galleryImage.deleteMany()
  await prisma.project.deleteMany()

  // Admin
  console.log('👤  Criando usuário admin...')
  const password = await hashPassword(process.env.ADMIN_PASSWORD!)

  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL! },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL!,
      password,
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  // SiteSettings
  console.log('⚙️  Configurando site...')
  await prisma.siteSettings.upsert({
    where: { id: 'main' },
    update: siteSettingsData,
    create: { id: 'main', ...siteSettingsData },
  })

  // Áreas
  console.log('📂  Criando áreas...')
  const areas = await Promise.all(
    areasData.map((area) =>
      prisma.area.upsert({
        where: { slug: area.slug },
        update: {},
        create: { ...area, publishedAt: new Date() },
      })
    )
  )
  const areaBySlug = Object.fromEntries(areas.map((a) => [a.slug, a]))

  // Partners
  console.log('🤝  Criando parceiros...')
  for (const partner of partnersData) {
    await prisma.partner.create({ data: { ...partner, publishedAt: new Date() } })
  }

  // DocumentCategories + Documents
  console.log('📄  Criando categorias e documentos...')
  const docCategories = await Promise.all(
    docCategoriesData.map((cat) =>
      prisma.documentCategory.upsert({
        where: { slug: cat.slug },
        update: {},
        create: cat,
      })
    )
  )

  for (const cat of docCategories) {
    const docs = documentsByCategory[cat.slug]
    if (!docs) continue
    for (const doc of docs) {
      await prisma.document.create({
        data: {
          title: doc.title,
          description: doc.description,
          fileUrl:
            'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          year: doc.year,
          publishedAt: new Date(),
          categoryId: cat.id,
        },
      })
    }
  }

  // TeamMembers
  console.log('👥 Criando membros da equipe...')
  const teamMembersCreated: { id: string }[] = []
  for (const tm of teamMembersData) {
    const member = await prisma.teamMember.create({
      data: {
        name: tm.name,
        role: tm.role,
        bio: tm.bio,
        photoUrl: avatarUrl(tm.name, tm.gender),
        publishedAt: new Date(),
      },
    })
    teamMembersCreated.push({ id: member.id })
    for (const slug of tm.areaSlugs) {
      const area = areaBySlug[slug]
      if (area) {
        await prisma.teamMemberArea.create({
          data: { teamMemberId: member.id, areaId: area.id },
        })
      }
    }
  }

  // Projetos
  console.log('🚀  Criando projetos...')
  const projectsCreated: { id: string; areaSlug: string }[] = []

  for (const area of areas) {
    const dataList = projectsByArea[area.slug]
    if (!dataList) continue

    for (const data of dataList) {
      const slug = toSlug(data.title)
      const project = await prisma.project.upsert({
        where: { slug },
        update: {},
        create: {
          title: data.title,
          slug,
          description: data.description,
          content: data.content,
          coverUrl: data.coverUrl,
          featured: data.featured,
          publishedAt: new Date(),
          areaId: area.id,
          eventDate: data.eventDate ? new Date(data.eventDate) : null,
          location: data.location ?? null,
          vacancies: data.vacancies ?? null,
          metrics: data.metrics ?? undefined,
        },
      })
      projectsCreated.push({ id: project.id, areaSlug: area.slug })
    }
  }

  // Testimonials
  console.log('💬  Criando depoimentos...')
  const testimonials = testimonialTemplates.map((t, i) => ({
    name: t.name,
    role: t.role,
    message: t.message,
    publishedAt: new Date(),
  }))
  await prisma.testimonial.createMany({ data: testimonials })

  // Gallery — Project context
  console.log('🖼️ Criando galeria dos projetos...')
  const projectGalleryItems: { id: string }[] = []
  for (const project of projectsCreated) {
    const images = projectGalleryByArea[project.areaSlug] ?? []
    for (const img of images) {
      const created = await prisma.galleryImage.create({
        data: {
          url: img.url,
          caption: img.caption,
          context: 'PROJECT',
          projectId: project.id,
        },
      })
      projectGalleryItems.push({ id: created.id })
    }
  }

  // Gallery — Home context
  console.log('🏠 Criando galeria da home...')
  const homeGalleryItems: { id: string }[] = []
  for (const img of homeGalleryData) {
    const created = await prisma.galleryImage.create({
      data: {
        url: img.url,
        caption: img.caption,
        context: 'HOME',
        projectId: null,
      },
    })
    homeGalleryItems.push({ id: created.id })
  }

  // Volunteers
  console.log('🙋  Criando voluntários...')
  const volunteers = await Promise.all(
    volunteersData.map((v) =>
      prisma.volunteer.create({ data: v })
    )
  )

    // Registrations (inscrever voluntários em eventos)
  console.log('📝  Criando inscrições...')
  if (projectsCreated.length > 0 && volunteers.length > 0) {
    const registrationsData = volunteers.slice(0, 6).map((volunteer, i) => {
      const project = projectsCreated[i % projectsCreated.length]
      return {
        volunteerId: volunteer.id,
        projectId: project.id,
        status: (i < 3 ? 'APPROVED' : 'PENDING') as 'APPROVED' | 'PENDING',
        message: i < 3 ? null : 'Gostaria muito de participar deste evento!',
      }
    })
    await prisma.registration.createMany({ data: registrationsData })
  }

  // Posts
  console.log('📝  Criando posts...')
  await prisma.post.createMany({
    data: postsData.map((post) => ({
      ...post,
      publishedAt: post.publishedAt ?? new Date(),
    })),
  })

  // Stats
  console.log('📊 Criando métricas...')
  const statsCreated: { id: string }[] = []
  for (const s of statsData) {
    const stat = await prisma.stat.create({
      data: { ...s, publishedAt: new Date() },
    })
    statsCreated.push({ id: stat.id })
  }

  // Animal Species
  console.log('🐾 Criando espécies...')
  const speciesData = [{ name: 'Cão' }, { name: 'Gato' }]
  const species = await Promise.all(
    speciesData.map((s) => prisma.animalSpecies.create({ data: s }))
  )
  const speciesByName = Object.fromEntries(species.map((s) => [s.name, s]))

  // Animal Sizes
  console.log('📏 Criando portes...')
  const sizesData = [
    { label: 'Pequeno', description: 'até 10kg' },
    { label: 'Médio', description: '10kg a 25kg' },
    { label: 'Grande', description: 'acima de 25kg' },
  ]
  const sizes = await Promise.all(
    sizesData.map((s) => prisma.animalSize.create({ data: s }))
  )
  const sizeByLabel = Object.fromEntries(sizes.map((s) => [s.label, s]))

  // Animal Age Ranges
  console.log('🎂 Criando faixas etárias...')
  const ageRangesData = [
    { label: 'Filhote', minAge: 0, maxAge: 12 },
    { label: 'Adulto', minAge: 12, maxAge: 96 },
    { label: 'Idoso', minAge: 96, maxAge: null },
  ]
  const ageRanges = await Promise.all(
    ageRangesData.map((a) => prisma.animalAgeRange.create({ data: a }))
  )
  const ageRangeByLabel = Object.fromEntries(ageRanges.map((a) => [a.label, a]))

  // Animals
  console.log('🐕  Criando animais...')
  const animalsData: {
    name: string; slug: string; speciesName: string; breed: string | null
    gender: 'MALE' | 'FEMALE'; sizeLabel: string; ageRangeLabel: string
    birthDate: Date; description: string; content: string; coverUrl: string
    status: 'AVAILABLE' | 'ADOPTED' | 'FOSTERED'; featured: boolean
  }[] = [
    {
      name: 'Thor', slug: 'thor',
      speciesName: 'Cão', breed: 'SRD', gender: 'MALE',
      sizeLabel: 'Grande', ageRangeLabel: 'Adulto',
      birthDate: new Date('2020-03-15'),
      description: 'Cão dócil e brincalhão, ótimo com crianças e outros animais.',
      content: 'Thor foi resgatado pela nossa equipe em janeiro de 2025. Ele estava em situação de abandono em uma região periférica, muito magro e assustado.\n\nApós tratamento veterinário e muito carinho, Thor se recuperou completamente. É um cão de grande porte, mas de coração gigante. Adora brincar, correr no parque e receber carinho na barriga.\n\nThor se dá bem com crianças e outros cães. Ideal para famílias com espaço amplo.',
      coverUrl: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
      status: 'AVAILABLE', featured: true,
    },
    {
      name: 'Luna', slug: 'luna',
      speciesName: 'Gato', breed: 'SRD', gender: 'FEMALE',
      sizeLabel: 'Pequeno', ageRangeLabel: 'Filhote',
      birthDate: new Date('2025-01-10'),
      description: 'Filhote de gata carinhosa e brincalhona, vacinada e castrada.',
      content: 'Luna foi encontrada ainda filhote, sozinha em uma caixa de papelão. Nossa equipe a resgatou e desde então recebeu todos os cuidados necessários.\n\nÉ uma gata muito sociável, adora colo e brincar com brinquedos. Ideal para quem busca uma companheira dócil e afetuosa.',
      coverUrl: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800',
      status: 'AVAILABLE', featured: true,
    },
    {
      name: 'Buddy', slug: 'buddy',
      speciesName: 'Cão', breed: 'Labrador', gender: 'MALE',
      sizeLabel: 'Grande', ageRangeLabel: 'Adulto',
      birthDate: new Date('2019-08-22'),
      description: 'Labrador puro sangue, muito amigável e treinado.',
      content: 'Buddy foi abandonado por seus antigos tutores quando se mudaram de cidade. Ele chegou ao abrigo confuso e triste, mas logo se adaptou.\n\nÉ um cão extremamente inteligente, sabe comandos básicos e é muito sociável. Precisa de espaço para gastar energia. Ideal para tutores experientes.',
      coverUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800',
      status: 'AVAILABLE', featured: false,
    },
    {
      name: 'Mimi', slug: 'mimi',
      speciesName: 'Gato', breed: 'Siamês', gender: 'FEMALE',
      sizeLabel: 'Pequeno', ageRangeLabel: 'Adulto',
      birthDate: new Date('2021-06-01'),
      description: 'Gata siamesa elegante e carinhosa, castrada e vacinada.',
      content: 'Mimi foi resgatada de um abrigo municipal superlotado. Apesar de um início difícil, ela é uma gata muito afetuosa e tranquila.\n\nPrefere ambientes calmos e se dá bem com outros gatos. Ideal para quem busca uma companhia serena.',
      coverUrl: 'https://images.unsplash.com/photo-1533743983669-94fa5c4338ec?w=800',
      status: 'ADOPTED', featured: false,
    },
    {
      name: 'Rex', slug: 'rex',
      speciesName: 'Cão', breed: 'SRD', gender: 'MALE',
      sizeLabel: 'Médio', ageRangeLabel: 'Idoso',
      birthDate: new Date('2016-02-14'),
      description: 'Cão idoso e sábio, merece um lar tranquilo para seus anos dourados.',
      content: 'Rex passou anos em um abrigo antes de chegar até nós. É um cão calmo, educado e muito grato por qualquer atenção que recebe.\n\nPor ser idoso, requer cuidados veterinários regulares. A Ascesa oferece suporte veterinário vitalício para adotantes de animais idosos.',
      coverUrl: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800',
      status: 'AVAILABLE', featured: true,
    },
    {
      name: 'Mel', slug: 'mel',
      speciesName: 'Gato', breed: 'SRD', gender: 'FEMALE',
      sizeLabel: 'Médio', ageRangeLabel: 'Adulto',
      birthDate: new Date('2022-11-30'),
      description: 'Gata dócil que adiciona doçura a qualquer lar.',
      content: 'Mel foi resgatada grávida das ruas. Teve seus filhotes em segurança no abrigo e todos foram adotados.\n\nAgora é a vez dela! Mel é uma gata extremamente carinhosa, adora ficar no colo e ronronar. Ideal para famílias.',
      coverUrl: 'https://images.unsplash.com/photo-1494256997604-768d1f608cac?w=800',
      status: 'FOSTERED', featured: false,
    },
    {
      name: 'Zeca', slug: 'zeca',
      speciesName: 'Cão', breed: 'SRD', gender: 'MALE',
      sizeLabel: 'Pequeno', ageRangeLabel: 'Filhote',
      birthDate: new Date('2025-04-01'),
      description: 'Filhote cheio de energia, ideal para famílias ativas.',
      content: 'Zeca e seus irmãos foram resgatados de uma situação de maus-tratos. Ele é o mais brincalhão da ninhada.\n\nEstá com as vacinas em dia e será castrado assim que atingir a idade recomendada. Cheio de energia e amor para dar!',
      coverUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800',
      status: 'AVAILABLE', featured: false,
    },
    {
      name: 'Nina', slug: 'nina',
      speciesName: 'Gato', breed: 'SRD', gender: 'FEMALE',
      sizeLabel: 'Pequeno', ageRangeLabel: 'Idoso',
      birthDate: new Date('2017-05-20'),
      description: 'Gata idosa e tranquila, busca um lar para viver seus anos dourados.',
      content: 'Nina viveu boa parte da vida nas ruas até ser resgatada. Apesar da idade, é saudável e muito carinhosa.\n\nEla merece um lar onde possa descansar e receber amor. A Ascesa oferece suporte veterinário vitalício para adotantes de animais idosos.',
      coverUrl: 'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=800',
      status: 'AVAILABLE', featured: false,
    },
  ]

  const animals = await Promise.all(
    animalsData.map((a) =>
      prisma.animal.create({
        data: {
          name: a.name,
          slug: a.slug,
          breed: a.breed,
          gender: a.gender,
          birthDate: a.birthDate,
          description: a.description,
          content: a.content,
          coverUrl: a.coverUrl,
          status: a.status,
          featured: a.featured,
          shelterSince: new Date(),
          publishedAt: new Date(),
          speciesId: speciesByName[a.speciesName].id,
          sizeId: sizeByLabel[a.sizeLabel].id,
          ageRangeId: ageRangeByLabel[a.ageRangeLabel].id,
        },
      })
    )
  )
  const animalBySlug = Object.fromEntries(animals.map((a) => [a.slug, a]))

  // Gallery — Animal context
  console.log('🖼️ Criando galeria dos animais...')
  const animalGallery = [
    { slug: 'thor', url: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800', caption: 'Thor feliz no parque' },
    { slug: 'thor', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', caption: 'Thor descansando' },
    { slug: 'luna', url: 'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?w=800', caption: 'Luna brincando' },
    { slug: 'buddy', url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800', caption: 'Buddy no quintal' },
    { slug: 'rex', url: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=800', caption: 'Rex tirando uma soneca' },
  ]
  const animalGalleryItems: { id: string }[] = []
  for (const img of animalGallery) {
    const created = await prisma.galleryImage.create({
      data: {
        url: img.url,
        caption: img.caption,
        context: 'ANIMAL' as const,
        projectId: null,
        animalId: animalBySlug[img.slug].id,
      },
    })
    animalGalleryItems.push({ id: created.id })
  }

  // Payment Methods
  console.log('💳  Criando métodos de pagamento...')
  const pixMethod = await prisma.paymentMethod.create({
    data: {
      type: 'PIX',
      label: 'PIX — CNPJ',
      instructions: 'Use qualquer banco para fazer um PIX usando a chave CNPJ abaixo.',
      isActive: true,
      displayOrder: 0,
    },
  })
  await prisma.pixConfig.create({
    data: {
      id: pixMethod.id,
      key: '12.345.678/0001-99',
      receiverName: 'Associação Ascesa',
      receiverCity: 'São Paulo',
    },
  })

  const bankMethod = await prisma.paymentMethod.create({
    data: {
      type: 'BANK_TRANSFER',
      label: 'Transferência Bancária',
      instructions: 'Depósito ou transferência para a conta corrente da Ascesa.',
      isActive: true,
      displayOrder: 1,
    },
  })
  await prisma.bankConfig.create({
    data: {
      id: bankMethod.id,
      bankName: 'Banco do Brasil',
      agency: '1234-5',
      account: '67890-1',
      accountType: 'Corrente',
    },
  })

  await prisma.paymentMethod.create({
    data: {
      type: 'CASH',
      label: 'Doação em Dinheiro',
      instructions: 'Entre em contato pelo WhatsApp para combinar a entrega da sua doação.',
      isActive: true,
      displayOrder: 2,
    },
  })

  // -------------------------------------------------------
  // REORDER — set order via the same service functions the admin UI uses
  // -------------------------------------------------------
  console.log('🔄 Aplicando ordenação...')

  await reorderGalleryImages(
    projectGalleryItems.map((item, i) => ({ id: item.id, order: i }))
  )
  await reorderGalleryImages(
    homeGalleryItems.map((item, i) => ({ id: item.id, order: i }))
  )
  await reorderGalleryImages(
    animalGalleryItems.map((item, i) => ({ id: item.id, order: i }))
  )

  await reorderTeamMembers(
    teamMembersCreated.map((item, i) => ({ id: item.id, order: i }))
  )

  const statsForReorder = await prisma.stat.findMany({ orderBy: { createdAt: 'asc' } })
  await StatService.reorder(
    statsForReorder.map((item, i) => ({ id: item.id, order: i }))
  )

  await reorderAnimalSpecies(
    species.map((item, i) => ({ id: item.id, order: i }))
  )

  await reorderAnimalSizes(
    sizes.map((item, i) => ({ id: item.id, order: i }))
  )

  await reorderAnimalAgeRanges(
    ageRanges.map((item, i) => ({ id: item.id, order: i }))
  )

  const totalProjects = projectsCreated.length
  const totalTestimonials = testimonials.length
  const totalProjectGallery = projectGalleryItems.length
  const totalAnimalGallery = animalGalleryItems.length
  const totalGallery = totalProjectGallery + homeGalleryItems.length + totalAnimalGallery

  console.log('✅ Seed concluído com sucesso!')
  console.log(` ${areas.length} áreas`)
  console.log(` ${totalProjects} projetos`)
  console.log(` ${teamMembersData.length} membros na equipe`)
  console.log(` ${totalTestimonials} depoimentos`)
  console.log(` ${totalGallery} imagens na galeria`)
  console.log(` ${partnersData.length} parceiros`)
  console.log(` ${volunteers.length} voluntários`)
  console.log(` ${postsData.length} posts`)
  console.log(` ${statsCreated.length} métricas`)
  console.log(` ${species.length} espécies`)
  console.log(` ${sizes.length} portes`)
  console.log(` ${ageRanges.length} faixas etárias`)
  console.log(` ${animals.length} animais`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
