// Importar modulos
import jwt from "jwt-simple";
import moment from "moment";

//importar clave secreta
import secret from "../services/jwt.js";


const secretPass = secret.secret;
// console.log(secret);

// MIDDLEWARE de autenticacion
export default (req, res, next) => {
    
    //Comprobar si llega la cabecera de auth
    if(!req.headers.authorization){
        return res.status(403).send({
            status: "error",
            message: "La petición no tiene la cabecera de autenticación"
        })
    }

    // Limpiar el token
    const token = req.headers.authorization.replace(/['"]+/g,'');

    // Decodificar el token
    try {
        const payload = jwt.decode(token, secretPass);

        // console.log(payload);

        //Comprobar si el token ha expirado
        if(payload.exp <= moment().unix()){
            return res.status(401).send({
                status: "error",
                message: "El token ha expirado"
            })
        }
        

        // Agregar datos de usuario a request
        req.users = payload;

    } catch (error) {
        return res.status(404).send({
            status: "error",
            message: "El token no es valido",
            error
        })
    }
    
    
    // Pasar a ejecutar la peticion
    next();
};
