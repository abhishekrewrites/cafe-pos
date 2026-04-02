import { prisma } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"
import { RestockDropdown } from "./RestockDropdown"

export default async function InventoryPage() {
  const ingredients = await prisma.ingredient.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground mt-1">Track stock levels, record restocks, and manage ingredients.</p>
        </div>
        <Link href="/admin/inventory/new" className={buttonVariants()}>
          Add Ingredient
        </Link>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg">Ingredient Stock</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Ingredient Name</TableHead>
                <TableHead>Stock Level</TableHead>
                <TableHead>Low Stock Alert</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ingredients.map(ingredient => {
                const stock = Number(ingredient.stockLevel)
                const min = Number(ingredient.minStock)
                const isLow = stock <= min

                return (
                  <TableRow key={ingredient.id}>
                    <TableCell className="font-medium">{ingredient.name}</TableCell>
                    <TableCell>
                      {stock} {ingredient.unit}
                    </TableCell>
                    <TableCell>
                      {isLow ? (
                        <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10">
                          Low Stock (\u2264 {min})
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-sm">Below {min} {ingredient.unit}</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <RestockDropdown id={ingredient.id} unit={ingredient.unit} />
                    </TableCell>
                  </TableRow>
                )
              })}
              {ingredients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-muted-foreground">
                    No ingredients in inventory. Add an ingredient to track stock.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
