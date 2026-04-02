"use client"

import { updateProduct, deleteProduct } from "../actions"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"

export function EditProductForm({ product, categories }: { product: any, categories: any[] }) {
  const updateProductWithId = updateProduct.bind(null, product.id)
  const deleteProductWithId = deleteProduct.bind(null, product.id)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updateProductWithId} className="space-y-6" id="edit-form">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" name="name" required defaultValue={product.name} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basePrice">Base Price (₹)</Label>
                <Input id="basePrice" name="basePrice" type="number" step="0.01" min="0" required defaultValue={Number(product.basePrice)} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryId">Category</Label>
                <select 
                  id="categoryId" 
                  name="categoryId" 
                  defaultValue={product.categoryId || "none"}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="none">No Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-between border-t">
              <Button type="submit" formAction={deleteProductWithId} variant="destructive">
                Delete Product
              </Button>
              <div className="flex gap-3">
                <Link href="/admin/menu" className={buttonVariants({ variant: "outline" })}>
                  Cancel
                </Link>
                <Button type="submit">Save Changes</Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
