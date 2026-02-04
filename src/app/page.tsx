import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-[#0f172a] text-white overflow-hidden">
      
      {/* 🔮 BLOBS DE LUZ DE FONDO */}
      <div className="absolute top-1/2 left-1/2 w-[900px] h-[900px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-indigo-500/30 via-purple-500/30 to-fuchsia-500/30 blur-[120px] rounded-full animate-pulse"></div>

      {/* NAVBAR GLASS */}
      <nav className="fixed top-0 w-full backdrop-blur-xl bg-white/5 border-b border-white/10 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🚕</span>
            <span className="text-lg font-extrabold tracking-widest uppercase text-white/90">
              TaxiApp
            </span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/login" className="text-sm text-white/70 hover:text-white transition">
              Ingresar
            </Link>
            <Link
              href="/register?role=CLIENT"
              className="bg-gradient-to-br from-indigo-500 to-purple-500 px-6 py-2.5 rounded-2xl text-sm font-bold hover:scale-105 transition"
            >
              Empezar
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative z-10 pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs uppercase tracking-widest text-white/70">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              Disponible 24/7 en tu ciudad
            </div>

            <h1 className="text-6xl md:text-7xl font-black leading-tight tracking-tight">
              Muévete con <br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                libertad.
              </span>
            </h1>

            <p className="text-lg text-white/60 max-w-lg leading-relaxed">
              Conectamos pasajeros con conductores verificados usando un sistema
              digital seguro, rápido y supervisado en tiempo real.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/register?role=CLIENT"
                className="bg-gradient-to-br from-indigo-500 to-purple-500 px-10 py-5 rounded-2xl font-bold text-lg hover:scale-[1.03] transition text-center shadow-[0_20px_30px_-10px_rgba(99,102,241,0.6)]"
              >
                Pedir Taxi
              </Link>

              <Link
                href="/register?role=DRIVER"
                className="bg-white/5 border border-white/10 px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition text-center"
              >
                Ser Conductor
              </Link>
            </div>
          </div>

          {/* 🖼️ IMAGEN OPTIMIZADA (Solución a image_0a52c8) */}
          <div className="relative group h-[500px] w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[40px] blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            
            <div className="relative h-full w-full bg-[#0f172a] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
              <Image 
  src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop" 
  alt="Servicio de Taxi Premium" 
  fill
  priority
  sizes="(max-width: 768px) 100vw, 50vw"
  className="object-cover opacity-80 group-hover:scale-110 transition duration-700"
/>
              
              {/* Gradiente de integración */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
              
              {/* Detalle flotante informativo */}
              <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl">
                <p className="text-sm font-medium text-white/90 leading-snug">
                 
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN DE BENEFICIOS */}
      <section className="relative z-10 py-24 px-6 border-t border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: "🛡️", title: "Seguridad", desc: "Conductores verificados y monitoreo GPS." },
            { icon: "⚡", title: "Inmediatez", desc: "Tu taxi en la puerta en menos de 5 minutos." },
            { icon: "💰", title: "Precios Justos", desc: "Tarifas transparentes sin cargos ocultos." }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-[32px] bg-white/5 border border-white/10 hover:bg-white/10 transition group">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
              <h3 className="font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="relative z-10 py-12 text-center text-white/20 text-xs tracking-widest uppercase">
        © 2026 TaxiApp System — Engineering Excellence
      </footer>
    </div>
  );
}