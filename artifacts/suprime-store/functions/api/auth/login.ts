import { verifyPassword } from "../../lib/password";
import { ensureSchema, errorMessage, json } from "../../lib/db";

type ApiContext = { request: Request; env: { DB?: D1Database } };

export async function onRequestPost(context: ApiContext) {
  try {
    const body = await context.request.json() as {
      identifier?: unknown;
      email?: unknown;
      password?: unknown;
    };
    const identifier = typeof (body.identifier ?? body.email) === "string"
      ? String(body.identifier ?? body.email).trim()
      : "";
    const password = typeof body.password === "string" ? body.password : "";

    if (!identifier || !password) return json({ error: "Email/usuario y contraseña son obligatorios" }, 400);

    const column = identifier.includes("@") ? "email" : "username";
    const lookupValue = column === "email" ? identifier.toLowerCase() : identifier;
    const db = await ensureSchema(context);
    const user = await db
      .prepare(`SELECT id, username, email, password_hash, role FROM users WHERE ${column} = ? LIMIT 1`)
      .bind(lookupValue)
      .first<{
        id: number;
        username: string;
        email: string;
        password_hash: string | null;
        role: string | null;
      }>();

    if (!user || !(await verifyPassword(password, user.password_hash))) {
      return json({ error: "Credenciales inválidas" }, 401);
    }

    return json({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        name: user.username,
        username: user.username,
        email: user.email,
        role: user.role || "customer",
      },
    });
  } catch (error) {
    return json({ error: errorMessage(error) }, 500);
  }
}
