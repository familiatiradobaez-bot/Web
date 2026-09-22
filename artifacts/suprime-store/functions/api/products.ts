import { ensureSchema, errorMessage, json } from "../lib/db";

type ApiContext = { env: { DB?: D1Database } };

function numberOrNull(value: unknown): number | null {
  if (value === "" || value === null || value === undefined) return null;
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : null;
}

function integerOrZero(value: unknown): number {
  const number = numberOrNull(value);
  return number === null ? 0 : Math.trunc(number);
}

export async function onRequestGet(context: ApiContext) {
  try {
    const db = await ensureSchema(context);
    const { results } = await db
      .prepare("SELECT * FROM products ORDER BY created_at DESC, id DESC")
      .all();

    return json(results);
  } catch (error) {
    return json({ error: errorMessage(error) }, 500);
  }
}

export async function onRequestPost(context: ApiContext & { request: Request }) {
  try {
    const body = (await context.request.json()) as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const category = typeof body.category === "string" ? body.category.trim() : "";
    const price = numberOrNull(body.price);

    if (!name || !category || price === null) {
      return json(
        { error: "Faltan campos obligatorios (nombre, categoría, precio válido)" },
        400,
      );
    }

    const db = await ensureSchema(context);
    const result = await db
      .prepare(`
        INSERT INTO products (
          name, category, subcategory, price, old_price, stock, tag,
          image_url, tone, accent, visual, description, dimensions, weight
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        name,
        category,
        typeof body.subcategory === "string" ? body.subcategory.trim() || null : null,
        price,
        numberOrNull(body.oldPrice ?? body.previousPrice),
        integerOrZero(body.stock),
        typeof body.tag === "string" ? body.tag.trim() || null : null,
        typeof body.image === "string"
          ? body.image.trim() || null
          : typeof body.imageUrl === "string"
            ? body.imageUrl.trim() || null
            : null,
        typeof body.tone === "string" ? body.tone : "#ebe4d8",
        typeof body.accent === "string" ? body.accent : "#174f49",
        typeof body.visual === "string" ? body.visual : "bag",
        typeof body.description === "string" ? body.description : "",
        typeof body.dimensions === "string" ? body.dimensions : "",
        typeof body.weight === "string" ? body.weight : "",
      )
      .run();

    return json({ success: true, result }, 201);
  } catch (error) {
    return json({ error: errorMessage(error) }, 500);
  }
}
