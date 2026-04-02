import { prisma } from "@/lib/prisma"
import { completeKdsOrder } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

export default async function KitchenDisplaySystem() {
  const pendingOrders = await prisma.order.findMany({
    where: { status: "PENDING" },
    include: { 
      items: { include: { product: true } },
      table: true 
    },
    orderBy: { createdAt: 'asc' }
  })

  // Grouping orders for basic UI logic
  const now = new Date()

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Kitchen Display System</h1>
          <p className="text-slate-400 mt-1">Total pending active tickets: <span className="font-bold text-white">{pendingOrders.length}</span></p>
        </div>
        <div className="flex gap-4">
          <div className="px-5 py-2 rounded-full bg-slate-800 border border-slate-700 font-mono shadow-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Live View (Auto-refreshes)
          </div>
        </div>
      </div>

      {pendingOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-slate-800 rounded-3xl">
          <div className="text-6xl mb-4 opacity-50">🍽️</div>
          <h2 className="text-2xl font-semibold text-slate-400">No active orders</h2>
          <p className="text-slate-500 mt-2">The kitchen is clear. Good job!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start">
          {pendingOrders.map(order => {
            const timeDiffMins = Math.floor((now.getTime() - order.createdAt.getTime()) / 60000)
            const isUrgent = timeDiffMins > 15
            const isWarning = timeDiffMins > 10

            return (
              <Card 
                key={order.id} 
                className={`bg-slate-800 border-t-4 border-l-0 border-r-0 border-b-0 shadow-lg ${isUrgent ? 'border-t-rose-500' : isWarning ? 'border-t-amber-500' : 'border-t-blue-500'} overflow-hidden relative`}
              >
                <CardHeader className="pb-3 border-b border-slate-700/50 bg-slate-800/80">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-white font-black tracking-widest uppercase">
                        #{order.orderNumber.toString().padStart(4, '0')}
                      </CardTitle>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded ${order.orderType === 'DINE_IN' ? 'bg-indigo-500/20 text-indigo-300' : order.orderType === 'DELIVERY' ? 'bg-orange-500/20 text-orange-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                          {order.orderType.replace('_', ' ')}
                        </span>
                        {order.table && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-blue-500/20 text-blue-300">
                            Table {order.table.tableNo}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`font-mono font-bold px-2 py-1 rounded-md text-sm ${isUrgent ? 'bg-rose-500/20 text-rose-400' : isWarning ? 'bg-amber-500/20 text-amber-400' : 'bg-slate-700 text-slate-300'}`}>
                      {timeDiffMins}m
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <ul className="divide-y divide-slate-700/50">
                    {order.items.map(item => (
                      <li key={item.id} className="p-4 flex gap-3 hover:bg-slate-700/20 transition-colors">
                        <div className="font-bold text-lg text-white font-mono bg-slate-700 w-8 h-8 flex items-center justify-center rounded shrink-0">
                          {item.quantity}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-100 text-[15px]">{item.product.name}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="p-4 bg-slate-800 border-t border-slate-700/50">
                    <form action={completeKdsOrder.bind(null, order.id, order.tableId)}>
                      <Button type="submit" size="lg" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-12 shadow-sm shadow-emerald-900/50">
                        Mark Ready
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
