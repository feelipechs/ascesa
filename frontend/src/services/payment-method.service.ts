import { prisma } from '@/lib/prisma'
import type { CreatePaymentMethodInput, UpdatePaymentMethodInput } from '@/schemas/payment-method.schema'

type PaymentMethodWithConfig = {
  id: string
  type: string
  label: string
  instructions: string | null
  isActive: boolean
  displayOrder: number
  createdAt: Date
  updatedAt: Date
  pixConfig: { id: string; key: string; receiverName: string; receiverCity: string } | null
  bankConfig: { id: string; bankName: string; agency: string; account: string; accountType: string | null } | null
}

export const PaymentMethodService = {
  async findAll(activeOnly = false) {
    const where = activeOnly ? { isActive: true } : {}
    return prisma.paymentMethod.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
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
    const { key, receiverName, receiverCity, bankName, agency, account, accountType, ...rest } = data

    return prisma.$transaction(async (tx) => {
      const method = await tx.paymentMethod.create({
        data: {
          type: rest.type,
          label: rest.label,
          instructions: rest.instructions ?? null,
          isActive: rest.isActive ?? true,
          displayOrder: rest.displayOrder ?? 0,
        },
      })

      if (rest.type === 'PIX') {
        await tx.pixConfig.create({
          data: {
            id: method.id,
            key: key!,
            receiverName: receiverName!,
            receiverCity: receiverCity!,
          },
        })
      } else if (rest.type === 'BANK_TRANSFER') {
        await tx.bankConfig.create({
          data: {
            id: method.id,
            bankName: bankName!,
            agency: agency!,
            account: account!,
            accountType: accountType ?? null,
          },
        })
      }

      return method
    })
  },

  async update(id: string, data: UpdatePaymentMethodInput) {
    const { key, receiverName, receiverCity, bankName, agency, account, accountType, ...rest } = data

    return prisma.$transaction(async (tx) => {
      const updateData: Record<string, unknown> = {}
      if (rest.label !== undefined) updateData.label = rest.label
      if (rest.instructions !== undefined) updateData.instructions = rest.instructions
      if (rest.isActive !== undefined) updateData.isActive = rest.isActive
      if (rest.displayOrder !== undefined) updateData.displayOrder = rest.displayOrder
      if (rest.type !== undefined) updateData.type = rest.type

      const method = await tx.paymentMethod.update({
        where: { id },
        data: updateData,
      })

      if (rest.type === 'PIX') {
        await tx.pixConfig.upsert({
          where: { id },
          update: { key: key!, receiverName: receiverName!, receiverCity: receiverCity! },
          create: { id, key: key!, receiverName: receiverName!, receiverCity: receiverCity! },
        })
        await tx.bankConfig.deleteMany({ where: { id } })
      } else if (rest.type === 'BANK_TRANSFER') {
        await tx.bankConfig.upsert({
          where: { id },
          update: { bankName: bankName!, agency: agency!, account: account!, accountType: accountType ?? null },
          create: { id, bankName: bankName!, agency: agency!, account: account!, accountType: accountType ?? null },
        })
        await tx.pixConfig.deleteMany({ where: { id } })
      } else if (rest.type === 'CASH') {
        await tx.pixConfig.deleteMany({ where: { id } })
        await tx.bankConfig.deleteMany({ where: { id } })
      }

      return method
    })
  },

  async delete(id: string) {
    return prisma.paymentMethod.delete({ where: { id } })
  },

  async reorder(items: { id: string; displayOrder: number }[]) {
    return prisma.$transaction(
      items.map((item) =>
        prisma.paymentMethod.update({
          where: { id: item.id },
          data: { displayOrder: item.displayOrder },
        })
      )
    )
  },
}

export type { PaymentMethodWithConfig }
