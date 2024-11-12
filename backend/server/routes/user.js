import express from "express";
import UserController from "../controllers/users.js";
import auth from "../middlewares/auth.js";
import uploads from "../middlewares/multerConfig.js";


//Definicion de las rutas
const router = express.Router();

router.get("/prueba-usuario",auth, UserController.pruebaUsers);
router.post("/register",auth, UserController.registerUsers);
router.post("/login", UserController.loginUsers);
router.post("/recover-password", UserController.passRecoveryUsers.recoveryByEmail);
router.post("/reset-password/:id", auth, UserController.passRecoveryUsers.resetByAdmin);
router.put("/reset-passwordToken", UserController.passRecoveryUsers.resetPassword);
router.delete("/delete/:id", auth, UserController.deleteUsers);
router.post("/profile", auth, UserController.profileUsers);
router.get("/list/:page?", auth, UserController.listUsers);
router.put("/update", auth, UserController.updateUsers);
router.post("/upload-image", [auth, uploads], UserController.uploadProfileImage);
router.get("/avatar", auth, UserController.avatarUser);
router.delete("/delete-img", auth, UserController.deleteImg);


export default router