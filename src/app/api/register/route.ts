import { NextResponse } from "next/server";
import { RegisterUser } from "@/core/use-cases/auth/RegisterUser";
import { PostgresUserRepository } from "@/infrastructure/persistence/PostgresUserRepository";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Inyectamos el repositorio de SQL puro
    const userRepository = new PostgresUserRepository();
    const useCase = new RegisterUser(userRepository);

    const user = await useCase.execute(name, email, password, role);

    return NextResponse.json(
      { message: "Usuario registrado con éxito", user: { id: user.id, email: user.email, role: user.role } },
      { status: 201 }
    );
  } catch (error: unknown) {
    
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: errorMessage }, { status: 400 });
  }
}