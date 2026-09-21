// GET: Obtener todos los productos de la base de datos
export async function onRequestGet(context: { env: { DB: any } }) {
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT * FROM products ORDER BY created_at DESC"
    ).all();

    return new Response(JSON.stringify(results), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// POST: Crear un nuevo producto desde el panel de administración
export async function onRequestPost(context: { request: Request; env: { DB: any } }) {
  try {
    const body: any = await context.request.json();
    const { name, category, price, oldPrice, stock, tag, tone, accent, visual, description, dimensions, weight } = body;

    if (!name || !category || !price) {
      return new Response(JSON.stringify({ error: "Faltan campos obligatorios (nombre, categoría, precio)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const query = `
      INSERT INTO products (name, category, price, old_price, stock, tag, tone, accent, visual, description, dimensions, weight)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await context.env.DB.prepare(query)
      .bind(
        name, 
        category, 
        price, 
        oldPrice || null, 
        stock || 0, 
        tag || null, 
        tone || '#ebe4d8', 
        accent || '#174f49', 
        visual || 'bag', 
        description || '', 
        dimensions || '', 
        weight || ''
      )
      .run();

    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
