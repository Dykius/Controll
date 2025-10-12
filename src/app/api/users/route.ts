import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";
import bcrypt from "bcryptjs";

// Registrar usuario
export async function POST(request: NextRequest) {
  try {
    const { fullName, email, password } = await request.json();
    // Verificar si el usuario ya existe
    const [users]: any = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );
    if (users && users.length > 0) {
      return NextResponse.json(
        { error: "El usuario ya existe" },
        { status: 409 }
      );
    }
    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const [result]: any = await pool.query(
      "INSERT INTO users (fullName, email, password) VALUES (?, ?, ?)",
      [fullName, email, hashedPassword]
    );
    return NextResponse.json(
      { message: "Usuario creado", userId: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error al crear usuario", details: error },
      { status: 500 }
    );
  }
}

// Obtener datos de usuario por email
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    if (!email)
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    const [users]: any = await pool.query(
      "SELECT id, fullName, email, created_at FROM users WHERE email = ?",
      [email]
    );
    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(users[0]);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener usuario", details: error },
      { status: 500 }
    );
  }
}
