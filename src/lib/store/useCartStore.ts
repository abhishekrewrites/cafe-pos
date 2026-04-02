import { create } from 'zustand'

export interface CartItemOption {
  id: string
  name: string
  priceAdj: number
}

export interface CartItem {
  cartItemId: string
  productId: string
  name: string
  basePrice: number
  quantity: number
  options: CartItemOption[]
}

interface CartState {
  items: CartItem[]
  taxRate: number
  activeTableId: string | null
  setActiveTableId: (id: string | null) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (cartItemId: string) => void
  updateQuantity: (cartItemId: string, quantity: number) => void
  clearCart: () => void
  getSubtotal: () => number
  getTaxAmount: () => number
  getTotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  taxRate: 0.05, // 5% default tax
  activeTableId: null,

  setActiveTableId: (id) => set({ activeTableId: id }),
  
  addToCart: (item) => set((state) => {
    // Check if an identical item exists (same product and same exact options)
    const identicalItemIndex = state.items.findIndex(
      i => i.productId === item.productId && 
           JSON.stringify(i.options) === JSON.stringify(item.options)
    )
    
    if (identicalItemIndex >= 0) {
      const newItems = [...state.items]
      newItems[identicalItemIndex].quantity += item.quantity
      return { items: newItems }
    }
    
    return { items: [...state.items, item] }
  }),
  
  removeFromCart: (cartItemId) => set((state) => ({
    items: state.items.filter(item => item.cartItemId !== cartItemId)
  })),
  
  updateQuantity: (cartItemId, quantity) => set((state) => ({
    items: state.items.map(item => 
      item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item
    )
  })),
  
  clearCart: () => set({ items: [], activeTableId: null }),
  
  getSubtotal: () => {
    return get().items.reduce((total, item) => {
      const itemTotal = item.basePrice + item.options.reduce((sum, opt) => sum + opt.priceAdj, 0)
      return total + (itemTotal * item.quantity)
    }, 0)
  },
  
  getTaxAmount: () => get().getSubtotal() * get().taxRate,
  
  getTotal: () => get().getSubtotal() + get().getTaxAmount()
}))
