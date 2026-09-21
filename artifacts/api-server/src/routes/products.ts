import { Router, type IRouter } from "express";
import { db } from "../../../lib/db/src"; // Ajusta la ruta relativa hacia tu cliente de base de datos si es necesario
import { sectionsTable, productsTable } from "../../../lib/db/src/schema";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

// --- RUTAS DE SECCIONES ---

// Obtener todas las secciones
router.get("/sections", async (_req, res) => {
  try {
    const allSections = await db.select().from(sectionsTable);
    res.json(allSections);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Crear una sección o subsección nueva directamente en la BD
router.post("/sections", async (req, res) => {
  try {
    const { name, parent } = req.body;
    
    if (!name) {
      return res.status(400).json({ error: "El nombre de la sección es obligatorio" });
    }

    const newSection = await db.insert(sectionsTable).values({
      name,
      parent: parent || null,
    }).returning();

    res.status(201).json(newSection[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- RUTAS DE PRODUCTOS ---

// Obtener todos los productos
router.get("/products", async (_req, res) => {
  try {
    const allProducts = await db.select().from(productsTable);
    res.json(allProducts);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un producto nuevo
router.post("/products", async (req, res) => {
  try {
    const { name, category, subcategory, price, previousPrice, stock, tag, imageUrl } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ error: "Faltan campos obligatorios (nombre, categoría, precio)" });
    }

    const newProduct = await db.insert(productsTable).values({
      name,
      category,
      subcategory: subcategory || null,
      price: price.toString(),
      previousPrice: previousPrice ? previousPrice.toString() : null,
      stock: stock ? parseInt(stock) : 0,
      tag: tag || null,
      imageUrl: imageUrl || null,
    }).returning();

    res.status(201).json(newProduct[0]);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
