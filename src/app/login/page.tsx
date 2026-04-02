"use client"

import { useState, useEffect } from "react"
import { login } from "@/app/actions/auth"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function LoginPage() {
  const [pin, setPin] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const appendPin = (num: string) => {
    if (pin.length < 6) setPin(p => p + num)
  }

  const handleLogin = async () => {
    if (pin.length === 0) return
    setLoading(true)
    const res = await login(pin)
    if (res.success) {
      router.push("/") // POS Terminal
    } else {
      setError(res.error || "Authentication failed")
      setPin("")
      setLoading(false)
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (loading) return
      
      if (e.key >= '0' && e.key <= '9') {
        appendPin(e.key)
      } else if (e.key === 'Backspace') {
        setPin(p => p.slice(0, -1))
      } else if (e.key.toLowerCase() === 'c' || e.key === 'Escape') {
        setPin("")
      } else if (e.key === 'Enter') {
        handleLogin()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pin, loading]) // Re-bind when pin/loading changes so handleLogin closure has fresh state

  return (
    <div className="flex h-screen w-full bg-slate-900 items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="auth-card bg-slate-800/80 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border border-slate-700/50 flex flex-col items-center w-full max-w-sm z-10">
        <h1 className="text-3xl font-black text-white tracking-tight mb-2">Cafe<span className="text-blue-500">POS</span></h1>
        <p className="text-slate-400 font-medium mb-8">Enter your PIN to access terminal</p>

        <div className="flex gap-3 mb-8 h-4">
          {[0, 1, 2, 3].map((_, i) => (
            <motion.div 
              key={i}
              initial={false}
              animate={{
                scale: i < pin.length ? 1.2 : 1,
                backgroundColor: i < pin.length ? '#3b82f6' : '#334155'
              }}
              className="w-4 h-4 rounded-full transition-colors"
            />
          ))}
        </div>

        {error && <p className="text-rose-400 text-sm font-semibold mb-6 animate-pulse">{error}</p>}

        <div className="grid grid-cols-3 gap-4 mb-8 w-full">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "OK"].map(key => (
            <button
              key={key}
              onClick={() => {
                setError("")
                if (key === "C") setPin("")
                else if (key === "OK") handleLogin()
                else appendPin(key)
              }}
              disabled={loading}
              className={`h-16 text-2xl font-semibold rounded-2xl flex items-center justify-center transition-all ${
                key === "C" ? "bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-white" :
                key === "OK" ? "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/50" : 
                "bg-slate-700/50 text-slate-200 hover:bg-slate-600 border border-slate-600/30"
              } active:scale-95 disabled:opacity-50`}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
