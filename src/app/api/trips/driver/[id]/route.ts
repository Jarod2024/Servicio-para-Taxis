import { NextResponse } from "next/server";
import { PostgresTripRepository } from "@/infrastructure/persistence/PostgresTripRepository";

// En el Backend (route.ts) NO se usa useRouter
export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // 1. Resolvemos la promesa de los parámetros (Next.js 15+)
    const resolvedParams = await params;
    const driverId = parseInt(resolvedParams.id);

    if (isNaN(driverId)) {
      return NextResponse.json({ error: "ID de conductor inválido" }, { status: 400 });
    }

    const repo = new PostgresTripRepository();
    
    // 2. CAMBIO CLAVE: Usar un método que filtre por DRIVER_ID
    // Si no tienes 'findByDriverId', deberás crearlo en tu repositorio
    const trips = await repo.findByDriverId(driverId); 

    return NextResponse.json({ trips }, { status: 200 });
  } catch (error) {
    console.error("Error en API historial conductor:", error);
    return NextResponse.json({ error: "Error al obtener historial" }, { status: 500 });
  }
}