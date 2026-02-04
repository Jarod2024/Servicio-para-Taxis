"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

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

    fetchGlobalData();
    const interval = setInterval(fetchGlobalData, 20000);
    return () => clearInterval(interval);
  }, [fetchGlobalData, router]);

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden px-6 py-10">

      {/* Blob de luz de fondo */}
<div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-[100px] rounded-full animate-pulse"></div>

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Master Control</h1>
            <p className="text-slate-400 font-medium">Panel de Supervisión Global</p>
          </div>
          <button 
            onClick={() => { localStorage.clear(); router.push("/login"); }} 
            className="px-6 py-2 rounded-2xl font-bold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Tabla glass */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] shadow-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-widest">
              <tr>
                <th className="p-6">Viaje</th>
                <th className="p-6">Trayecto</th>
                <th className="p-6">Estado</th>
                <th className="p-6 text-right">Tarifa</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {allTrips.map((t) => (
                <tr key={t.id} className="hover:bg-white/5 transition">

                  <td className="p-6">
                    <p className="font-black text-white">#{t.id}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Cliente ID: {t.clientId}
                    </p>
                  </td>

                  <td className="p-6 text-slate-300 text-sm">
                    {t.origin} <span className="text-slate-500 mx-2">→</span> {t.destination}
                  </td>

                  <td className="p-6">
                    <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase border ${
                      t.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : t.status === 'CANCELLED'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {t.status}
                    </span>
                  </td>

                  <td className="p-6 text-right font-black text-xl text-white">
                    ${t.fare}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}
