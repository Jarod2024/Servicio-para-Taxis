import { TripRepository } from "@/core/repositories/TripRepository";
import { Trip } from "@/core/entities/Trip";
import pool from "./db";

export class PostgresTripRepository implements TripRepository {
  async create(trip: Trip): Promise<Trip> {
    const query = `
      INSERT INTO "Trip" (client_id, origin, destination, fare, status)
      VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [trip.clientId, trip.origin, trip.destination, trip.fare, trip.status];
    const res = await pool.query(query, values);
    return this.mapRowToTrip(res.rows[0]);
  }

  // Estos son los métodos que faltaban y causaban el error ts(2420)
  async findById(id: number): Promise<Trip | null> {
    const res = await pool.query('SELECT * FROM "Trip" WHERE id = $1', [id]);
    return res.rows[0] ? this.mapRowToTrip(res.rows[0]) : null;
  }
  async findByClientId(clientId: number): Promise<Trip[]> {
  const query = 'SELECT * FROM "Trip" WHERE client_id = $1 ORDER BY id DESC';
  const res = await pool.query(query, [clientId]);
  return res.rows.map(row => this.mapRowToTrip(row));
}

  async updateStatus(id: number, status: string): Promise<void> {
    await pool.query('UPDATE "Trip" SET status = $1 WHERE id = $2', [status, id]);
  }

  async assignDriver(tripId: number, driverId: number): Promise<void> {
    await pool.query(
      'UPDATE "Trip" SET driver_id = $1, status = \'IN_PROGRESS\' WHERE id = $2', 
      [driverId, tripId]
    );
  }
  async findPendingTrips(): Promise<Trip[]> {
  // Filtramos por estado PENDING para que el conductor no vea viajes ya tomados
  const query = 'SELECT * FROM "Trip" WHERE status = \'PENDING\' ORDER BY id DESC';
  const res = await pool.query(query);
  
  // Usamos el mapeador que ya corregimos para eliminar los 'any'
  return res.rows.map(row => this.mapRowToTrip(row));
}
async findAll(): Promise<Trip[]> {
  const query = 'SELECT * FROM "Trip" ORDER BY id DESC';
  const res = await pool.query(query);
  return res.rows.map(row => this.mapRowToTrip(row));
}

  // Cambia la firma de tu función privada para que acepte un objeto genérico sin usar 'any' directamente en el retorno
private mapRowToTrip(row: Record<string, unknown>): Trip {
  return {
    id: row.id as number,
    clientId: row.client_id as number,
    driverId: row.driver_id as number | null,
    origin: row.origin as string,
    destination: row.destination as string,
    fare: Number.parseFloat(row.fare as string), 
    status: row.status as 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  };
}
}