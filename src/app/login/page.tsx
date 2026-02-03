"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.user.id.toString());
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userRole", data.user.role);

        const userRole = data.user.role;
        setMsg(`¡Bienvenido, ${data.user.name}! 🚀`);

        setTimeout(() => {
          if (userRole === "DRIVER") router.push("/dashboard/driver");
          else if (userRole === "CLIENT") router.push("/dashboard/client");
          else router.push("/dashboard/admin");
        }, 1500);
      } else {
        setMsg(data.error || "Credenciales incorrectas")
      }
    } catch (err) {
      setMsg("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#0f172a] overflow-hidden px-4">

      {/* Blob de luz animado */}
      <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/40 to-purple-500/40 blur-[80px] rounded-full animate-pulse"></div>

      <form 
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[32px] shadow-2xl"
      >
        <h1 className="text-white text-3xl font-extrabold text-center mb-2 tracking-tight">Bienvenido</h1>
        <p className="text-slate-400 text-center mb-10">Ingresa tus credenciales para continuar</p>

        <div className="space-y-6">

          <div>
            <label className="block text-xs font-semibold text-slate-200 mb-2 uppercase tracking-widest">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              placeholder="hola@codelink.com"
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition"
              onChange={(e) => setEmail(e.target.value)}
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
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:bg-white/10 focus:border-indigo-500 focus:shadow-[0_0_20px_rgba(99,102,241,0.2)] transition"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            disabled={loading}
            className="w-full p-4 rounded-2xl font-bold text-white text-lg bg-gradient-to-br from-indigo-500 to-purple-500 hover:scale-[1.02] hover:shadow-[0_20px_25px_-5px_rgba(168,85,247,0.5)] transition-all disabled:opacity-50"
          >
            {loading ? "Verificando..." : "Iniciar Sesión"}
          </button>
        </div>

        {msg && (
          <div className={`mt-6 p-3 rounded-xl text-center text-sm font-semibold ${
            msg.includes("Bienvenido")
              ? "bg-green-500/10 text-green-400 border border-green-500/20"
              : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {msg}
          </div>
        )}

        <a 
  href="/register" 
  className="block mt-8 text-center text-slate-400 text-sm hover:text-white transition"
>
  ¿No tienes cuenta? Regístrate aquí
</a>
      </form>
    </div>
  )
}
