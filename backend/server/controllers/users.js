// Importacion de dependencias
import bcrypt from "bcrypt";
import User from "../models/user.js";
import Activity from "../models/userActivity.js";
import jwt from "../services/jwt.js";
import moment from "moment";
import secret from "../services/jwt.js";
import sendPasswordResetEmail from "../middlewares/recoverByEmail.js";
import imgbbUploader from 'imgbb-uploader';
import dotenv from 'dotenv';
import axios from 'axios';

const secretPass = secret.secret;

// Carga de variables de entorno
dotenv.config();

//acciones de prueba
const pruebaUsers = async (req, res) => {

    try {
        const users = await User.find({}); // Usar el modelo User importado
        console.log(users);
        res.status(200).json({ message: 'Datos obtenidos correctamente', users });
    } catch (error) {
        console.error('Error al obtener los datos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

//Registro de usuarios
const registerUsers = async (req, res) => {
    //recoger datos de la peticion
    let params = req.body;

    // Creacion de objeto de usuario
    try {

        // Validación de datos
        if (
            !params.names ||
            !params.surnames ||
            !params.email ||
            !params.nationalId ||
            !params.phone ||
            !params.area ||
            !params.role
        ) {

            throw new Error("Faltan datos por enviar");
        }

        // Obtener el rol del usuario autenticado desde el token
        const currentRole = req.users.role;

        // Verificar si el usuario tiene el permiso en su role para registrar un usuario
        const allowedRoles = ['role_master', 'role_rrhh'];

        if (!allowedRoles.includes(currentRole)) {
            return res.status(403).json({
                status: "error",
                message: "No tiene permiso para registrar usuarios"
            });
        }

        // Si el usuario actual tiene role_rrhh, verificar que rol tendra el nuevo usuario
        if (currentRole === 'role_rrhh' && !['role_budget', 'role_analyst'].includes(params.role)) {
            return res.status(400).json({
                status: "error",
                message: "No tienes permiso para crear un usuario con ese rol"
            });
        }

        if (params.role === 'role_rrhh' || params.role === 'role_budget' || params.role === 'role_analyst') {
            params.password = params.nationalId.toString(); // Convertir a string
        }

        // convertir el correo a minúsculas
        const lowerCaseEmail = params.email.toLowerCase();

        // convertir nationalId a número entero
        params.nationalId = parseInt(params.nationalId);

        // Validación de usuarios duplicados
        const existingUser = await User.findOne({
            $or: [{ email: lowerCaseEmail }, { nationalId: params.nationalId }]
        });

        if (existingUser) {
            return res.status(400).json({
                status: "error",
                message: 'El usuario ya existe'
            });
        }

        // Encriptar la contraseña
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(params.password, saltRounds);
        params.password = hashedPassword;

        // Crear nuevo usuario
        const newUser = new User(params);

        // Guardar usuario en la bd
        const userStored = await newUser.save();

        return res.status(200).json({
            status: "success",
            message: 'Usuario creado correctamente',
            user: userStored
        });

    } catch (error) {
        console.error("Error al registrar el usuario:", error);
        return res.status(500).json({
            status: "error",
            message: "Falló la validación: " + error.message
        });

    }
}

// Login del usuario
const loginUsers = async (req, res) => {
    try {
        let { nationalId, password } = req.body;

        if (!nationalId || !password) {
            return res.status(400).json({
                status: "error",
                message: "Faltan datos por enviar"
            });
        }

        //Limpiar los datos
        nationalId = (nationalId || '').trim();
        nationalId = parseInt(nationalId);
        password = password.trim();

        // Buscar el usuario en la base de datos por su identificación
        const user = await User.findOne({ nationalId });

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe"
            });
        }

        // Verificar la contraseña
        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({
                status: "error",
                message: "Contraseña incorrecta"
            });
        }

        // Generar el token
        const token = jwt.createToken(user);

        // Devolver el token y los datos del usuario
        return res.status(200).json({
            status: "success",
            message: "Inicio de sesión exitoso",
            user: {
                id: user._id,
                names: user.names,
                surnames: user.surnames,
                email: user.email,
                nationalId: user.nationalId,
                phone: user.phone,
                area: user.area,
                role: user.role,
                status: user.status
            },
            token
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al iniciar sesión"
        });

    }

}

const deleteUsers = async (req, res) => {
    try {
        //Obtencion del id del usuario
        const UserId = req.params.id;

        // Verificar si el usuario tiene el permiso en su role para borrar el usuario seleccionado
        const currentRole = req.users.role;
        const targetUser = await User.findById(UserId);

        if (!targetUser) {
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe"
            })
        }

        const targetRole = targetUser.role;

        if (currentRole === 'role_master') {
            // Este rol puede borrar cualquier usuario

        } else if (currentRole === 'role_rrhh' && (targetRole === 'role_budget' || targetRole === 'role_analyst')) {
            // El rol de RRHH solo puede borrar usuarios con rol de presupuesto o analistas

        } else {
            return res.status(403).json({
                status: "error",
                message: "No tiene permiso para borrar este usuario"
            })
        }

        // Eliminar el usuario de la base de datos
        const userDeleted = await User.findByIdAndDelete(UserId);

        if (!userDeleted) {
            return res.status(404).json({
                status: "error",
                message: "El usuario no existe"
            })
        }

        return res.status(200).json({
            status: "success",
            message: "El usuario ha sido eliminado correctamente"
        });

    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar el usuario"
        });
    }
}

const passRecoveryUsers = {

    // Opcion 1: recuperacion por token enviado al correo electronico
    recoveryByEmail: async (req, res) => {
        try {
            const { email } = req.body;

            // valdiar que el email no este vacio
            if (!email) {
                return res.status(400).json({
                    status: "error",
                    message: "Debes proporcionar el correo electrónico"
                });
            }

            // Buscar el usuario en la base de datos por su correo electronico
            const user = await User.findOne({ email });

            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "No se encontró ningún usuario con ese correo electrónico"
                });
            }

            // Generacion del token JWT temporal
            const tokenPayload = {
                userId: user._id,
                email: user.email,

                //Tiempo de expiración del token 1 hora
                exp: Math.floor(Date.now() / 1000) + (60 * 60)
            };

            const token = jwt.createToken(tokenPayload);

            // Guardar el token en la base de datos del usuario
            user.tokenValidation = token;
            await user.save();

            // Enviar el token al correo electrónico del usuario
            await sendPasswordResetEmail(email, token);

            //Respuesta exitosa
            return res.status(200).json({
                status: "success",
                message: "Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña"
            });


        } catch (error) {
            console.error("Error al recuperar contraseña:", error);
            return res.status(500).json({
                status: "error",
                message: "Error al recuperar contraseña"
            });
        }
    },

    // Restablecer la contraseña con el token enviado al correo electronico
    resetPassword: async (req, res) => {

        try {

            const { newPassword, confirmPassword } = req.body;

            // Obtener el token de la URL
            const token = req.query.token;

            // Obtener el token de la URL
            console.log("Token recibido:", token);

            // Validar que el token no este vacio
            if (!token) {
                return res.status(400).json({
                    status: "error",
                    message: "Debes proporcionar el token "
                });
            }

            // Validar que la nueva contraseña no este vacia
            if (!newPassword || !confirmPassword) {
                return res.status(400).json({
                    status: "error",
                    message: "Debes proporcionar la nueva contraseña"
                });
            }

            // Validar que las nuevas contraseña coincidan
            if (newPassword !== confirmPassword) {
                return res.status(400).json({
                    status: "error",
                    message: "Las nuevas contraseña no coinciden"
                });
            }

            // Decodificar el token JWT
            let decodedToken;

            try {
                decodedToken = jwt.decode(token, secretPass);
                console.log("Token decodificado:", decodedToken);

            } catch (error) {
                return res.status(401).json({
                    status: "error",
                    message: "Token inválido o ha expirado"
                });
            }

            const userEmail = decodedToken.email; // Obtener el email del token
            const user = await User.findOne({ email: userEmail }); // Buscar al usuario por el email
            const userId = user._id; // Obtener el ID del usuario


            if (!user) {
                return res.status(404).json({
                    status: "error",
                    message: "Usuario no encontrado"
                });
            }

            // Verificar si el token es valido o ha expirado
            const tokenExpiration = moment(decodedToken.exp * 1000);
            if (moment().isAfter(tokenExpiration)) {
                return res.status(401).json({
                    status: "error",
                    message: "Token expirado o inválido"
                });
            }

            // Encriptar y actualizar la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            console.log("Contraseña encriptada:", hashedPassword);

            // Actualizar la contraseña en la base de datos
            await User.findByIdAndUpdate(userId, { password: hashedPassword, confirmPassword: hashedPassword });

            console.log("Contraseña actualizada en la base de datos");

            // Registrar la actividad del usuario en la bd
            const userActivity = new Activity({
                user: userId,
                action: "Reseteo de contraseña",
                description: "Se ha restablecido la contraseña del usuario"
            })

            await userActivity.save();

            // Limpiar el campo tokenValidation en la bd del usuario
            user.tokenValidation = null;
            await user.save();

            console.log("Contraseña restablecida correctamente");

            // Respuesta exitosa
            return res.status(200).json({
                status: "success",
                message: "Se ha restablecido la contraseña exitosamente"
            });

        } catch (error) {
            console.error("Error al restablecer contraseña:", error);

            if (error.name === 'CastError' && error.kind === 'ObjectId') {
                return res.status(400).json({
                    status: "error",
                    message: "ID de usuario inválido"
                });
            }

            return res.status(500).json({
                status: "error",
                message: "Error al restablecer contraseña"
            });
        }
    },

    // Opcion 2: recuperacion por el usuario master o rrhh
    resetByAdmin: async (req, res) => {
        try {

            const userId = req.params.id;
            const currentUserRole = req.users.role;

            if (currentUserRole !== 'role_master' && currentUserRole !== 'role_rrhh') {
                return res.status(403).json({
                    status: "error",
                    message: "No tiene permiso para realizar esta operación"
                });
            }

            // Resetear la contraseña del usuario al valor de su nationalId
            const user = await User.findById(userId);
            const newPassword = user.nationalId.toString();

            // Encriptar la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

            // Actualizar la contraseña en la base de datos
            await User.findByIdAndUpdate(userId, { password: hashedPassword });

            // Respuesta exitosa
            return res.status(200).json({
                status: "success",
                message: "Se ha restablecido la contraseña exitosamente"
            });

        } catch (error) {
            console.error("Error al restablecer contraseña:", error);
            return res.status(500).json({
                status: "error",
                message: "Error al restablecer contraseña"
            });
        }
    }
}

const profileUsers = (req, res) => {

    try {
        const id = req.users.id;

        User.findById(id)
            .select({ password: 0 })
            .exec()
            .then(userProfile => {
                if (!userProfile) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El usuario no existe'
                    });
                }

                console.log("Datos del usuario:", userProfile); // Imprimir los datos del usuario
                console.log("Respuesta:", { userProfile });

                // Return user data
                return res.status(200).send({
                    status: 'success',
                    users: userProfile
                });
            })
            .catch(error => {
                console.error(error);
                return res.status(500).send({
                    status: 'error',
                    message: 'Error en la petición'
                });
            });
    } catch (error) {
        return res.status(401).send({
            status: 'error',
            message: 'Token inválido'
        });
    }
};

const listUsers = async (req, res) => {

    try {

        // Obtener la página de la solicitud desde los parámetros de consulta 
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Obtener el role y area del usuario actual
        const role = req.users.role;
        const area = req.users.area;

        // Consulta con operador ternario anidado
        const query =
            role === 'role_master' ? (
                req.query.role ? { role: req.query.role, area: req.query.area || undefined } :
                    req.query.area ? { area: req.query.area } : {}
            ) : role === 'role_rrhh' ? (
                req.query.area ? { role: { $in: ['role_budget', 'role_analyst'] }, area: req.query.area } :
                    { role: { $in: ['role_budget', 'role_analyst'] } }
            ) : role === 'role_budget' ? (
                req.query.area ? { role: 'role_analyst', area: req.query.area } : { role: 'role_analyst' }
            ) : role === 'role_analyst' ? (
                { role: 'role_analyst', area: area }
            ) : null;

        if (query === null) {
            return res.status(403).json({ message: 'No tienes permiso para listar usuarios' });
        }

        const options = {
            page: page,
            limit: limit,
            sort: { _id: -1 },
            collation: {
                locale: "es",
            }
        };

        const users = await User.paginate(query, options);

        // Devolver el listado de usuarios
        return res.status(200).json({
            status: 'success',
            users: users.docs,
            page,
            itemsPerPage: limit,
            total: users.totalDocs,
            pages: users.totalPages
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: 'error',
            message: 'Error en la petición',
            error: error.message
        });
    }
};

const updateUsers = async (req, res) => {

    try {

        // Obtener el id del usuario desde el JWT y la información que va a actualizar desde el body
        const userId = req.users.id;
        const { password, confirmPassword, ...restOfUpdates } = req.body;

        // Validar que solo se actualicen los campos permitidos
        const allowedUpdates = ['password', 'phone', 'email'];

        // Obtener todas las claves del body
        const allUpdates = Object.keys(req.body).filter(key => key !== 'oldPassword' && key !== 'confirmPassword');

        const invalidUpdates = allUpdates.filter(key => !allowedUpdates.includes(key));

        if (invalidUpdates.length > 0) {
            return res.status(400).send({
                status: "error",
                message: "No se pueden actualizar los siguientes campos: " + invalidUpdates.join(', ')
            });
        }

        // Si se actualiza la contraseña, realizar validaciones adicionales
        if (password) {
            // Verificar que se proporcionó la contraseña anterior
            const { oldPassword } = req.body;
            if (!oldPassword) {
                return res.status(400).send({
                    status: "error",
                    message: "Debes proporcionar la contraseña anterior"
                });
            }

            // Verificar que la contraseña anterior sea correcta
            const user = await User.findById(userId);
            const validOldPass = await bcrypt.compare(req.body.oldPassword, user.password);

            if (!validOldPass) {
                return res.status(400).send({
                    status: "error",
                    message: "La contraseña anterior es incorrecta"
                });
            }

            // Verificar que la nueva contraseña coincida con la confirmación
            if (password !== confirmPassword) {
                return res.status(400).send({
                    status: "error",
                    message: "Las contraseñas no coinciden"
                });
            }

            // Encriptar la nueva contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);
            restOfUpdates.password = hashedPassword;
        }

        // Actualizar el usuario en la bd
        const updatedUser = await User.findByIdAndUpdate(userId, restOfUpdates, {
            new: true,
            runValidators: true
        })

        if (!updatedUser) {
            return res.status(404).send({
                status: "error",
                message: "No se encontro el usuario"
            });
        }

        try {
            // Registrar la actividad del usuario en la bd
            const userActivity = new Activity({
                user: userId,
                action: "Update",
                details: `Actualizacion de la informacion del usuario: ${Object.keys(restOfUpdates).join(', ')}`
            });

            // Guardar la actividad
            await userActivity.save();
        } catch (activityError) {
            console.error("Error al registrar la actividad:", activityError);
        }

        // Devolver el usuario actualizado
        return res.status(200).send({
            status: "success",
            message: "Usuario actualizado",
            user: updatedUser
        });

    } catch (error) {
        console.error(error.message);

        // Devolver error
        if (error.name === 'MongoServerError' && error.code === 11000 && error.keyPattern.email === 1) {
            return res.status(400).send({
                status: "error",
                message: "El email que desea colocar esta siendo utilizado por otro usuario"
            });
        }
    }
};

const uploadProfileImage = async (req, res) => {

    try {
        // Obtener el Id del usuario del token JWT
        const userId = req.users.id;

        // Validar que se recibio una imagen
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó ninguna imagen.' });
        }

        // Validar el formato y el tamaño de la imagen
        const allowedExtensions = ['jpg', 'png', 'jpeg', 'webp'];
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ error: 'Extensión de archivo no permitida.' });
        }

        if (req.file.size > maxSize) {
            return res.status(400).json({ error: `El tamaño de la imagen excede el límite de ${maxSize / 1024 / 1024}MB.` });
        }

        // Obtener la URL de la imagen anterior
        const user = await User.findById(userId);
        const previousImageUrl = user.image;

        // Generar un nombre único para la imagen
        const uniqueFileName = `${userId}_profile.${fileExtension}`;

        // Subida de la imagen a ImgBB
        const imgbbResponse = await imgbbUploader({
            apiKey: process.env.IMGBB_API_KEY,
            base64string: req.file.buffer.toString('base64'),
            name: uniqueFileName
        });

        console.log('Respuesta de ImgBB:', imgbbResponse.delete_url);

        // Eliminar la imagen anterior de ImgBB (si existe)
        if (previousImageUrl && previousImageUrl !== 'default.png') { // Verificar si la imagen anterior no es la default
            try {
                const deleteResponse = await axios.delete(imgbbResponse.delete_url);
                console.log('Imagen anterior eliminada de ImgBB:', deleteResponse.data);
            } catch (error) {
                console.error('Error al eliminar la imagen anterior de ImgBB:', error);
            }
        }

        //Obtener la url de la imagen subida
        const imageUrl = imgbbResponse.url;

        //Actualizar la imagen en la base de datos del usuario
        const updatedUser = await User.findByIdAndUpdate(userId, { image: imageUrl }, { new: true });

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        console.log(userId);

        try {

            // Registrar la actividad del usuario en la bd
            const userActivitys = new Activity({
                user: userId,
                action: "Subir imagen de perfil",
                details: "Se ha subido una nueva imagen de perfil"
            });

            await userActivitys.save();

        } catch (error) {

            console.error('Error al registrar la actividad: ', error);

            return res.status(500).json({
                status: "error",
                message: "Error con el registro de la actividad"
            });

        }


        // Devolver la respuesta exitosa
        return res.status(200).json({
            status: "success",
            message: "Imagen de perfil subida exitosamente",
            user: updatedUser,
            imageUrl
        });

    } catch (error) {
        console.error('Error al subir la imagen de perfil: ', error);

        return res.status(500).json({
            status: "error",
            message: "Error en la comunicación con ImgBB"
        });
    }

};

const deleteImg = async (req, res) => {
    try {
        //Obtener el id del usuario del token
        const userId = req.users.id;

        // Obtener la URL de la imagen actual del usuario
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const imageUrl = user.image;
        //console.log('URL de la imagen:', imageUrl);


        // Eliminar la imagen de ImgBB (si existe y no es la default)
        if (imageUrl && imageUrl !== 'default.png') {
            try {

                /// Obtener la URL de eliminación de la imagen actual
                const imgbbResponse = await imgbbUploader({
                    apiKey: process.env.IMGBB_API_KEY,
                    imageUrl: imageUrl // Pasar la URL de la imagen actual
                });

                const deleteUrl = imgbbResponse.delete_url; // Obtener la URL de eliminación
                console.log('URL de eliminación de ImgBB:', deleteUrl);

                // Eliminar la imagen de ImgBB
                await axios.delete(deleteUrl);

                console.log('Imagen eliminada de ImgBB');

                // Eliminar la imagen de la base de datos del usuario
                await User.findByIdAndUpdate(userId, { image: 'default.png' }, { new: true });

            } catch (error) {
                console.error('Error al eliminar la imagen de ImgBB:', error);

                if (error.response && error.response.data) {
                    return res.status(400).json({
                        status: "error",
                        message: error.response.data.error.message
                    });
                }
                return res.status(500).json({
                    status: "error",
                    message: "Error en la comunicación con ImgBB"
                })
            }
        }

        // Actualizar la imagen en la base de datos del usuario
        const updateUser = await User.findByIdAndUpdate(userId, { image: 'default.png' }, { new: true });

        if (!updateUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        //Registrar la actividad del usuario en la bd
        try {
            const userActivitys = new Activity({
                user: userId,
                action: "Eliminar imagen de perfil",
                details: "Se ha eliminado una imagen de perfil"
            });

            await userActivitys.save();

        } catch (error) {

            console.error('Error al registrar la actividad: ', error);

            return res.status(500).json({
                status: "error",
                message: "Error con el registro de la actividad de eliminicación de imagen de perfil"
            });

        }

        // Devolver la respuesta exitosa
        return res.status(200).json({
            status: "success",
            message: "Imagen de perfil eliminada exitosamente",
            user: updateUser
        })


    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        return res.status(500).json({ error: 'Error al eliminar la imagen.' });
    }
};

const avatarUser = async (req, res) => {

    try {

        //Obtener el id del usuario del token
        const userId = req.users.id;

        //Obtener la url de la imagen subida por el usuario
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const imageUrl = user.image;

        return res.status(200).json({
            status: "success",
            message: "Imagen de perfil obtenida exitosamente",
            imageUrl
        })

    } catch (error) {
        console.error('Error al obtener la imagen:', error);
        return res.status(500).json({ error: 'Error al obtener la imagen.' });
    }

}

//Exportar acciones
export default {
    pruebaUsers,
    registerUsers,
    loginUsers,
    passRecoveryUsers,
    deleteUsers,
    profileUsers,
    listUsers,
    updateUsers,
    uploadProfileImage,
    avatarUser,
    deleteImg
}