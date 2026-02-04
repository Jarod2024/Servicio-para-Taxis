import { NextResponse } from "next/server";
import { RequestTrip } from "@/core/use-cases/trips/RequestTrip";
import { PostgresTripRepository } from "@/infrastructure/persistence/PostgresTripRepository";

export async function POST(req: Request) {
  try {
    const { clientId, origin, destination } = await req.json();

    if (!clientId || !origin || !destination) {
      return NextResponse.json({ error: "Faltan datos del viaje" }, { status: 400 });
    }

    const tripRepository = new PostgresTripRepository();
    // El caso de uso ahora contendrá la lógica del cálculo [cite: 48]
    const useCase = new RequestTrip(tripRepository);

    const trip = await useCase.execute(clientId, origin, destination);

    return NextResponse.json({
      message: "Viaje solicitado con éxito",
      trip
    }, { status: 201 });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error al solicitar viaje";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}