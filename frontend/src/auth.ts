import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import argon2 from 'argon2'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

// Extende o tipo da sessão para incluir id e role
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'ADMIN' | 'STAFF'
    } & DefaultSession['user']
  }
  interface User {
    role: 'ADMIN' | 'STAFF'
  }
}

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },

  pages: {
    signIn: '/login', // sua página de login
  },

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.name = user.name
        token.email = user.email
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role = token.role as 'ADMIN' | 'STAFF'
      session.user.name = token.name as string
      session.user.email = token.email as string
      return session
    },
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        const user = await prisma.user.findUnique({ where: { email } })

        const dummyHash =
          '$argon2id$v=19$m=65536,t=2,p=1$cHVycG9zZWx5LWZha2UtaGFzaC1zYWx0ZWQ$ZHVtbXlkdW1teWR1bW15ZHVtbXlkdW1teWR1bW15ZHVtbXk'

        const isValid = user
          ? await argon2.verify(user.password, password)
          : await argon2.verify(dummyHash, password).catch(() => false)

        if (!user || !isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
})
