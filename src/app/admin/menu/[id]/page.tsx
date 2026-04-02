import { prisma } from "@/lib/prisma"
import { EditProductForm } from "./EditProductForm"
import { notFound } from "next/navigation"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany()
  ])
  
  if (!product) {
    notFound()
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        <p className="text-muted-foreground mt-1">Update the details for {product.name}.</p>
      </div>
      
      <EditProductForm product={product} categories={categories} />
    </div>
  )
}
