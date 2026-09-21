export async function onRequestPost(context: { request: Request; env: { DB: D1Database } }) {
  try {
    const { username, email, password, role } = await context.request.json() as {
      username?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    const normalizedUsername = username?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!normalizedUsername || !normalizedEmail || !password) {
      return new Response(JSON.stringify({ error: "Faltan campos obligatorios (usuario, correo o contraseña)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const existingUser = await context.env.DB
      .prepare("SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1")
      .bind(normalizedEmail, normalizedUsername)
      .first();

    if (existingUser) {
      return new Response(JSON.stringify({ error: "El nombre de usuario o el correo electrónico ya están registrados" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    await context.env.DB
      .prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)")
      .bind(normalizedUsername, normalizedEmail, password, role || "customer")
      .run();

    return new Response(JSON.stringify({
      success: true,
      message: "Usuario creado exitosamente desde el panel de administración",
      user: { username: normalizedUsername, email: normalizedEmail, role: role || "customer" },
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Error interno al procesar la solicitud" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function onRequestGet(context: { env: { DB: D1Database } }) {
  try {
    const { results } = await context.env.DB
      .prepare("SELECT id, username, email, role FROM users ORDER BY id DESC")
      .all();

    return new Response(JSON.stringify({ success: true, users: results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Error al obtener los usuarios" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
