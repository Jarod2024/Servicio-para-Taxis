import { NextResponse } from "next/server";
import { LoginUser } from "@/core/use-cases/auth/LoginUser";
import { PostgresUserRepository } from "@/infrastructure/persistence/PostgresUserRepository";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const userRepository = new PostgresUserRepository();
    const useCase = new LoginUser(userRepository);

    const result = await useCase.execute(email, password);

    return NextResponse.json({
      message: "Login exitoso",
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        role: result.user.role
      }
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error de autenticación";
    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}