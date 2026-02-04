import { NextResponse } from "next/server";
import { PostgresTripRepository } from "@/infrastructure/persistence/PostgresTripRepository";

// Definimos el tipo de params como una Promise
export async function GET(
  req: Request, 
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    // --- AQUÍ ESTÁ LA CORRECCIÓN ---
    // Debemos esperar (await) a que params se resuelva
    const resolvedParams = await params;
    const clientId = parseInt(resolvedParams.id);

    if (isNaN(clientId)) {
      return NextResponse.json({ error: "ID de usuario inválido" }, { status: 400 });
    }

    const repo = new PostgresTripRepository();
    
    // Método en el repositorio para buscar viajes por usuario
    const trips = await repo.findByClientId(clientId);

    return NextResponse.json({ trips }, { status: 200 });
  } catch (error) {
    console.error("Error en API historial:", error);
    return NextResponse.json({ error: "Error al obtener historial" }, { status: 500 });
  }
}