import express from "express";
import EmployeeController from "../controllers/employees.js";
import auth from "../middlewares/auth.js";      

const router = express.Router();

router.get("/prueba-employee", EmployeeController.pruebaEmployees);
router.post("/register-employee", auth, EmployeeController.registerEmployee);
router.get("/update-employee/:id", auth, EmployeeController.updateEmployee);
router.put("/update-employee/:id", auth, EmployeeController.updateEmployee);
router.delete("/delete-employee/:id", auth, EmployeeController.deleteEmployee);
router.get("/list-employees/:page?", auth, EmployeeController.listEmployees);

export default router