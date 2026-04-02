import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Shield, Key } from "lucide-react"
import { AddStaffDialog } from "@/components/admin/AddStaffDialog"

export default async function StaffPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Staff Management</h1>
          <p className="text-slate-500">Manage your POS users, PINs, and access roles.</p>
        </div>
        <AddStaffDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Staff</CardTitle>
          <CardDescription>Authentication uses 4-6 digit custom PIN codes at the login terminal.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Auth PIN</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium text-slate-700">{user.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-full w-fit">
                      <Shield className="w-3 h-3" />
                      {user.role}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-slate-500 font-mono">
                      <Key className="w-4 h-4" />
                      ****
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
