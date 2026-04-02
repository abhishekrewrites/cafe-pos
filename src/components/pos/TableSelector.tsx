"use client"

import { useCartStore } from "@/lib/store/useCartStore"
import { Button } from "@/components/ui/button"
import { useState, useRef, useEffect } from "react"

export function TableSelector({ tables }: { tables: any[] }) {
  const { activeTableId, setActiveTableId } = useCartStore()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const activeTable = tables.find(t => t.id === activeTableId)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <Button 
        variant={activeTable ? "default" : "outline"} 
        className={`w-[180px] justify-between shadow-sm ${activeTable ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white hover:bg-slate-50'}`}
        onClick={() => setOpen(!open)}
      >
        {activeTable ? `Table ${activeTable.tableNo}` : "Select Table"}
        <span className="text-xs opacity-70">▼</span>
      </Button>
      
      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-3">
          <div className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Select Table</div>
          <div className="grid grid-cols-4 gap-2">
            {tables.map(table => (
              <Button
                key={table.id}
                variant={activeTableId === table.id ? "default" : (table.status === 'AVAILABLE' ? "outline" : "secondary")}
                className={`h-10 px-0 ${table.status !== 'AVAILABLE' && activeTableId !== table.id ? 'opacity-40 hover:opacity-100' : ''}`}
                onClick={() => {
                  setActiveTableId(table.id)
                  setOpen(false)
                }}
              >
                {table.tableNo}
              </Button>
            ))}
          </div>
          {tables.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-4">No tables found</div>
          )}
          <div className="mt-3 pt-3 border-t flex justify-end">
            <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => {
              setActiveTableId(null)
              setOpen(false)
            }}>
              Clear Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
