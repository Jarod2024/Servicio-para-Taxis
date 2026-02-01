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
      // 1. Apuntamos a la ruta que configuramos
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
  localStorage.setItem("token", data.token);
  
  // Guardamos usando los nombres que vienen en tu route.ts
  const userRole = data.user.role; 
  const userName = data.user.name;

  setMsg(`¡Bienvenido, ${userName}! 🚀`);

      setTimeout(() => {
        // IMPORTANTE: Verifica si en tu DB guardaste "CLIENT" o "CLIENTE"
       // Los strings deben ser EXACTOS
        if (userRole === "DRIVER") {
         router.push("/dashboard/driver");
    } else if (userRole === "CLIENT") {
      router.push("/dashboard/client");
    } else {
      // Si llega aquí es porque userRole no es ni "DRIVER" ni "CLIENT"
      console.log("Rol no reconocido, enviando a admin:", userRole);
      router.push("/dashboard/admin");
    }
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-blue-500 p-4">
      <form 
        onSubmit={handleLogin} 
        className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Bienvenido
        </h1>
        
        <p className="text-gray-500 text-center mb-8">Ingresa tus credenciales para continuar</p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
            <input
              type="email"
              placeholder="tu@correo.com"
              required
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 outline-none text-gray-800"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 w-full rounded-lg transition-all shadow-lg disabled:bg-blue-300"
          >
            {loading ? "Verificando..." : "Entrar"}
          </button>
        </div>

        {msg && (
          <div className={`mt-6 p-3 rounded-lg text-center text-sm font-semibold ${
            msg.includes("exitoso") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}>
            {msg}
          </div>
        )}

        <div className="mt-8 text-center border-t pt-6">
          <p className="text-gray-600">
            ¿No tienes cuenta?{" "}
            <button 
              type="button"
              onClick={() => router.push("/register")}
              className="text-blue-600 font-bold hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}