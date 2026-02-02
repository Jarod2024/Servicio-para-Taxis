import { NextResponse } from "next/server";
import { CancelTrip } from "@/core/use-cases/trips/CancelTrip";
import { PostgresTripRepository } from "@/infrastructure/persistence/PostgresTripRepository";

export async function POST(req: Request) {
  try {
    const { tripId } = await req.json();
    const repo = new PostgresTripRepository();
    const useCase = new CancelTrip(repo);

    await useCase.execute(tripId);

    return NextResponse.json({ message: "Viaje cancelado" });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as unknown as Error).message }, { status: 400 });
  }
}