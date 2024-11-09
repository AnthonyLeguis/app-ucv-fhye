import Employee from "../models/employee.js";

const pruebaUserActivity = (req, res) => {
    return res.status(200).json({
        message: 'Prueba de ruta del controlador para actividad del usuario'
    })
}

export default {
    pruebaUserActivity
}