import { hashPassword } from "../../lib/password";
import { ensureSchema, errorMessage, json } from "../../lib/db";

type ApiContext = { request: Request; env: { DB?: D1Database } };

export async function onRequestPost(context: ApiContext) {
  try {
    const body = await context.request.json() as {
      username?: unknown;
      email?: unknown;
      password?: unknown;
      role?: unknown;
    };
    const username = typeof body.username === "string" ? body.username.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const role = typeof body.role === "string" && body.role.trim() ? body.role.trim() : "customer";

    if (!username || !email || !password) {
      return json({ error: "Faltan campos obligatorios (usuario, correo o contraseña)" }, 400);
    }
    if (password.length < 8) return json({ error: "La contraseña debe tener al menos 8 caracteres" }, 400);

    const db = await ensureSchema(context);
    const existing = await db
      .prepare("SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1")
      .bind(email, username)
      .first();
    if (existing) return json({ error: "El usuario o el correo ya están registrados" }, 409);

    await db
      .prepare("INSERT INTO users (username, email, password_hash, role) VALUES (?, ?, ?, ?)")
      .bind(username, email, await hashPassword(password), role)
      .run();

    return json({ success: true, message: "Usuario creado exitosamente", user: { username, email, role } }, 201);
  } catch (error) {
    return json({ error: errorMessage(error) }, 500);
  }
}

export async function onRequestGet(context: { env: { DB?: D1Database } }) {
  try {
    const db = await ensureSchema(context);
    const { results } = await db
      .prepare("SELECT id, username, email, role, created_at FROM users ORDER BY id DESC")
      .all();
    return json({ success: true, users: results });
  } catch (error) {
    return json({ error: errorMessage(error) }, 500);
  }
}
