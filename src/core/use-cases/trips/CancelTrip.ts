import { TripRepository } from "../../repositories/TripRepository";

export class CancelTrip {
  constructor(private tripRepository: TripRepository) {}

  async execute(tripId: number): Promise<void> {
    const trip = await this.tripRepository.findById(tripId);
    
    if (!trip) throw new Error("El viaje no existe");
    // Regla de negocio: Solo se puede cancelar si aún no ha sido aceptado
    if (trip.status !== 'PENDING') {
      throw new Error("No se puede cancelar un viaje que ya fue aceptado");
    }

    await this.tripRepository.updateStatus(tripId, 'CANCELLED');
  }
}