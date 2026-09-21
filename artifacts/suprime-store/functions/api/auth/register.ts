export async function onRequestPost(context: {
  request: Request;
  env: { DB: D1Database };
}) {
  try {
    const { email, password, name } = (await context.request.json()) as {
      email?: string;
      password?: string;
      name?: string;
    };

    const username = name?.trim();
    const normalizedEmail = email?.trim().toLowerCase();

    if (!username || !normalizedEmail || !password) {
      return new Response(
        JSON.stringify({ error: "Nombre, email y contraseña son obligatorios" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const existing = await context.env.DB
      .prepare("SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1")
      .bind(normalizedEmail, username)
      .first();

    if (existing) {
      return new Response(
        JSON.stringify({ error: "El usuario o el correo ya están registrados" }),
        { status: 409, headers: { "Content-Type": "application/json" } },
      );
    }

    await context.env.DB
      .prepare("INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)")
      .bind(username, normalizedEmail, password, "customer")
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Usuario registrado exitosamente",
      }),
      { status: 201, headers: { "Content-Type": "application/json" } },
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error?.message || "Error interno del servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
