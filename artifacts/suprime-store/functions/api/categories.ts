import { ensureSchema, errorMessage, json } from "../lib/db";

type ApiContext = { env: { DB?: D1Database } };

export async function onRequestGet(context: ApiContext) {
  try {
    const db = await ensureSchema(context);
    const { results } = await db
      .prepare("SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != '' ORDER BY category")
      .all();

    return json(results);
  } catch (error) {
    return json({ error: errorMessage(error) }, 500);
  }
}
