"use client"

import { useState, useMemo } from "react"
import { useCartStore } from "@/lib/store/useCartStore"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ProductGrid({ categories, products }: { categories: any[], products: any[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const addToCart = useCartStore(state => state.addToCart)

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === "all" || p.categoryId === activeCategory
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [products, activeCategory, searchQuery])

  const handleProductClick = (product: any) => {
    // For simplicity, we add the base product immediately. 
    // In a full implementation, if product.variations.length > 0, we would open an Options Dialog.
    addToCart({
      cartItemId: Date.now().toString(),
      productId: product.id,
      name: product.name,
      basePrice: Number(product.basePrice),
      quantity: 1,
      options: []
    })
  }

  return (
    <div className="space-y-6 flex flex-col h-full text-slate-800">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between shrink-0 pt-2">
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide flex-1 w-full md:w-auto">
          <Button 
            variant={activeCategory === "all" ? "default" : "outline"}
            onClick={() => setActiveCategory("all")}
            className={`rounded-full px-6 transition-all duration-300 font-semibold shadow-sm shrink-0 ${activeCategory === "all" ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
          >
            All Items
          </Button>
          {categories.map(cat => (
            <Button 
              key={cat.id} 
              variant={activeCategory === cat.id ? "default" : "outline"}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-full px-6 transition-all duration-300 font-semibold shadow-sm shrink-0 ${activeCategory === cat.id ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-transparent' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600'}`}
            >
              {cat.name}
            </Button>
          ))}
        </div>
        
        <div className="relative w-full md:w-72 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 h-10 rounded-full bg-white/80 backdrop-blur-sm border-slate-200/60 shadow-sm focus-visible:ring-blue-500/30 transition-all font-medium"
          />
        </div>
      </div>

      <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 auto-rows-max">
        <AnimatePresence mode="popLayout">
          {filteredProducts.map((product, idx) => {
            const price = Number(product.basePrice)
            return (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ duration: 0.3, delay: idx * 0.03 }}
                whileHover={{ y: -4, scale: 1.02, transition: { duration: 0.2, delay: 0 } }}
                whileTap={{ scale: 0.97 }}
                key={product.id}
                className="h-full"
              >
                <Card 
                  className="cursor-pointer overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:border-blue-300 transition-all duration-300 flex flex-col h-36 bg-white/80 backdrop-blur-sm group rounded-2xl relative"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  <CardContent className="p-5 flex flex-col justify-between h-full relative z-10 w-full">
                    <div className="font-bold text-[15px] leading-tight text-slate-800 line-clamp-2 group-hover:text-blue-700 transition-colors w-full break-words">{product.name}</div>
                    <div className="flex justify-between items-end mt-2">
                      <span className="font-extrabold text-lg text-blue-600">₹{price.toFixed(2)}</span>
                      {product.variations?.length > 0 && (
                        <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold bg-slate-100 px-2 py-1 rounded-full">Options</span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </AnimatePresence>
        {filteredProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-16 text-center text-slate-400 bg-white/50 backdrop-blur-sm rounded-2xl border border-dashed border-slate-300 flex flex-col items-center justify-center">
            <div className="text-4xl mb-3">☕️</div>
            <p className="font-medium">No products found</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
