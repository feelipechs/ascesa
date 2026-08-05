import { NextResponse } from 'next/server'

export type PaginationMeta = {
  total: number
  page: number
  limit: number
  totalPages: number
}

export function paginatedResponse<T>(data: T[], meta: PaginationMeta) {
  return NextResponse.json({ data, meta })
}

export function calculatePaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 1,
  }
}
