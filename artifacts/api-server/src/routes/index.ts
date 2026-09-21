import { Router, type IRouter } from "express";
import healthRouter from "./health";
import productsRouter from "./products"; // <--- Importamos las nuevas rutas

const router: IRouter = Router();

router.use(healthRouter);
router.use(productsRouter); // <--- Las registramos aquí

export default router;
