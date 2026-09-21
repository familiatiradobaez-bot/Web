import { verifyPassword } from "../lib/password";

export async function onRequestPost(context: {
  request: Request;
  env: { DB: D1Database };
}) {
  try {
    const body = (await context.request.json()) as {
      identifier?: string;
      email?: string;
      password?: string;
    };

    const identifier = (body.identifier || body.email || "").trim();
    const password = body.password || "";

    if (!identifier || !password) {
      return new Response(
        JSON.stringify({ error: "Email/usuario y contraseña son obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const column = identifier.includes("@") ? "email" : "username";
    const user = (await context.env.DB
      .prepare(`SELECT id, username, email, password_hash, password, role FROM users WHERE ${column} = ? LIMIT 1`)
      .bind(identifier)
      .first()) as {
      id: number;
      username: string;
      email: string;
      password_hash?: string | null;
      password?: string | null;
      role: string | null;
    } | null;

    const matchesHash = user ? await verifyPassword(password, user.password_hash || null) : false;
    const matchesLegacy = user ? user.password === password : false;

    if (!user || (!matchesHash && !matchesLegacy)) {
      return new Response(
        JSON.stringify({ error: "Credenciales inválidas" }),
        { status: 401, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Inicio de sesión exitoso",
        user: {
          id: user.id,
          name: user.username,
          username: user.username,
          email: user.email,
          role: user.role || "customer",
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
