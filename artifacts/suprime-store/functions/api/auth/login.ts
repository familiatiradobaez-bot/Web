export async function onRequestPost(context: { request: Request; env: { DB: D1Database } }) {
  try {
    const { identifier, password } = await context.request.json() as { identifier?: string; password?: string };

    if (!identifier || !password) {
      return new Response(JSON.stringify({ error: "Faltan datos obligatorios (usuario/correo o contraseña)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const isEmail = identifier.includes("@");
    const query = isEmail 
      ? "SELECT * FROM users WHERE email = ? LIMIT 1" 
      : "SELECT * FROM users WHERE username = ? LIMIT 1";

    const stmt = context.env.DB.prepare(query).bind(identifier);
    const user = await stmt.first();

    if (!user) {
      return new Response(JSON.stringify({ error: "Credenciales inválidas" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role || "cliente"
      }
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Error interno del servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
