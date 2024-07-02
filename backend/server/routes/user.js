import express from "express";
import UserController from "../controllers/users.js";
import auth from "../middlewares/auth.js";
import uploads from "../middlewares/multerConfig.js";


//Definicion de las rutas
const router = express.Router();

router.get("/prueba-usuario",auth, UserController.pruebaUsers);
router.post("/register", UserController.registerUsers);
router.post("/login", UserController.loginUsers);
router.get("/profile/:id", auth, UserController.profileUsers);
router.get("/list/:page?", auth, UserController.listUsers);
router.put("/update", auth, UserController.updateUsers);
router.post("/upload-image", [auth, uploads], UserController.uploadImg);
router.get("/avatar/:file", auth, UserController.avatarUser);
router.delete("/delete-img/:id", auth, UserController.deleteImg);


export default router