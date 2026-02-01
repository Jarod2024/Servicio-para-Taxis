"use client"
import { useState } from "react"
import { useRouter } from "next/navigation" // Importamos para la redirección

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "CLIENT" // Coincide con los roles requeridos
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
      // Ajustamos la ruta para que apunte a /api/auth/register
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("❌ Error al registrar:", data.error)
        setMsg(data.error || "Error al crear la cuenta")
        return
      }

      console.log("✅ Usuario creado:", data)
      setSuccess(true)
      setMsg("¡Cuenta creada con éxito! Redirigiendo...")

      // Limpiamos el formulario
      setForm({ name: "", email: "", password: "", role: "CLIENT" })

      // Redireccionamos al login después de 2 segundos para que el usuario vea el mensaje
      setTimeout(() => {
        router.push("/login")
      }, 2000)

    } catch (err) {
      console.error("🚨 Error de red:", err)
      setMsg("Error de conexión. Verifica que el servidor esté activo.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
          Crear Cuenta
        </h1>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Nombre completo"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />

          <div className="flex flex-col">
            <label className="text-sm text-gray-500 mb-1 ml-1">Tipo de usuario</label>
            <select
              className="border p-3 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-800 bg-white"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option value="CLIENT">Cliente</option>
              <option value="DRIVER">Conductor</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded w-full shadow-md disabled:bg-blue-300"
          >
            {loading ? "Procesando..." : "Registrarse"}
          </button>
        </div>

        {msg && (
          <div className={`mt-4 p-3 rounded text-center text-sm font-medium ${
            success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}>
            {msg}
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            ¿Ya tienes cuenta?{" "}
            <button 
              type="button"
              onClick={() => router.push("/login")}
              className="text-blue-600 font-bold hover:underline"
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </form>
    </div>
  )
}