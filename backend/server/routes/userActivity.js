import express from "express";
import UserActivityController from "../controllers/userActivitys.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.get("/prueba-userActivity", UserActivityController.pruebaUserActivity);


export default router