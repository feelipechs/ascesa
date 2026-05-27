'use client'

import { FileText, Download } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { AdminActions } from '@/components/admin/admin-actions'
import type { DocumentWithCategory } from '@/types'

type DocumentCardProps = {
  document: DocumentWithCategory
  isAuthenticated?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export function DocumentCard({ document, isAuthenticated, onEdit, onDelete }: DocumentCardProps) {
  return (
    <Card className="group relative flex flex-col h-full transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            {document.year && (
              <Badge variant="secondary" className="shrink-0">
                {document.year}
              </Badge>
            )}
          </div>
          {isAuthenticated && onEdit && onDelete && (
            <AdminActions onEdit={onEdit} onDelete={onDelete} />
          )}
        </div>
        <CardTitle className="mt-3 text-lg leading-tight">{document.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-3">
        <p className="text-sm text-muted-foreground">{document.description}</p>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" size="sm" className="w-full gap-2" asChild>
          <a href={document.fileUrl} target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
            Visualizar
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}
