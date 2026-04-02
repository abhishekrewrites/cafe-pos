import Link from "next/link"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-6">
          <Link href="/admin/menu" className="font-bold text-xl tracking-tight text-blue-600">
            Cafe<span className="text-gray-900">POS</span> Admin
          </Link>
          <nav className="hidden md:flex gap-4 ml-6">
            <Link href="/admin/menu" className="text-sm font-medium hover:text-blue-600 transition-colors">
              Menu Setup
            </Link>
            <Link href="/admin/inventory" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
              Inventory
            </Link>
            <Link href="/admin/tables" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
              Tables
            </Link>
            <Link href="/" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
              Terminal
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  )
}
