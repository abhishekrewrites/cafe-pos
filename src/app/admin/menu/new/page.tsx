import { prisma } from "@/lib/prisma"
import { ProductForm } from "./ProductForm"

export default async function NewProductPage() {
  const categories = await prisma.category.findMany()
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
        <p className="text-muted-foreground mt-1">Fill out the form below to add a new item to the menu.</p>
      </div>
      
      <ProductForm categories={categories} />
    </div>
  )
}
