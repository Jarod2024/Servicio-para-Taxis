import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../../repositories/UserRepository"; // Importa tu interfaz

export class LoginUser {
  // Inyectamos la interfaz del repositorio (Principio de Inversión de Dependencias)
  constructor(private userRepo: UserRepository) {}

  async execute(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    
    if (!user) throw new Error("Usuario no encontrado");

    // Comparamos el hash (asegúrate de que en el registro uses bcrypt.hash)
    const valid = await bcrypt.compare(password, user.password!);
    if (!valid) throw new Error("Credenciales incorrectas");

    const token = jwt.sign(
      { id: user.id, role: user.role }, // Usamos 'role' según tu entidad [cite: 44]
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return { token, user };
  }
}