"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

interface Trip {
  id: number;
  origin: string;
  destination: string;
  fare: number;
  status: string;
  clientId: number;
}

export default function DriverDashboard() {
  const router = useRouter()
  const [trips, setTrips] = useState<Trip[]>([])
  const [history, setHistory] = useState<Trip[]>([])
  const [driver, setDriver] = useState({ name: "", id: "" })
  const [loading, setLoading] = useState(true)

  // 1. FUNCIÓN DE CARGA MEJORADA: Agregamos cache: 'no-store' para forzar datos nuevos de la DB
  const refreshAllData = useCallback(async (driverId: string) => {
    if (!driverId) return;
    try {
      // Cargar Disponibles
      const resPending = await fetch("/api/trips/pending", { cache: 'no-store' })
      const dataPending = await resPending.json()
      setTrips(dataPending.trips || [])

      // Cargar Historial Personal
      const resHistory = await fetch(`/api/trips/driver/${driverId}`, { cache: 'no-store' })
      if (resHistory.ok) {
        const dataHistory = await resHistory.json()
        setHistory(dataHistory.trips || [])
      }
    } catch (error) {
      console.error("Error en la carga:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 2. EFECTO DE INICIALIZACIÓN: Corregido para evitar "cascading renders" (image_6562e9.png)
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")
    const savedId = localStorage.getItem("userId")
    const savedName = localStorage.getItem("userName")

    if (!token || role !== "DRIVER") {
      router.push("/login")
      return
    }

    // Solo actualizamos el estado si es diferente para evitar bucles infinitos
    if (savedId && driver.id !== savedId) {
      setDriver({ name: savedName || "Conductor", id: savedId })
      refreshAllData(savedId)
    }

    const interval = setInterval(() => {
      if (savedId) refreshAllData(savedId)
    }, 20000)

    return () => clearInterval(interval)
  }, [router, refreshAllData, driver.id]) // Dependencias controladas

  const handleAcceptTrip = async (tripId: number) => {
    try {
      const res = await fetch("/api/trips/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId, driverId: parseInt(driver.id) })
      })

      if (res.ok) {
        alert("✅ Viaje aceptado.")
        // Refresco inmediato de ambas listas
        await refreshAllData(driver.id) 
      } else {
        const errorData = await res.json()
        alert(`❌ No se pudo aceptar: ${errorData.error}`)
      }
    } catch (err) {
      alert("Error de conexión")
    }
  }

  return (
  <div className="relative min-h-screen bg-[#0f172a] overflow-hidden px-6 py-10 text-white">

    {/* Blob de luz de fondo */}
<div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-[100px] rounded-full animate-pulse"></div>

    <div className="relative z-10 max-w-6xl mx-auto">

      {/* NAV */}
      <nav className="flex justify-between items-center mb-12 bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-[28px] shadow-xl">
        <h1 className="text-2xl font-extrabold tracking-tight">🚕 Panel del Conductor</h1>
        <div className="flex items-center gap-5">
          <span className="text-sm text-slate-300">
            Hola, <b className="text-indigo-400">{driver.name}</b>
          </span>
          <button
            onClick={() => { localStorage.clear(); router.push("/login"); }}
            className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 font-semibold hover:bg-red-500/20 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="grid lg:grid-cols-2 gap-10">

        {/* VIAJES DISPONIBLES */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-indigo-400 tracking-wide">Viajes Disponibles</h2>

          {loading ? (
            <div className="text-center py-16 text-slate-400 animate-pulse">Buscando viajes...</div>
          ) : trips.length === 0 ? (
            <div className="p-12 border border-dashed border-white/10 rounded-3xl text-center text-slate-500 bg-white/5 backdrop-blur-xl">
              No hay viajes disponibles ahora mismo.
            </div>
          ) : (
            <div className="space-y-6">
              {trips.map(t => (
                <div key={t.id} className="bg-white/5 backdrop-blur-2xl border border-white/10 p-6 rounded-3xl shadow-lg hover:bg-white/10 transition-all">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-lg">📍 {t.origin}</p>
                      <p className="text-slate-400 text-sm">🏁 {t.destination}</p>
                      <p className="text-indigo-400 font-extrabold mt-2 text-xl">${t.fare}</p>
                    </div>
                    <button
                      onClick={() => handleAcceptTrip(t.id)}
                      className="px-6 py-3 rounded-2xl font-bold text-white bg-gradient-to-br from-indigo-500 to-purple-500 hover:scale-[1.03] hover:shadow-[0_15px_25px_rgba(139,92,246,0.4)] transition"
                    >
                      Aceptar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* HISTORIAL */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-purple-400 tracking-wide">Mi Historial</h2>

          {history.length === 0 ? (
            <div className="p-12 rounded-3xl bg-white/5 backdrop-blur-xl text-center text-slate-500 border border-white/10">
              Aún no has realizado viajes.
            </div>
          ) : (
            <div className="space-y-4">
              {history.map(h => (
                <div key={h.id} className="bg-white/5 backdrop-blur-xl border border-white/10 p-5 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-white">📍 {h.origin} → {h.destination}</p>
                    <span className="text-xs uppercase tracking-widest text-purple-300">
                      {h.status}
                    </span>
                  </div>
                  <p className="text-indigo-400 font-bold text-lg">${h.fare}</p>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  </div>
)


}