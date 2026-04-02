"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createStaff } from "@/app/actions/auth"

export function AddStaffDialog() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function action(formData: FormData) {
    setLoading(true)
    const res = await createStaff(formData)
    setLoading(false)
    if (res.error) setError(res.error)
    else {
      setOpen(false)
      setError("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wide h-10 px-4 py-2 rounded-md transition-colors text-sm shadow-sm">
        + Add Staff Member
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Staff User</DialogTitle>
        </DialogHeader>
        <form action={action} className="space-y-5 pt-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-semibold rounded-lg border border-red-200">{error}</div>}
          
          <div className="space-y-2">
            <Label className="font-bold text-slate-700">Full Name</Label>
            <Input name="name" required placeholder="John Doe" />
          </div>
          
          <div className="space-y-2">
            <Label className="font-bold text-slate-700">Access Role</Label>
            <Select name="role" defaultValue="CASHIER">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">System Admin</SelectItem>
                <SelectItem value="MANAGER">Store Manager</SelectItem>
                <SelectItem value="CASHIER">Cashier (POS)</SelectItem>
                <SelectItem value="CHEF">Chef (KDS)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="font-bold text-slate-700">Authentication PIN</Label>
            <Input 
              name="pin" 
              type="password" 
              inputMode="numeric" 
              pattern="[0-9]{4,6}" 
              placeholder="4 to 6 numeric digits" 
              required 
            />
            <p className="text-[11px] text-slate-500 font-medium tracking-wide">Must be completely unique numeric.</p>
          </div>
          
          <Button type="submit" disabled={loading} className="w-full mt-6 bg-blue-600 text-white font-bold hover:bg-blue-500">
            {loading ? "Creating Profile..." : "Create Profile"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
