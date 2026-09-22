import { hashPassword } from "../../lib/password";
import { ensureSchema, errorMessage, json } from "../../lib/db";

type ApiContext = { request: Request; env: { DB?: D1Database } };

export async function onRequestPost(context: ApiContext) {
  try {
    const body = await context.request.json() as {
      email?: unknown;
      password?: unknown;
      name?: unknown;
    };
    const username = typeof body.name === "string" ? body.name.trim() : "";
    const normalizedEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!username || !normalizedEmail || !password) {
      return json({ error: "Nombre, email y contraseña son obligatorios" }, 400);
    }
    if (password.length < 8) {
      return json({ error: "La contraseña debe tener al menos 8 caracteres" }, 400);
    }

    const db = await ensureSchema(context);
    const existing = await db
      .prepare("SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1")
      .bind(normalizedEmail, username)
      .first();

    if (existing) return json({ error: "El usuario o el correo ya están registrados" }, 409);

    await db
      .prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)")
      .bind(username, normalizedEmail, await hashPassword(password), "customer")
      .run();

    return json({ success: true, message: "Usuario registrado exitosamente" }, 201);
  } catch (error) {
    return json({ error: errorMessage(error) }, 500);
  }
}
