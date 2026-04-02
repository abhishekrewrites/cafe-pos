"use client"

import { useState } from "react"
import { restockIngredient } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function RestockDropdown({ id, unit }: { id: string, unit: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const restockWithId = restockIngredient.bind(null, id)

  if (!isOpen) {
    return <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>Restock</Button>
  }

  return (
    <form action={restockWithId} className="flex items-center justify-end gap-2" onSubmit={() => setTimeout(() => setIsOpen(false), 100)}>
      <Input 
        type="number" 
        name="addedStock" 
        placeholder={`Qty (${unit})`} 
        className="w-24 h-8 text-sm" 
        required 
        step="0.01"
        min="0"
        autoFocus
      />
      <Button type="submit" size="sm" className="h-8">Add</Button>
      <Button type="button" variant="ghost" size="sm" className="h-8" onClick={() => setIsOpen(false)}>Cancel</Button>
    </form>
  )
}
