"use server"

import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function login(pin: string) {
  // Bootstrap standard admin user if DB is fresh
  const count = await prisma.user.count()
  if (count === 0 && pin === "1234") {
    const admin = await prisma.user.create({ data: { name: "System Admin", pin: "1234", role: "ADMIN" } })
    const cookieStore = await cookies()
    cookieStore.set("sessionId", admin.id, { httpOnly: true, secure: true, path: '/' })
    return { success: true }
  }

  const user = await prisma.user.findUnique({ where: { pin } })
  if (!user) return { success: false, error: "Invalid PIN" }
  
  const cookieStore = await cookies()
  cookieStore.set("sessionId", user.id, { httpOnly: true, secure: true, path: '/' })
  return { success: true }
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("sessionId")?.value
  if (!sessionId) return null
  
  return await prisma.user.findUnique({ where: { id: sessionId } })
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete("sessionId")
  redirect("/login")
}

export async function createStaff(formData: FormData) {
  const name = formData.get("name") as string
  const role = formData.get("role") as string
  const pin = formData.get("pin") as string
  
  if (!name || !role || !pin || pin.length < 4) return { error: "Invalid data" }
  
  try {
    await prisma.user.create({ data: { name, role, pin } })
    revalidatePath("/admin/staff")
    return { success: true }
  } catch (e) {
    return { error: "PIN might already be in use" }
  }
}
