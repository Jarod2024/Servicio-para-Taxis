import { TripRepository } from "../../repositories/TripRepository";
import { Trip } from "../../entities/Trip";

export class RequestTrip {
  constructor(private tripRepository: TripRepository) {}

  async execute(clientId: number, origin: string, destination: string): Promise<Trip> {
    // LÓGICA DE NEGOCIO: Definimos la tarifa aquí 
    const calculatedFare = 5.75; 
    
    const newTrip: Trip = {
      clientId,
      origin,
      destination,
      fare: calculatedFare, // <--- Aquí se asigna la tarifa
      status: 'PENDING'     // <--- Aquí se asigna el estado inicial [cite: 65]
    };

    return await this.tripRepository.create(newTrip);
  }
}