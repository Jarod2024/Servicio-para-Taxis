import { Trip } from "../entities/Trip";

export interface TripRepository {
  create(trip: Trip): Promise<Trip>;
  findById(id: number): Promise<Trip | null>;
  updateStatus(id: number, status: string): Promise<void>;
  assignDriver(tripId: number, driverId: number): Promise<void>;
  findPendingTrips(): Promise<Trip[]>;
}