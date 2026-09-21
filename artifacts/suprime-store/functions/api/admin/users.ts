export async function onRequestPost(context: { request: Request; env: { DB: D1Database } }) {
  try {
    const { username, email, password, role } = await context.request.json() as {
      username?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: "Faltan campos obligatorios (usuario, correo o contraseña)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const assignedRole = role || "cliente";

    // Verificamos si el usuario o correo ya existen en la base de datos D1
    const checkStmt = context.env.DB.prepare(
      "SELECT id FROM users WHERE email = ? OR username = ? LIMIT 1"
    ).bind(email, username);
    
    const existingUser = await checkStmt.first();

    if (existingUser) {
      return new Response(JSON.stringify({ error: "El nombre de usuario o el correo electrónico ya están registrados" }), {
        status: 409,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Insertamos el nuevo usuario con su respectivo rol asignado
    const insertStmt = context.env.DB.prepare(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)"
    ).bind(username, email, password, assignedRole);

    await insertStmt.run();

    return new Response(JSON.stringify({
      success: true,
      message: "Usuario creado exitosamente desde el panel de administración",
      user: { username, email, role: assignedRole }
    }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Error interno al procesar la solicitud" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

export async function onRequestGet(context: { request: Request; env: { DB: D1Database } }) {
  try {
    // Endpoint para listar los usuarios en el panel de administración
    const stmt = context.env.DB.prepare("SELECT id, username, email, role FROM users");
    const { results } = await stmt.all();

    return new Response(JSON.stringify({
      success: true,
      users: results
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Error al obtener los usuarios" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
