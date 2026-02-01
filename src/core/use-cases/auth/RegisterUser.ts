import bcrypt from "bcrypt"
import { UserRepository } from "../../repositories/UserRepository"
import { User } from "../../entities/User"

export class RegisterUser {
  constructor(private userRepo: UserRepository) {}

  async execute(
    name: string,
    email: string,
    password: string,
    role: 'CLIENT' | 'DRIVER' | 'ADMIN'
  ): Promise<User> {

    const existing = await this.userRepo.findByEmail(email)
    if (existing) throw new Error("El usuario ya existe")

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await this.userRepo.create({
      id: crypto.randomUUID(),
      name,
      email,
      password: hashedPassword,
      role
    })

    return newUser
  }
}
