type D1Context = { env: { DB?: D1Database } };

let schemaReady: Promise<void> | undefined;

function getDatabase(context: D1Context): D1Database {
  if (!context.env?.DB) {
    throw new Error("Cloudflare D1 binding DB no está configurado");
  }

  return context.env.DB;
}

/**
 * Defensive, idempotent bootstrap for deployments where the migration has not
 * been applied yet. The SQL migration remains the source of truth; this only
 * prevents a first request from failing with "no such table".
 */
export async function ensureSchema(context: D1Context): Promise<D1Database> {
  const database = getDatabase(context);

  if (!schemaReady) {
    schemaReady = (async () => {
      await database.batch([
        database.prepare(`
          CREATE TABLE IF NOT EXISTS sections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            parent TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `),
        database.prepare(`
          CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            subcategory TEXT,
            price NUMERIC NOT NULL,
            old_price NUMERIC,
            stock INTEGER NOT NULL DEFAULT 0,
            tag TEXT,
            image_url TEXT,
            tone TEXT,
            accent TEXT,
            visual TEXT,
            description TEXT,
            dimensions TEXT,
            weight TEXT,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `),
        database.prepare(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'customer',
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
          )
        `),
      ]);
    })().catch((error) => {
      schemaReady = undefined;
      throw error;
    });
  }

  await schemaReady;
  return database;
}

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Error interno de la base de datos";
}
