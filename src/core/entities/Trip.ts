export interface Trip {
  id?: number;
  clientId: number;
  driverId?: number | null;
  origin: string;
  destination: string;
  fare: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  createdAt?: Date;
}