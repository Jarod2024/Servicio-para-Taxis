"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

// 1. Definimos la interfaz para evitar el error "Unexpected any"
interface TripHistory {
  id: number;
  origin: string;
  destination: string;
  fare: number;
  status: string;
  driverId?: number | null;
}

export default function ClientDashboard() {
  const router = useRouter()
  const [user, setUser] = useState({ name: "", id: "" })
  const [trip, setTrip] = useState({ origin: "", destination: "" })
  const [msg, setMsg] = useState({ text: "", isError: false })
  const [loading, setLoading] = useState(false)
  
  // SOLUCIÓN Imagen 2ddac0: Usamos la interfaz en lugar de <any[]>
  const [history, setHistory] = useState<TripHistory[]>([])

  // SOLUCIÓN Imagen 2d05db: Definimos la función ANTES del useEffect y con useCallback
  const fetchMyTrips = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/trips/user/${userId}`)
      if (res.ok) {
        const data = await res.json()
        setHistory(data.trips || [])
      }
    } catch (error) {
      console.error("Error al cargar historial", error)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedId = localStorage.getItem("userId");
    const savedName = localStorage.getItem("userName");

    if (!token) {
      router.push("/login");
      return;
    }

    if (savedId && savedName) {
      setUser({ id: savedId, name: savedName });
      fetchMyTrips(savedId);

      // Polling de seguridad cada 10 segundos
      const interval = setInterval(() => fetchMyTrips(savedId), 10000);
      return () => clearInterval(interval);
    }
    // Agregamos router y fetchMyTrips como dependencias para quitar el aviso naranja
  }, [router, fetchMyTrips]);

  const handleRequestTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trip.origin || !trip.destination || !user.id) {
      setMsg({ text: "⚠️ Por favor, completa todos los campos", isError: true });
      return;
    }

    setLoading(true)
    try {
      const res = await fetch("/api/trips/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientId: parseInt(user.id),
          origin: trip.origin,
          destination: trip.destination
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMsg({ text: `✅ ¡Viaje solicitado! Tarifa: $${data.trip.fare}`, isError: false })
        fetchMyTrips(user.id);
      } else {
        setMsg({ text: `❌ ${data.error}`, isError: true })
      }
    } catch (err) {
      setMsg({ text: "❌ Error de conexión", isError: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <nav className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <span className="text-white text-xl">🚕</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">TaxiApp Client</h1>
        </div>
        <div className="flex items-center gap-4">
          <p className="text-sm text-slate-500">Hola, <span className="font-semibold text-slate-800">{user.name}</span></p>
          <button 
            onClick={() => { localStorage.clear(); router.push("/login"); }}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition"
          >
            Salir
          </button>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto py-12 px-6">
        {/* Formulario de solicitud */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-10 border border-slate-100">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Solicitar Viaje</h2>
            <form onSubmit={handleRequestTrip} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Origen"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setTrip({ ...trip, origin: e.target.value })}
              />
              <input
                type="text"
                required
                placeholder="Destino"
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 focus:ring-2 focus:ring-blue-500 outline-none"
                onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl font-bold bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-200"
              >
                {loading ? "Solicitando..." : "Pedir Taxi Ahora"}
              </button>
            </form>
            {msg.text && (
              <p className={`mt-4 text-center font-bold ${msg.isError ? "text-red-500" : "text-green-600"}`}>
                {msg.text}
              </p>
            )}
        </div>

        {/* Historial */}
        <h3 className="text-lg font-bold text-slate-700 mb-4">Mis Viajes</h3>
        <div className="grid gap-4">
          {history.map((t) => (
            <div key={t.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex justify-between">
              <div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${t.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {t.status === 'PENDING' ? 'Pendiente' : 'Aceptado'}
                </span>
                <p className="text-sm font-bold mt-2">📍 {t.origin}</p>
                <p className="text-sm text-slate-500">🏁 {t.destination}</p>
              </div>
              <p className="text-xl font-black text-slate-800">${t.fare}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}