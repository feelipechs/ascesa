import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Ocorreu um erro inesperado'
}

export function toSlug(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
  const safePage = Math.min(Math.max(currentPage, 1), totalPages || 1)
  if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
  if (safePage <= 3) return [1, 2, 3, 4, '...', totalPages]
  if (safePage >= totalPages - 2)
    return [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  return [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages]
}
