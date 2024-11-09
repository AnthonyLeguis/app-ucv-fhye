import express from "express";
import SheetController from '../controllers/sheets.js'; 
import auth from "../middlewares/auth.js";

//Definicion de las rutas
const router = express.Router();

//Definicion de las rutas
router.get("/prueba-sheet", SheetController.pruebaSheets);
router.post("/create-sheet",auth, SheetController.registerSheet );
router.delete("/delete-sheet/:id",auth, SheetController.deleteSheet);
router.get("/list-sheets/:page?", auth, SheetController.listSheets);
router.put("/update-sheet/:id", auth, SheetController.updateSheet);
router.post("/exports", auth, SheetController.exportsSheets);

export default router