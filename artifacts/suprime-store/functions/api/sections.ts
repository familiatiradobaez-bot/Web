import { ensureSchema, errorMessage, json } from "../lib/db";

type ApiContext = { env: { DB?: D1Database } };

export async function onRequestGet(context: ApiContext) {
  try {
    const db = await ensureSchema(context);
    const { results } = await db
      .prepare("SELECT * FROM sections ORDER BY created_at DESC, id DESC")
      .all();

    return json(results);
  } catch (error) {
    return json({ error: errorMessage(error) }, 500);
  }
}

export async function onRequestPost(context: ApiContext & { request: Request }) {
  try {
    const body = (await context.request.json()) as {
      name?: unknown;
      parent?: unknown;
    };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const parent = typeof body.parent === "string" ? body.parent.trim() || null : null;

    if (!name) {
      return json({ error: "El nombre de la sección es obligatorio" }, 400);
    }

    const db = await ensureSchema(context);
    const result = await db
      .prepare("INSERT INTO sections (name, parent) VALUES (?, ?)")
      .bind(name, parent)
      .run();

    return json({ success: true, result }, 201);
  } catch (error) {
    return json({ error: errorMessage(error) }, 500);
  }
}
