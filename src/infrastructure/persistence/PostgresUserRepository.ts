import { UserRepository } from "@/core/repositories/UserRepository";
import { User } from "@/core/entities/User";
import pool from "./db";

export class PostgresUserRepository implements UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    return result.rows[0] || null;
  }

  // Usamos el tipo User para evitar el error de "any"
  async create(user: User): Promise<User> {
    // IMPORTANTE: No enviamos el 'id' en el INSERT porque SERIAL lo genera solo
    const query = 'INSERT INTO "User" (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [user.name, user.email, user.password, user.role];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}