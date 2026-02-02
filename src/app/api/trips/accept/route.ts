import { NextResponse } from "next/server";
import { AcceptTrip } from "@/core/use-cases/trips/AcceptTrip";
import { PostgresTripRepository } from "@/infrastructure/persistence/PostgresTripRepository";

export async function POST(req: Request) {
  try {
    const { tripId, driverId } = await req.json();
    const repo = new PostgresTripRepository();
    const useCase = new AcceptTrip(repo);

    await useCase.execute(tripId, driverId);

    return NextResponse.json({ message: "Viaje aceptado correctamente" });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as unknown as Error).message }, { status: 400 });
  }
}