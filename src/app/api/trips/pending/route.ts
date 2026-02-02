import { NextResponse } from "next/server";
import { PostgresTripRepository } from "@/infrastructure/persistence/PostgresTripRepository";

export async function GET() {
  try {
    const repo = new PostgresTripRepository();
    
    // Llamamos al método que busca solo los viajes con estado 'PENDING'
    const trips = await repo.findPendingTrips();

    return NextResponse.json({ trips }, { status: 200 });
  } catch (error: unknown) {
    console.error("Error en API pending:", error);
    return NextResponse.json(
      { error: "Error al recuperar viajes pendientes" }, 
      { status: 500 }
    );
  }
}