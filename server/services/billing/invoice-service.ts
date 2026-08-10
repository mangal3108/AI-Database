import { prisma } from '@/lib/prisma'

export class InvoiceService {
  /**
   * List invoices for an organization.
   */
  static async listInvoices(organizationId: string) {
    const invoices = await prisma.invoice.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      include: { payments: true },
    })

    return invoices
  }

  /**
   * Create a new invoice record.
   */
  static async createInvoice(params: {
    organizationId: string
    subscriptionId?: string
    amount: number
    currency?: string
    status?: 'PAID' | 'OPEN' | 'VOID' | 'UNCOLLECTIBLE'
  }) {
    const count = await prisma.invoice.count({ where: { organizationId: params.organizationId } })
    const number = `INV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`

    return prisma.invoice.create({
      data: {
        organizationId: params.organizationId,
        subscriptionId: params.subscriptionId,
        number,
        amount: params.amount,
        currency: params.currency ?? 'USD',
        status: params.status ?? 'PAID',
      },
    })
  }
}
