"use client"

import { createProduct } from "../actions"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"

// Note: Using standard HTML select to keep the form data standard, 
// though you can upgrade this to Shadcn Select if you prefer tightly controlled state
export function ProductForm({ categories }: { categories: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createProduct} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Cinnamon Dolce Latte" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Base Price (₹)</Label>
              <Input id="basePrice" name="basePrice" type="number" step="0.01" min="0" required placeholder="4.99" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryId">Category</Label>
              <select 
                id="categoryId" 
                name="categoryId" 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="none">No Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t">
            <Link href="/admin/menu" className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button type="submit">Create Product</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
