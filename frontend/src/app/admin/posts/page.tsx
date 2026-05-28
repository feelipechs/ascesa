'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminSheet } from '@/components/admin/admin-sheet'
import { PostForm } from '@/components/admin/forms/post-form'
import { usePosts, usePostMutations } from '@/hooks/posts/queries'
import { DeleteDialog } from '@/components/delete-dialog'
import { EmptyState } from '@/components/empty-state'

export default function AdminPostsPage() {
  const { data: posts, isLoading } = usePosts()
  const { remove, isPending } = usePostMutations()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [editingPost, setEditingPost] = useState<null | { id: string }>(null)
  const [deletingPost, setDeletingPost] = useState<null | { id: string }>(null)

  function handleNew() {
    setEditingPost(null)
    setSheetOpen(true)
  }

  function handleEdit(post: { id: string }) {
    setEditingPost(post)
    setSheetOpen(true)
  }

  function handleSheetClose() {
    setSheetOpen(false)
    setEditingPost(null)
  }

  return (
    <div className="px-4 lg:px-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Blog</h1>
        <Button onClick={handleNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Post
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      ) : !posts || posts.length === 0 ? (
        <EmptyState title="Nenhum post encontrado." />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Publicado em</TableHead>
              <TableHead className="w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell className="text-muted-foreground">{post.author ?? '—'}</TableCell>
                <TableCell className="text-muted-foreground">
                  {post.publishedAt ? format(post.publishedAt, 'dd/MM/yyyy') : 'Não publicado'}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" onClick={() => handleEdit(post)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => setDeletingPost({ id: post.id })} className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <AdminSheet
        open={sheetOpen}
        onClose={handleSheetClose}
        title={editingPost ? 'Editar post' : 'Novo post'}
      >
        <PostForm
          postId={editingPost?.id}
          onSuccess={handleSheetClose}
          onCancel={handleSheetClose}
        />
      </AdminSheet>

      <DeleteDialog
        open={!!deletingPost}
        onClose={() => setDeletingPost(null)}
        onConfirm={() => {
          if (deletingPost)
            remove.mutate(deletingPost.id, { onSuccess: () => setDeletingPost(null) })
        }}
        isPending={isPending}
        entity="post"
      />
    </div>
  )
}
