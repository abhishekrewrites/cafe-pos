"use client"

import { useCartStore } from "@/lib/store/useCartStore"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { processOrder } from "@/app/actions"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function CartPanel() {
  const [isProcessing, setIsProcessing] = useState(false)
  const { 
    items, 
    activeTableId,
    removeFromCart, 
    updateQuantity, 
    clearCart,
    getSubtotal,
    getTaxAmount,
    getTotal
  } = useCartStore()

  const subtotal = getSubtotal()
  const tax = getTaxAmount()
  const total = getTotal()

  const handleCheckout = async () => {
    if (items.length === 0) return
    setIsProcessing(true)
    try {
      const result = await processOrder({
        items,
        totalAmount: total,
        paymentMethod: "CASH", // Defaulting to Cash for prototype
        orderType: activeTableId ? "DINE_IN" : "TAKEAWAY",
        tableId: activeTableId
      })
      if (result.success) {
        alert(`Order #${result.orderNumber} placed successfully!`)
        clearCart()
      }
    } catch (e) {
      alert("Error processing order.")
      console.error(e)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-slate-50/50 backdrop-blur-3xl overflow-hidden shadow-[-20px_0_40px_rgba(0,0,0,0.03)] border-l border-white/40">
      <div className="px-6 py-5 bg-white/70 backdrop-blur-md shrink-0 border-b border-slate-200/50 flex items-center justify-between z-10 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
        <h2 className="font-extrabold text-xl text-slate-800 tracking-tight">Current Order</h2>
        <motion.span 
          key={items.length}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-full text-slate-600 font-bold tracking-wide"
        >
          {items.reduce((acc, i) => acc + i.quantity, 0)} ITEMS
        </motion.span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 z-0 w-full overflow-x-hidden relative">
        <AnimatePresence mode="popLayout" initial={false}>
          {items.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-slate-400"
            >
              <div className="w-20 h-20 mb-6 bg-slate-100 rounded-full flex items-center justify-center shadow-inner border border-slate-200/50">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1"/>
                  <circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
              </div>
              <p className="font-semibold text-lg text-slate-500">Cart is empty</p>
              <p className="text-sm mt-1 max-w-[200px] text-center">Add some items from the menu to start a new order.</p>
            </motion.div>
          ) : (
            items.map(item => {
              const itemTotal = item.basePrice + item.options.reduce((sum, opt) => sum + opt.priceAdj, 0)
              
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, x: 20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  key={item.cartItemId} 
                  className="flex flex-col gap-2 p-4 bg-white border border-slate-200/60 shadow-sm rounded-2xl group hover:border-blue-300 hover:shadow-md transition-all sm:w-full overflow-hidden"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="font-bold text-[15px] leading-tight text-slate-800 break-words">{item.name}</div>
                    <div className="font-extrabold text-[15px] shrink-0 text-blue-600">₹{(itemTotal * item.quantity).toFixed(2)}</div>
                  </div>
                  
                  {item.options.length > 0 && (
                    <div className="text-xs text-slate-500 pl-3 border-l-[3px] border-indigo-100 space-y-1 my-1">
                      {item.options.map(opt => (
                        <div key={opt.id} className="font-medium">+ {opt.name} (₹{opt.priceAdj.toFixed(2)})</div>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-0.5 shadow-inner">
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-md text-slate-500 hover:bg-white hover:text-black hover:shadow-sm transition-all" onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}>
                        -
                      </Button>
                      <span className="w-8 text-center text-sm font-bold text-slate-800">{item.quantity}</span>
                      <Button variant="ghost" className="h-8 w-8 p-0 rounded-md text-slate-500 hover:bg-white hover:text-black hover:shadow-sm transition-all" onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}>
                        +
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 text-[11px] uppercase font-bold tracking-wider text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg px-3 transition-colors" onClick={() => removeFromCart(item.cartItemId)}>
                      Remove
                    </Button>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-6 shrink-0 shadow-[0_-10px_40px_-5px_rgba(0,0,0,0.06)] border-t border-slate-200/60 relative z-10">
        <div className="space-y-3 text-sm mb-5">
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Subtotal</span>
            <span className="font-bold text-slate-700">₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500 font-medium">
            <span>Tax (5%)</span>
            <span className="font-bold text-slate-700">₹{tax.toFixed(2)}</span>
          </div>
          <motion.div layout className="flex justify-between text-xl font-black pt-3 border-t border-slate-200/70">
            <span className="text-slate-800">Total</span>
            <span className="text-blue-600">₹{total.toFixed(2)}</span>
          </motion.div>
        </div>

        <div className="flex gap-3 mt-4">
          <Button variant="outline" className="flex-1 border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 h-14 rounded-xl font-semibold shadow-sm transition-all" onClick={clearCart} disabled={items.length === 0 || isProcessing}>
            Clear
          </Button>
          <Button 
            className="flex-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-lg h-14 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all w-2/3" 
            disabled={items.length === 0 || isProcessing}
            onClick={handleCheckout}
          >
            {isProcessing ? "Processing..." : `Charge ₹${total.toFixed(2)}`}
          </Button>
        </div>
      </div>
    </div>
  )
}
