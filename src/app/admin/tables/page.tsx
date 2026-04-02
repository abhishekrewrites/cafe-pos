import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createTable, deleteTable, updateTableStatus } from "./actions"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default async function TablesPage() {
  const tables = await prisma.table.findMany({ orderBy: { tableNo: 'asc' } })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Table Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Table</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTable} className="flex gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="tableNo">Table Number</Label>
              <Input id="tableNo" name="tableNo" type="number" required min="1" placeholder="1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (Seats)</Label>
              <Input id="capacity" name="capacity" type="number" required min="1" defaultValue="4" />
            </div>
            <Button type="submit">Add Table</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Tables</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table No.</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tables.map(table => (
                <TableRow key={table.id}>
                  <TableCell className="font-medium">Table {table.tableNo}</TableCell>
                  <TableCell>{table.capacity} seats</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      table.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 
                      table.status === 'OCCUPIED' ? 'bg-amber-100 text-amber-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {table.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <form action={async () => {
                      "use server"
                      const newStatus = table.status === 'AVAILABLE' ? 'OCCUPIED' : 'AVAILABLE'
                      await updateTableStatus(table.id, newStatus)
                    }} className="inline-block mr-2">
                      <Button variant="outline" size="sm">Toggle Status</Button>
                    </form>
                    <form action={async () => {
                      "use server"
                      await deleteTable(table.id)
                    }} className="inline-block">
                      <Button variant="destructive" size="sm">Remove</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
              {tables.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No tables configured yet.
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
