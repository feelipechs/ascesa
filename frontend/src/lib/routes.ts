export const routes = {
  home: '/',
  projects: '/projetos',
  project: (slug: string) => `/projetos/${slug}`,
  areas: '/areas',
  area: (slug: string) => `/areas/${slug}`,
  animals: '/animais',
  animal: (slug: string) => `/animais/${slug}`,
  about: '/sobre',
  contact: '/contato',
  transparency: '/transparencia',
  donate: '/doacoes',
} as const
