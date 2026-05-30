'use client'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

type PaginationProps = {
  currentPage: number
  totalPages: number
  pageNumbers?: (number | string)[]
  onPageChange: (page: number) => void
}

export function SharedPagination({ currentPage, totalPages, pageNumbers, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = pageNumbers ?? Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage > 1) onPageChange(currentPage - 1)
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            >
              Anterior
            </PaginationPrevious>
        </PaginationItem>

        {pages.map((page, i) =>
          page === '...' ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  onPageChange(Number(page))
                }}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                if (currentPage < totalPages) onPageChange(currentPage + 1)
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            >
              Próximo
            </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
