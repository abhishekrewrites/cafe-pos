import { prisma } from "@/lib/prisma"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import Link from "next/link"

export default async function MenuManagementPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variations: true,
    },
    orderBy: { createdAt: 'desc' }
  })

  // We manually cast the Decimal to string/number when rendering
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Menu Items</h1>
          <p className="text-muted-foreground mt-1">Manage your cafe's products, categories, and variations.</p>
        </div>
        <Link href="/admin/menu/new" className={buttonVariants()}>
          Add Product
        </Link>
      </div>

      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-lg">All Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Base Price</TableHead>
                <TableHead>Variants</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map(product => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {product.category?.name ? (
                      <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic text-sm">None</span>
                    )}
                  </TableCell>
                  <TableCell>₹{Number(product.basePrice).toFixed(2)}</TableCell>
                  <TableCell>
                    {product.variations.length > 0 ? (
                      <span className="text-sm text-muted-foreground">{product.variations.length} options</span>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                    No products found. Add a product to get started!
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
