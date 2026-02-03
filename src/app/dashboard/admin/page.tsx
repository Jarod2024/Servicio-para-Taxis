"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

// Interfaz para eliminar errores de 'any' (Imagen 48c3a5)
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
  const router = useRouter();
  const [allTrips, setAllTrips] = useState<GlobalTrip[]>([]);

  // Memoizamos la función para que sea estable y no cause bucles (Imagen 64ef23)
  const fetchGlobalData = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/all-trips');
      if (res.ok) {
        const data = await res.json();
        setAllTrips(data.trips || []);
      }
    } catch (error) {
      console.error("Error admin:", error);
    }
  }, []);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "ADMIN") { 
      router.push("/login"); 
      return; 
    }

    // Llamada inicial segura
    fetchGlobalData();

    const interval = setInterval(() => {
      fetchGlobalData();
    }, 20000);

    return () => clearInterval(interval);
  }, [fetchGlobalData, router]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">Master Control</h1>
            <p className="text-slate-500 font-medium">Panel de Supervisión Global</p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); router.push("/login"); }} 
            className="bg-slate-900 text-white px-6 py-2 rounded-2xl font-bold hover:bg-slate-800 transition"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Tabla única de viajes */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/60 overflow-hidden border border-slate-100 mb-12">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase">Viaje</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase">Trayecto (Origen → Destino)</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase">Estado</th>
                <th className="p-6 text-xs font-bold text-slate-400 uppercase text-right">Tarifa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {allTrips.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-6">
                    <p className="text-sm font-black text-slate-800">#{t.id}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Cliente ID: {t.clientId}</p>
                  </td>
                  <td className="p-6 font-medium text-slate-600 text-sm">
                    {t.origin} <span className="text-slate-300 mx-2">→</span> {t.destination}
                  </td>
                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase ${
                      t.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-600' :
                      t.status === 'CANCELLED' ? 'bg-rose-100 text-rose-600' :
                      t.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-6 text-right font-black text-slate-900 text-lg">${t.fare}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </div>
    </div>
  )
}