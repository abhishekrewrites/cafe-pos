"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  const basePrice = formData.get("basePrice") as string
  const categoryId = formData.get("categoryId") as string
  
  if (!name || !basePrice) {
    throw new Error("Name and Base Price are required.")
  }
  
  await prisma.product.create({
    data: {
      name,
      basePrice: parseFloat(basePrice),
      categoryId: categoryId === "none" ? undefined : categoryId
    }
  })
  
  redirect("/admin/menu")
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const basePrice = formData.get("basePrice") as string
  const categoryId = formData.get("categoryId") as string
  
  if (!name || !basePrice) {
    throw new Error("Name and Base Price are required.")
  }
  
  await prisma.product.update({
    where: { id },
    data: {
      name,
      basePrice: parseFloat(basePrice),
      categoryId: categoryId === "none" ? null : categoryId
    }
  })
  
  redirect("/admin/menu")
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id }
  })
  redirect("/admin/menu")
}
