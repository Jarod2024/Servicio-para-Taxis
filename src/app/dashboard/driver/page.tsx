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
    <div className="min-h-screen bg-gray-50 p-6">
      <nav className="flex justify-between items-center mb-10 bg-white p-4 rounded-xl shadow-sm border">
        <h1 className="text-xl font-bold text-gray-800">🚕 Panel de Conductor</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">Hola, <b className="text-green-600">{driver.name}</b></span>
          <button onClick={() => { localStorage.clear(); router.push("/login"); }} className="text-red-600 text-sm font-bold hover:underline">Salir</button>
        </div>
      </nav>

      <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
        {/* Columna: Disponibles */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2">
            <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
            Disponibles
          </h2>
          <div className="space-y-4">
            {loading ? <p className="text-gray-400">Buscando viajes...</p> : trips.length === 0 ? (
              <div className="p-10 border-2 border-dashed rounded-2xl text-center text-gray-400">
                No hay viajes pendientes en tu zona.
              </div>
            ) : (
              trips.map(t => (
                <div key={t.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition">
                  <div>
                    <p className="font-bold text-gray-800">📍 {t.origin}</p>
                    <p className="text-gray-500 text-sm">🏁 {t.destination}</p>
                    <p className="text-green-600 font-black mt-2 text-lg">${t.fare}</p>
                  </div>
                  <button onClick={() => handleAcceptTrip(t.id)} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-green-700 active:scale-95 transition-all">
                    Aceptar
                  </button>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Columna: Mi Historial */}
        <section>
          <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            Mi Historial
          </h2>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-gray-400 italic bg-gray-100 p-6 rounded-2xl text-center">Aún no has aceptado ningún viaje.</p>
            ) : (
              history.map(h => (
                <div key={h.id} className="bg-white p-4 rounded-xl flex justify-between items-center border border-gray-200 opacity-90">
                  <div>
                    <p className="text-sm font-bold text-gray-700">📍 {h.origin} → {h.destination}</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold ${h.status === 'ACCEPTED' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                      {h.status}
                    </span>
                  </div>
                  <p className="font-black text-gray-600">${h.fare}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

    </div>
  )
}