"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT"
  })

  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg("")
    setSuccess(false)

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setMsg(data.error || "Error al crear la cuenta")
        return
      }

      setSuccess(true)
      setMsg("¡Cuenta creada con éxito! Redirigiendo...")
      setForm({ name: "", email: "", password: "", role: "CLIENT" })

      setTimeout(() => {
        router.push("/login")
      }, 2000)

    } catch (err) {
      setMsg("Error de conexión. Verifica que el servidor esté activo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden px-4">

      {/* Blob de luz animado */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/40 to-purple-500/40 blur-[80px] rounded-full animate-pulse"></div>

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[32px] shadow-2xl"
      >
        <h1 className="text-white text-3xl font-extrabold text-center mb-2 tracking-tight">
          Crear Cuenta
        </h1>
        <p className="text-slate-400 text-center mb-10">
          Regístrate para comenzar en la plataforma
        </p>

        <div className="space-y-6">

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2 uppercase tracking-widest">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              placeholder="Juan Pérez"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2 uppercase tracking-widest">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2 uppercase tracking-widest">
              Contraseña
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2 uppercase tracking-widest">
              Tipo de Usuario
            </label>
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:bg-white/10 focus:border-indigo-500 transition"
            >
              <option value="CLIENT" className="text-black">Cliente</option>
              <option value="DRIVER" className="text-black">Conductor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full p-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-br from-indigo-500 to-purple-500 hover:scale-[1.02] hover:shadow-[0_20px_25px_-5px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? "Procesando..." : "Registrarse"}
          </button>
        </div>

        {msg && (
          <div className={`mt-6 p-3 rounded-xl text-center text-sm font-semibold ${
            success
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {msg}
          </div>
        )}

        <div className="mt-8 text-center text-slate-400 text-sm">
          ¿Ya tienes cuenta?{" "}
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="text-white font-semibold hover:underline"
          >
            Inicia sesión aquí
          </button>
        </div>
      </form>
    </div>
  )
}
