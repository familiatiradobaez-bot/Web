import { pgTable, serial, text, integer, decimal, timestamp } from 'drizzle-orm/pg-core';

// Tabla para las Secciones y Subsecciones
export const sectionsTable = pgTable('sections', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  parent: text('parent'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Tabla para los Productos
export const productsTable = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  category: text('category').notNull(),
  subcategory: text('subcategory'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  previousPrice: decimal('previous_price', { precision: 10, scale: 2 }),
  stock: integer('stock').notNull().default(0),
  tag: text('tag'),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});

export type Section = typeof sectionsTable.$inferSelect;
export type NewSection = typeof sectionsTable.$inferInsert;

export type Product = typeof productsTable.$inferSelect;
export type NewProduct = typeof productsTable.$inferInsert;
