"use server"

import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function createIngredient(formData: FormData) {
  const name = formData.get("name") as string
  const unit = formData.get("unit") as string
  const minStock = parseFloat(formData.get("minStock") as string) || 0
  
  if (!name || !unit) {
    throw new Error("Name and unit are required.")
  }
  
  await prisma.ingredient.create({
    data: { name, unit, minStock }
  })
  
  revalidatePath("/admin/inventory")
  redirect("/admin/inventory")
}

export async function restockIngredient(id: string, formData: FormData) {
  const addedStock = parseFloat(formData.get("addedStock") as string) || 0
  
  if (addedStock > 0) {
    await prisma.ingredient.update({
      where: { id },
      data: {
        stockLevel: { increment: addedStock }
      }
    })
  }
  
  revalidatePath("/admin/inventory")
}

export async function deleteIngredient(id: string) {
  await prisma.ingredient.delete({
    where: { id }
  })
  
  revalidatePath("/admin/inventory")
}
