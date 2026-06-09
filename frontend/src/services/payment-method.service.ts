import { prisma } from '@/lib/prisma'
import type { CreatePaymentMethodInput, UpdatePaymentMethodInput } from '@/schemas/payment-method.schema'

type PaymentMethodWithConfig = {
  id: string
  type: string
  label: string
  instructions: string | null
  order: number
  createdAt: Date
  updatedAt: Date
  pixConfig: { id: string; key: string; receiverName: string; receiverCity: string } | null
  bankConfig: { id: string; bankName: string; agency: string; account: string; accountType: string | null } | null
}

export const PaymentMethodService = {
  async findAll() {
    return prisma.paymentMethod.findMany({
      orderBy: { order: 'asc' },
      include: { pixConfig: true, bankConfig: true },
    }) as Promise<PaymentMethodWithConfig[]>
  },

  async findById(id: string) {
    return prisma.paymentMethod.findUnique({
      where: { id },
      include: { pixConfig: true, bankConfig: true },
    }) as Promise<PaymentMethodWithConfig | null>
  },

  async create(data: CreatePaymentMethodInput) {
    return prisma.$transaction(async (tx) => {
      const method = await tx.paymentMethod.create({
        data: {
          type: data.type,
          label: data.label,
          instructions: data.instructions ?? null,
          order: data.order ?? 0,
        },
      })

      if (data.type === 'PIX') {
        await tx.pixConfig.create({
          data: {
            id: method.id,
            key: data.key,
            receiverName: data.receiverName,
            receiverCity: data.receiverCity,
          },
        })
      } else if (data.type === 'BANK_TRANSFER') {
        await tx.bankConfig.create({
          data: {
            id: method.id,
            bankName: data.bankName,
            agency: data.agency,
            account: data.account,
            accountType: data.accountType ?? null,
          },
        })
      }

      return method
    })
  },

  async update(id: string, data: UpdatePaymentMethodInput) {
    return prisma.$transaction(async (tx) => {
      const updateData: Record<string, unknown> = {}
      if (data.label !== undefined) updateData.label = data.label
      if (data.instructions !== undefined) updateData.instructions = data.instructions
      if (data.order !== undefined) updateData.order = data.order
      if (data.type !== undefined) updateData.type = data.type

      const method = await tx.paymentMethod.update({
        where: { id },
        data: updateData,
      })

      if (data.type === 'PIX') {
        await tx.pixConfig.upsert({
          where: { id },
          update: { key: data.key!, receiverName: data.receiverName!, receiverCity: data.receiverCity! },
          create: { id, key: data.key!, receiverName: data.receiverName!, receiverCity: data.receiverCity! },
        })
        await tx.bankConfig.deleteMany({ where: { id } })
      } else if (data.type === 'BANK_TRANSFER') {
        await tx.bankConfig.upsert({
          where: { id },
          update: { bankName: data.bankName!, agency: data.agency!, account: data.account!, accountType: data.accountType ?? null },
          create: { id, bankName: data.bankName!, agency: data.agency!, account: data.account!, accountType: data.accountType ?? null },
        })
        await tx.pixConfig.deleteMany({ where: { id } })
      } else if (data.type === 'CASH') {
        await tx.pixConfig.deleteMany({ where: { id } })
        await tx.bankConfig.deleteMany({ where: { id } })
      }

      return method
    })
  },

  async delete(id: string) {
    return prisma.paymentMethod.delete({ where: { id } })
  },

  async reorder(items: { id: string; order: number }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.paymentMethod.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    )
  },
}

export type { PaymentMethodWithConfig }
