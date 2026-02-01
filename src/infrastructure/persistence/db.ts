import { Pool } from 'pg';

// Singleton para la conexión a PostgreSQL 18
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Asegúrate de tener esto en tu .env
});

export default pool;