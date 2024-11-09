import dotenv from "dotenv";
import jwt from "jwt-simple";
import moment from "moment";
dotenv.config();


// Clave secreta
const secret = process.env.JWT_SECRET;

//Crear funciion para generar tokens
const createToken = (users) => {
    const payload = {
        id: users._id,
        iat: moment().unix(),
        exp: moment().add(5, "hours").unix(),
        names: users.names,
        surnames: users.surnames,
        email: users.email,
        nationalId: users.nationalId,
        email: users.email,
        role: users.role,
        image: users.image,
        area: users.area
    };

    // Devolver jwt token cofificado
    return jwt.encode(payload, secret);
};


//Exportar acciones
export default {
    secret, 
    createToken,
    decode: jwt.decode
}