-- Canonical D1 schema for the production Pages Functions.
CREATE TABLE IF NOT EXISTS sections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  parent TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

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
);

CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);
