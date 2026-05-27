export const routes = {
  home: '/',
  projects: '/projetos',
  project: (slug: string) => `/projetos/${slug}`,
  areas: '/areas',
  area: (slug: string) => `/areas/${slug}`,
  about: '/sobre',
  contact: '/contato',
  transparency: '/transparencia',
  donate: '/doar',
} as const
