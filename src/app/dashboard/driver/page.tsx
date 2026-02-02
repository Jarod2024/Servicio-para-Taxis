"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

// Definimos una interfaz para el tipado de los viajes y evitar el error "any"
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
  const [driver, setDriver] = useState({ name: "", id: "" })
  const [loading, setLoading] = useState(true)

  // 1. SOLUCIÓN ERROR image_2d05db: Definimos la función ANTES del useEffect
  // Usamos useCallback para que la función sea estable y no cause renders infinitos
  const fetchPendingTrips = useCallback(async () => {
    try {
      const res = await fetch("/api/trips/pending")
      if (!res.ok) throw new Error("Error al obtener viajes")
      const data = await res.json()
      setTrips(data.trips || [])
    } catch (error) {
      console.error("Error cargando viajes:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 2. Gestión de Sesión y Carga Inicial
  useEffect(() => {
    const token = localStorage.getItem("token")
    const role = localStorage.getItem("userRole")

    // Validación de seguridad para el perfil de conductor
    if (!token || role !== "DRIVER") {
      router.push("/login")
      return
    }

    setDriver({
      name: localStorage.getItem("userName") || "Conductor",
      id: localStorage.getItem("userId") || ""
    })

    fetchPendingTrips()
  }, [router, fetchPendingTrips]) // Dependencias completas para evitar errores de linting

  const handleAcceptTrip = async (tripId: number) => {
    try {
      const res = await fetch("/api/trips/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          tripId, 
          driverId: parseInt(driver.id) 
        })
      })

      if (res.ok) {
        alert("✅ Viaje aceptado. ¡Iniciando recorrido!")
        fetchPendingTrips() // Refrescar la lista automáticamente
      } else {
        const errorData = await res.json()
        alert(`❌ Error: ${errorData.error}`)
      }
    } catch (err) {
      alert("Error de conexión al aceptar el viaje")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Navbar Superior */}
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-green-600 p-2 rounded-lg text-white">🚕</div>
          <h1 className="text-xl font-bold text-gray-800">Panel de Conductor</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Conductor: <span className="font-bold text-gray-800">{driver.name}</span></span>
          <button 
            onClick={() => { localStorage.clear(); router.push("/login"); }}
            className="bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition"
          >
            Salir
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto py-10 px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-extrabold text-gray-800">Viajes Disponibles</h2>
          <p className="text-gray-500">Selecciona un viaje para empezar a ganar dinero.</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Cargando viajes disponibles...</div>
        ) : trips.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg italic">No hay solicitudes pendientes en este momento.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {trips.map((trip) => (
              <div key={trip.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="p-6 flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">ESTIMADO: ${trip.fare}</span>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Recogida</p>
                      <p className="text-gray-800 font-semibold text-lg">📍 {trip.origin}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase font-bold text-gray-400 tracking-wider">Destino</p>
                      <p className="text-gray-600 font-medium">🏁 {trip.destination}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleAcceptTrip(trip.id)}
                    className="w-full md:w-auto bg-green-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-green-700 transform active:scale-95 transition-all shadow-lg shadow-green-100"
                  >
                    Aceptar Viaje
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}