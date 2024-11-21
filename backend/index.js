import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import connection from "./server/database/connection.js";
import userRouter from "./server/routes/user.js";
import userActivityRouter from "./server/routes/userActivity.js";
import employeeRouter from "./server/routes/employee.js";
import sheetRouter from "./server/routes/sheet.js";

// 2. Configuración de variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Cargar variables de entorno
try {
  dotenv.config({ path: path.join(__dirname, '.env') });
} catch (error) {
  console.error('Error al cargar variables de entorno:', error);
  process.exit(1);
}

// 3. Conexión a la base de datos
connection()
  .then(() => {
    console.log("Conexión exitosa a la base de datos");
  })
  .catch((error) => {
    console.error("Error al conectar a la base de datos:", error);
  })

// 4. Configuración del servidor Express
const app = express();
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 3900;

app.use(morgan("dev"));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ALLOWED_ORIGINS : process.env.ORIGIN_FRONTEND_LOCAL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 5. Rutas de la API
const API_ROUTES = {
  USER: userRouter,
  USER_ACTIVITY: userActivityRouter,
  EMPLOYEE: employeeRouter,
  SHEET: sheetRouter,
};

// Ruta para gestionar usuarios
app.use("/api/user", API_ROUTES.USER);

// Ruta para gestionar actividades de usuario
app.use("/api/user-activity", API_ROUTES.USER_ACTIVITY);

// Ruta para gestionar empleados
app.use("/api/employee", API_ROUTES.EMPLOYEE);

// Ruta para gestionar las planillas
app.use("/api/sheet", API_ROUTES.SHEET);

// 6. Ruta de prueba
app.get("/ruta-prueba", (req, res) => {
  return res.status(200).json({
    id: 1,
    nombre: "Anthony",
    apellido: "Leguisamo Gascon"
  });
});

app.get("/", (req, res) => {
  res.redirect(process.env.CORS_ALLOWED_ORIGINS.split(',')[0]); // Redirige a la URL de tu frontend
});

// Manejador de errores
app.use((req, res, next) => {
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.error(`Error: ${error.status}: ${error.message}`);
  console.error(error.stack);
  res.status(error.status || 500).json({
    status: "error",
    message: error.message,
  });
});

// 7. Inicio del servidor
app.listen(port, () => {
  console.log(`"Servidor corriendo en el puerto:", ${port}`);
});