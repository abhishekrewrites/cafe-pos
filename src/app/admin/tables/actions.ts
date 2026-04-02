"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createTable(data: FormData) {
  const tableNo = Number(data.get("tableNo"))
  const capacity = Number(data.get("capacity"))
  
  await prisma.table.create({
    data: { tableNo, capacity }
  })
  
  revalidatePath("/admin/tables")
}

export async function deleteTable(id: string) {
  await prisma.table.delete({ where: { id } })
  revalidatePath("/admin/tables")
}

export async function updateTableStatus(id: string, status: string) {
  await prisma.table.update({
    where: { id },
    data: { status }
  })
  revalidatePath("/admin/tables")
}
