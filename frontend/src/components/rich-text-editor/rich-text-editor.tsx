'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import { RichTextProvider } from 'reactjs-tiptap-editor'
import { localeActions } from 'reactjs-tiptap-editor/locale-bundle'

import { Dropcursor, Gapcursor, Placeholder, TrailingNode } from '@tiptap/extensions'
import { Document } from '@tiptap/extension-document'
import { Paragraph } from '@tiptap/extension-paragraph'
import { Text } from '@tiptap/extension-text'
import { HardBreak } from '@tiptap/extension-hard-break'
import { ListItem } from '@tiptap/extension-list-item'
import { TextStyle } from '@tiptap/extension-text-style'

import { Bold, RichTextBold } from 'reactjs-tiptap-editor/bold'
import { Italic, RichTextItalic } from 'reactjs-tiptap-editor/italic'
import { Strike, RichTextStrike } from 'reactjs-tiptap-editor/strike'
import { Code, RichTextCode } from 'reactjs-tiptap-editor/code'
import { Heading, RichTextHeading } from 'reactjs-tiptap-editor/heading'
import { BulletList, RichTextBulletList } from 'reactjs-tiptap-editor/bulletlist'
import { OrderedList, RichTextOrderedList } from 'reactjs-tiptap-editor/orderedlist'
import { Blockquote, RichTextBlockquote } from 'reactjs-tiptap-editor/blockquote'
import { Highlight, RichTextHighlight } from 'reactjs-tiptap-editor/highlight'
import { Link, RichTextLink } from 'reactjs-tiptap-editor/link'
import { Image, RichTextImage } from 'reactjs-tiptap-editor/image'
import { Table, RichTextTable } from 'reactjs-tiptap-editor/table'
import { TextAlign, RichTextAlign } from 'reactjs-tiptap-editor/textalign'
import { TextUnderline, RichTextUnderline } from 'reactjs-tiptap-editor/textunderline'
import { History, RichTextUndo, RichTextRedo } from 'reactjs-tiptap-editor/history'
import { Clear, RichTextClear } from 'reactjs-tiptap-editor/clear'
import { HorizontalRule, RichTextHorizontalRule } from 'reactjs-tiptap-editor/horizontalrule'
import { CodeBlock, RichTextCodeBlock } from 'reactjs-tiptap-editor/codeblock'

import { RichTextBubbleText, RichTextBubbleLink, RichTextBubbleImage, RichTextBubbleTable } from 'reactjs-tiptap-editor/bubble'

import { useTheme } from 'next-themes'
import { createLowlight } from 'lowlight'
import javascript from 'highlight.js/lib/languages/javascript'
import css from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import typescript from 'highlight.js/lib/languages/typescript'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sql from 'highlight.js/lib/languages/sql'

import 'reactjs-tiptap-editor/style.css'
import 'react-image-crop/dist/ReactCrop.css'

localeActions.setLang('pt_BR')

const lowlight = createLowlight()
lowlight.register('javascript', javascript)
lowlight.register('css', css)
lowlight.register('xml', xml)
lowlight.register('typescript', typescript)
lowlight.register('json', json)
lowlight.register('bash', bash)
lowlight.register('sql', sql)

async function uploadImageToR2(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Falha no upload da imagem')
  }

  const { url } = await res.json()
  return url
}

const extensions = [
  Document,
  Paragraph,
  Text,
  Dropcursor,
  Gapcursor,
  HardBreak,
  ListItem,
  TextStyle,
  TrailingNode,
  Placeholder.configure({ placeholder: 'Comece a escrever...' }),

  Bold,
  Italic,
  Strike,
  Code,
  TextUnderline,
  Heading.configure({ levels: [2, 3, 4] }),
  BulletList,
  OrderedList,
  Blockquote,
  Highlight,
  Link.configure({ openOnClick: false }),
  Image.configure({
    resourceImage: 'both',
    upload: uploadImageToR2,
    acceptMimes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'],
    maxSize: 5 * 1024 * 1024,
  }),
  Table.configure({ resizable: true }),
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  History,
  Clear,
  HorizontalRule,
  CodeBlock.configure({ lowlight }),
]

interface RichTextEditorProps {
  content: string
  onChange: (html: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const { resolvedTheme } = useTheme()
  const dark = resolvedTheme === 'dark'

  const editor = useEditor({
    extensions,
    content: content || undefined,
    onUpdate: ({ editor: e }) => {
      onChange(e.getHTML())
    },
    immediatelyRender: false,
  })

  if (!editor) {
    return (
      <div className="min-h-[200px] rounded-md border border-input bg-background px-3 py-2 text-sm text-muted-foreground">
        Carregando editor...
      </div>
    )
  }

  return (
    <RichTextProvider editor={editor} dark={dark}>
      <div className="rounded-md border border-input overflow-hidden">
        <div className="flex items-center gap-0.5 flex-wrap border-b border-input px-1 py-1 bg-background">
          <RichTextUndo />
          <RichTextRedo />
          <div className="w-px h-5 bg-border mx-1" />
          <RichTextHeading />
          <RichTextBold />
          <RichTextItalic />
          <RichTextStrike />
          <RichTextCode />
          <RichTextUnderline />
          <div className="w-px h-5 bg-border mx-1" />
          <RichTextBulletList />
          <RichTextOrderedList />
          <RichTextBlockquote />
          <RichTextCodeBlock />
          <div className="w-px h-5 bg-border mx-1" />
          <RichTextAlign />
          <RichTextHighlight />
          <RichTextLink />
          <RichTextImage />
          <RichTextTable />
          <RichTextHorizontalRule />
          <div className="w-px h-5 bg-border mx-1" />
          <RichTextClear />
        </div>

        <RichTextBubbleText />
        <RichTextBubbleLink />
        <RichTextBubbleImage />
        <RichTextBubbleTable />

        <EditorContent editor={editor} />
      </div>
    </RichTextProvider>
  )
}
