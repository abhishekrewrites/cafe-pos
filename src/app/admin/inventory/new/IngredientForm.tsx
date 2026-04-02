"use client"

import { createIngredient } from "../actions"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"

export function IngredientForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Ingredient Details</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={createIngredient} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required placeholder="e.g. Milk, Espresso Beans" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit">Unit of Measurement</Label>
              <Input id="unit" name="unit" required placeholder="Liters, kg, pcs" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minStock">Low Stock Alert Threshold</Label>
              <Input id="minStock" name="minStock" type="number" step="0.01" min="0" required placeholder="10" />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-6">
            <Link href="/admin/inventory" className={buttonVariants({ variant: "outline" })}>
              Cancel
            </Link>
            <Button type="submit">Create Ingredient</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
