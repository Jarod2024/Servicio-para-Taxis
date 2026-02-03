import { NextResponse } from "next/server";
import { PostgresTripRepository } from "@/infrastructure/persistence/PostgresTripRepository";

export async function GET() {
  try {
    const repo = new PostgresTripRepository();
    // Necesitas añadir este método en tu repositorio
    const trips = await repo.findAll(); 

    return NextResponse.json({ trips }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Error de acceso administrativo" }, { status: 500 });
  }
}