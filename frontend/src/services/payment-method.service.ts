import { prisma } from '@/lib/prisma'

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

  async create(data: Record<string, unknown>) {
    const { key, receiverName, receiverCity, bankName, agency, account, accountType, ...rest } = data
    const type = data.type as string

    return prisma.$transaction(async (tx) => {
      const method = await tx.paymentMethod.create({
        data: {
          type: type as 'PIX' | 'BANK_TRANSFER' | 'CASH',
          label: rest.label as string,
          instructions: (rest.instructions as string) ?? null,
          isActive: (rest.isActive as boolean) ?? true,
          displayOrder: (rest.displayOrder as number) ?? 0,
        },
      })

      if (type === 'PIX') {
        await tx.pixConfig.create({
          data: {
            id: method.id,
            key: key as string,
            receiverName: receiverName as string,
            receiverCity: receiverCity as string,
          },
        })
      } else if (type === 'BANK_TRANSFER') {
        await tx.bankConfig.create({
          data: {
            id: method.id,
            bankName: bankName as string,
            agency: agency as string,
            account: account as string,
            accountType: (accountType as string) ?? null,
          },
        })
      }

      return method
    })
  },

  async update(id: string, data: Record<string, unknown>) {
    const { key, receiverName, receiverCity, bankName, agency, account, accountType, ...rest } = data
    const type = data.type as string | undefined

    return prisma.$transaction(async (tx) => {
      const updateData: Record<string, unknown> = {}
      if (rest.label !== undefined) updateData.label = rest.label
      if (rest.instructions !== undefined) updateData.instructions = rest.instructions
      if (rest.isActive !== undefined) updateData.isActive = rest.isActive
      if (rest.displayOrder !== undefined) updateData.displayOrder = rest.displayOrder
      if (type !== undefined) updateData.type = type

      const method = await tx.paymentMethod.update({
        where: { id },
        data: updateData as never,
      })

      if (type === 'PIX') {
        await tx.pixConfig.upsert({
          where: { id },
          update: { key: key as string, receiverName: receiverName as string, receiverCity: receiverCity as string },
          create: { id, key: key as string, receiverName: receiverName as string, receiverCity: receiverCity as string },
        })
        await tx.bankConfig.deleteMany({ where: { id } })
      } else if (type === 'BANK_TRANSFER') {
        await tx.bankConfig.upsert({
          where: { id },
          update: { bankName: bankName as string, agency: agency as string, account: account as string, accountType: (accountType as string) ?? null },
          create: { id, bankName: bankName as string, agency: agency as string, account: account as string, accountType: (accountType as string) ?? null },
        })
        await tx.pixConfig.deleteMany({ where: { id } })
      } else if (type === 'CASH') {
        await tx.pixConfig.deleteMany({ where: { id } })
        await tx.bankConfig.deleteMany({ where: { id } })
      }

      return method
    })
  },

  async delete(id: string) {
    return prisma.paymentMethod.delete({ where: { id } })
  },
}

export type { PaymentMethodWithConfig }
