"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// In a real app we would use Zod to validate the payload
export async function processOrder({
  items,
  totalAmount,
  paymentMethod,
  orderType,
  tableId,
}: {
  items: any[]
  totalAmount: number
  paymentMethod: string
  orderType: string
  tableId?: string | null
}) {
  if (!items || items.length === 0) {
    throw new Error("Cart is empty")
  }

  // 1. Create the Order transaction
  const order = await prisma.order.create({
    data: {
      totalAmount,
      paymentMethod,
      orderType,
      tableId: tableId || null,
      status: "PENDING",
      items: {
        create: items.map((item) => {
          const itemTotal = item.basePrice + item.options.reduce((sum: number, opt: any) => sum + opt.priceAdj, 0)
          return {
            quantity: item.quantity,
            priceAtTime: itemTotal,
            productId: item.productId,
          }
        }),
      },
    },
  })

  // 1.5 Update Table Status if applicable
  if (tableId) {
    try {
      await prisma.table.update({
        where: { id: tableId },
        data: { status: "OCCUPIED" }
      })
    } catch (error) {
      console.error("Failed to occupy table:", error)
    }
  }

  // 2. Decrement inventory based on ingredients mapped to these products
  try {
    const productIds = items.map((i) => i.productId)
    
    // Fetch mappings
    const productIngredients = await prisma.productIngredient.findMany({
      where: { productId: { in: productIds } },
    })

    // Update ingredients stock for each item in real time without a massive Prisma transaction (since there might be overlapping updates to the same ingredient)
    // In production, you'd aggregate total deductions per ingredient and then do a batch update.
    const deductions = new Map<string, number>()
    
    for (const item of items) {
      const pIngs = productIngredients.filter((pi) => pi.productId === item.productId)
      for (const pIng of pIngs) {
        const amountToDeduct = Number(pIng.quantityUsed) * item.quantity
        const current = deductions.get(pIng.ingredientId) || 0
        deductions.set(pIng.ingredientId, current + amountToDeduct)
      }
    }

    // Execute aggregated deductions
    const deductionPromises = Array.from(deductions.entries()).map(([ingredientId, amount]) => {
      return prisma.ingredient.update({
        where: { id: ingredientId },
        data: { stockLevel: { decrement: amount } }
      })
    })

    await Promise.all(deductionPromises)

  } catch (error) {
    console.error("Failed to decrement inventory, but order was recorded:", error)
  }

  return { success: true, orderId: order.id, orderNumber: order.orderNumber }
}

export async function completeKdsOrder(orderId: string, tableId: string | null) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status: "COMPLETED" }
  })
  
  if (tableId) {
    const pendingOrders = await prisma.order.count({
      where: { tableId, status: "PENDING" }
    })
    
    if (pendingOrders === 0) {
      await prisma.table.update({
        where: { id: tableId },
        data: { status: "AVAILABLE" }
      })
    }
  }
  
  revalidatePath("/kitchen")
  revalidatePath("/admin/tables") // Ensure tables admin views the availability change
}
