import { TripRepository } from "../../repositories/TripRepository";

export class AcceptTrip {
  constructor(private tripRepository: TripRepository) {}

  async execute(tripId: number, driverId: number): Promise<void> {
    const trip = await this.tripRepository.findById(tripId);
    
    if (!trip) throw new Error("El viaje no existe");
    if (trip.status !== 'PENDING') throw new Error("El viaje ya no está disponible");

    // Cambiamos estado y asignamos conductor
    await this.tripRepository.assignDriver(tripId, driverId);
  }
}