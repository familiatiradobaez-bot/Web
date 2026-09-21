export async function onRequestGet(context: { env: { DB: any } }) {
  try {
    // Puedes consultar una tabla específica de categorías o extraerlas de los productos
    const { results } = await context.env.DB.prepare(
      "SELECT DISTINCT category FROM products"
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
