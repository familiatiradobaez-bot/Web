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

