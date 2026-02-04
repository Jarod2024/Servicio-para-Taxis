"use client"
import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

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
  const [history, setHistory] = useState<TripHistory[]>([])

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

  const handleCancelTrip = async (tripId: number) => {
    if (!confirm("¿Estás seguro de que deseas cancelar esta solicitud?")) return;
    try {
      const res = await fetch("/api/trips/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tripId })
      });

      if (res.ok) {
        setMsg({ text: "✅ Solicitud eliminada correctamente", isError: false });
        fetchMyTrips(user.id);
      } else {
        const data = await res.json();
        setMsg({ text: `❌ ${data.error}`, isError: true });
      }
    } catch {
      setMsg({ text: "❌ Error al conectar con el servidor", isError: true });
    }
  };

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
      const interval = setInterval(() => fetchMyTrips(savedId), 10000);
      return () => clearInterval(interval);
    }
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
    } catch {
      setMsg({ text: "❌ Error de conexión", isError: true })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden pb-20">

      {/* Blob de luz de fondo */}
<div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-500/30 to-purple-500/30 blur-[100px] rounded-full animate-pulse"></div>

      {/* Navbar */}
      <nav className="relative z-10 backdrop-blur-xl bg-white/5 border-b border-white/10 px-8 py-5 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">🚕 TaxiApp Client</h1>
        <div className="flex items-center gap-6">
          <p className="text-sm text-slate-300">Hola, <span className="font-bold text-white">{user.name}</span></p>
          <button
            onClick={() => { localStorage.clear(); router.push("/login"); }}
            className="px-4 py-2 rounded-xl bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
          >
            Salir
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-2xl mx-auto py-14 px-6">

        {/* Solicitar viaje */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[28px] p-8 shadow-2xl mb-12">
          <h2 className="text-2xl font-extrabold mb-6">Solicitar Viaje</h2>

          <form onSubmit={handleRequestTrip} className="space-y-5">
            <input
              type="text"
              required
              placeholder="📍 Origen"
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              onChange={(e) => setTrip({ ...trip, origin: e.target.value })}
            />
            <input
              type="text"
              required
              placeholder="🏁 Destino"
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
              onChange={(e) => setTrip({ ...trip, destination: e.target.value })}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full p-4 rounded-2xl font-bold text-lg bg-gradient-to-br from-indigo-500 to-purple-500 hover:scale-[1.02] transition disabled:opacity-50"
            >
              {loading ? "Solicitando..." : "Pedir Taxi Ahora"}
            </button>
          </form>

          {msg.text && (
            <div className={`mt-6 text-center font-semibold text-sm ${
              msg.isError ? "text-red-400" : "text-green-400"
            }`}>
              {msg.text}
            </div>
          )}
        </div>

        {/* Historial */}
        <h3 className="text-lg font-bold mb-5 text-slate-300">Mis Viajes</h3>

        <div className="space-y-4">
          {history.filter(t => t.status !== 'CANCELLED').map(t => (
            <div key={t.id} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex justify-between items-center hover:border-indigo-500/40 transition">

              <div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  t.status === 'PENDING'
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {t.status === 'PENDING' ? '⏳ Pendiente' : '✅ Aceptado'}
                </span>

                <p className="mt-3 font-semibold">📍 {t.origin}</p>
                <p className="text-slate-400 text-sm">🏁 {t.destination}</p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <p className="text-2xl font-black text-white">${t.fare}</p>

                {t.status === 'PENDING' && (
                  <button
                    onClick={() => handleCancelTrip(t.id)}
                    className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition"
                  >
                    Cancelar
                  </button>
                )}
              </div>

            </div>
          ))}
        </div>

      </main>
    </div>
  )
}
