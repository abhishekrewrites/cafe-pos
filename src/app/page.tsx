import { prisma } from "@/lib/prisma"
import { ProductGrid } from "@/components/pos/ProductGrid"
import { CartPanel } from "@/components/pos/CartPanel"
import { TableSelector } from "@/components/pos/TableSelector"
import { getSession, logout } from "@/app/actions/auth"

export default async function POSPage() {
  const [categoriesData, productsData, tablesData, sessionUser] = await Promise.all([
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
    prisma.product.findMany({ 
      include: { variations: true },
      orderBy: { name: 'asc' }
    }),
    prisma.table.findMany({ orderBy: { tableNo: 'asc' } }),
    getSession()
  ])

  // Safely serialize Prisma Decimal and Date objects before passing to Client Components
  const categories = JSON.parse(JSON.stringify(categoriesData))
  const products = JSON.parse(JSON.stringify(productsData))
  const tables = JSON.parse(JSON.stringify(tablesData))

  return (
    <div className="flex h-screen bg-[#f8f9fc] overflow-hidden font-sans relative text-slate-800">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10 w-full">
        <header className="bg-white/60 backdrop-blur-2xl border-b border-white/60 px-8 py-5 flex items-center justify-between shrink-0 shadow-[0_4px_40px_rgba(0,0,0,0.03)] z-50">
          <h1 className="text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Cafe<span className="text-slate-800">POS</span>
          </h1>
          <div className="flex items-center gap-6 text-sm font-medium">
            <TableSelector tables={tables} />
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end leading-tight">
                <span className="text-slate-800 font-bold overflow-hidden text-ellipsis whitespace-nowrap">{sessionUser?.name || "System Admin"}</span>
                <span className="text-xs font-semibold text-blue-600">{sessionUser?.role || "ADMIN"}</span>
              </div>
              <form action={logout} className="flex shrink-0">
                <button type="submit" className="w-10 h-10 shadow-sm rounded-full bg-rose-50 flex flex-col items-center justify-center font-bold text-rose-600 border border-rose-200 text-[10px] ring-1 ring-rose-100 shrink-0 hover:bg-rose-100">
                  <span className="uppercase">Lock</span>
                </button>
              </form>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6 lg:px-10 lg:py-8 z-10">
          <ProductGrid categories={categories} products={products} />
        </div>
      </main>

      <aside className="w-[440px] xl:w-[480px] border-l border-white/60 bg-white/70 backdrop-blur-3xl h-full shrink-0 flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.05)] z-20 transition-all duration-300 max-w-full">
        <CartPanel />
      </aside>
    </div>
  )
}
