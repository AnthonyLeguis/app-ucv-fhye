import multer from "multer";

const storage = multer.memoryStorage(); // Almacenamos en memoria

const uploads = multer({ 
  storage, 
  limits: { fileSize: 2 * 1024 * 1024 } // Límite de 2MB
}).single('image');

export default uploads;