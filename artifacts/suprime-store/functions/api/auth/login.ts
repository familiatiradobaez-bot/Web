export async function onRequestPost(context: { env: { DB: D1Database } }) {
  try {
    const { email, password } = await context.request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email y contraseña requeridos' }), { status: 400 });
    }

    // Buscar el usuario en D1
    const user = await context.env.DB.prepare(
      'SELECT id, name, email, role, password_hash FROM users WHERE email = ?'
    ).bind(email).first();

    if (!user || user.password_hash !== password) {
      return new Response(JSON.stringify({ error: 'Credenciales incorrectas' }), { status: 401 });
    }

    // Retornar los datos del usuario sin exponer la contraseña
    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

