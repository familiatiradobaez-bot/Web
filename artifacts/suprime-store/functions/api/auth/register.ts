export async function onRequestPost(context: { env: { DB: D1Database } }) {
  try {
    const { email, password, name } = await context.request.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email y contraseña requeridos' }), { status: 400 });
    }

    // Verificar si el usuario ya existe
    const existing = await context.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
    if (existing) {
      return new Response(JSON.stringify({ error: 'El correo ya está registrado' }), { status: 400 });
    }

    // El primer usuario registrado o emails clave pueden asignarse como admin
    // Por defecto todos se crean como 'customer'
    const role = 'customer';

    const result = await context.env.DB.prepare(
      'INSERT INTO users (name, email, password_hash, role, created_at) VALUES (?, ?, ?, ?, DATETIME("now"))'
    ).bind(name || '', email, password, role).run();

    return new Response(JSON.stringify({ success: true, message: 'Usuario registrado exitosamente' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}

