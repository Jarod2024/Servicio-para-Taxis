"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

// 1. Interfaz para eliminar el error "Unexpected any" (Imagen 48c3a5)
interface GlobalTrip {
  id: number;
  origin: string;
  destination: string;
  fare: number;
  status: string;
  clientId: number;
  driverId?: number | null;
}

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState({ totalTrips: 0, pending: 0, completed: 0 })
  const [allTrips, setAllTrips] = useState<GlobalTrip[]>([])

  // 2. useCallback con array de dependencias vacío para que la función sea estable
  // Esto soluciona el error de "cascading renders" de las imágenes 4928a7 y 492d3d
  const fetchGlobalData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/all-trips')
      if (res.ok) {
        const data = await res.json()
        const trips: GlobalTrip[] = data.trips || []
        
        setAllTrips(trips)
        
        // Usamos el tipo GlobalTrip para evitar el error 'any' (Imagen 48c3a5)
        setStats({
          totalTrips: trips.length,
          pending: trips.filter((t: GlobalTrip) => t.status === 'PENDING').length,
          completed: trips.filter((t: GlobalTrip) => t.status === 'COMPLETED').length
        })
      }
    } catch (error) {
      console.error("Error cargando datos de admin", error)
    }
  }, []) // Importante: dejar vacío para que la referencia no cambie nunca

  // 3. Efecto de control de acceso y polling
  useEffect(() => {
    const role = localStorage.getItem("userRole")
    
    // Seguridad: Redirigir si no es ADMIN
    if (role !== "ADMIN") {
      router.push("/dashboard/client")
      return
    }

    // Ejecutamos la carga inicial
    fetchGlobalData()
    
    // Configuramos el polling (cada 30 segundos)
    const interval = setInterval(() => {
      fetchGlobalData()
    }, 30000)

    // Limpieza al desmontar el componente
    return () => clearInterval(interval)
    
    // Solo dependemos de fetchGlobalData y router
  }, [fetchGlobalData, router]) 

  return (
    <div className="min-h-screen bg-slate-100 p-8">
      {/* Encabezado */}
      <header className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Panel de Control Admin</h1>
          <p className="text-slate-500">Supervisión general de la plataforma</p>
        </div>
        <button 
          onClick={() => { localStorage.clear(); router.push("/login"); }} 
          className="bg-white text-slate-700 px-6 py-2 rounded-xl border font-bold shadow-sm hover:bg-slate-50 transition"
        >
          Cerrar Sesión
        </button>
      </header>

      {/* Tarjetas de Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg">
          <p className="text-blue-100 text-sm font-bold uppercase tracking-wider">Total Viajes</p>
          <p className="text-4xl font-black">{stats.totalTrips}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">En Espera</p>
          <p className="text-4xl font-black text-amber-500">{stats.pending}</p>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
          <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">Completados</p>
          <p className="text-4xl font-black text-emerald-500">{stats.completed}</p>
        </div>
      </div>

      {/* Tabla de Monitorización */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
              <th className="p-6">ID</th>
              <th className="p-6">Estado</th>
              <th className="p-6">Ruta</th>
              <th className="p-6 text-right">Tarifa</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {allTrips.length > 0 ? (
              allTrips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-6 font-mono text-xs text-slate-400">#{t.id}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      t.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 
                      t.status === 'CANCELLED' ? 'bg-red-100 text-red-700' : 
                      t.status === 'PENDING' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-6 text-sm text-slate-600">
                    <span className="font-semibold">{t.origin}</span> → <span className="font-semibold">{t.destination}</span>
                  </td>
                  <td className="p-6 text-right font-black text-slate-900">${t.fare}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-10 text-center text-slate-400 italic">No se encontraron viajes</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}