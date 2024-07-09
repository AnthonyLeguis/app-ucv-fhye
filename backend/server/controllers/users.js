// Importacion de dependencias
import bcrypt from "bcrypt";
import User from "../models/user.js";
import jwt from "../services/jwt.js";
import fs from 'fs';
import path from "path";
import imgbbUploader from 'imgbb-uploader';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import axios from 'axios';

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
const registerUsers = (req, res) => {
    //recoger datos de la peticion
    let params = req.body;

    // Creacion de objeto de usuario
    try {
        //comprobar que existen los datos (validar datos)
        if (!params.names || !params.surnames || !params.email || !params.password ||
            !params.ci || !params.idac || !params.school || !params.department ||
            !params.professorship || !params.current_dedication || !params.executing_unit ||
            !params.hire_date) {

            return res.status(400).json({
                status: "error",
                message: 'Faltan datos por enviar'
            })
        }

    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Falló la validación: " + error.message
        });

    }

    const lowerCaseEmail = params.email.toLowerCase();

    //control de usuarios duplicados
    User.find({
        $or: [
            { email: lowerCaseEmail },
            { ci: params.ci },
            { idac: params.idac }
        ],

    })
        .then((users) => {

            if (users && users.length >= 1) {
                return res.status(200).send({
                    status: "success",
                    message: "El usuario ya existe",
                });
            }

            //encriptar contraseña
            let pwd = bcrypt.hashSync(params.password, 10);
            //console.log(pwd);
            params.password = pwd;

            var user_to_save = new User(params);

            //Guardado del user en la bd
            user_to_save.save()
                .then((userStored) => {
                    return res.status(200).json({
                        status: "success",
                        message: "Usuario registrado correctamente",
                        user: userStored,
                    });
                })
                .catch((error) => {
                    return res.status(500).json({
                        status: "error",
                        message: "Error al guardar el usuario: " + error.message,
                    });
                });


        })
        .catch((error) => {
            return res.status(500).json({
                status: "error",
                message: "Error en la consulta o creación de usuarios: " + error.message
            });

        });
}

const loginUsers = (req, res) => {
    //recoger parametros
    var params = req.body;

    if (!params.ci) {
        return res.status(400).send({
            status: "error",
            message: 'Falta la cédula de identidad'
        })
    } else if (isNaN(params.ci)) {
        return res.status(400).send({
            status: "error",
            message: 'La cédula de identidad debe ser un número válido'
        })
    } else if (!params.password) {
        return res.status(400).send({
            status: "error",
            message: 'Falta la contraseña'
        })
    }

    // Limpiar datos de los espacios
    params.ci = parseInt(params.ci.trim());
    params.password = params.password.trim();

    // Buscar en la bd si existe
    User.findOne({ ci: params.ci })
        // .select({ password: 0, role: 0, __v: 0, created_at: 0, hire_date: 0 })
        .exec()
        .then(async (users) => {
            if (!users) {
                return res.status(404).send({
                    status: "error",
                    message: 'El usuario no existe'
                })
            } else {

                // Comprobar contraseña
                const pwd = await bcrypt.compare(params.password, users.password)

                if (!pwd) {
                    return res.status(404).send({
                        status: "error",
                        message: 'La contraseña es incorrecta'
                    })
                }

                // Conseguir token
                const token = jwt.createToken(users);

                // Devolver datos Usuario
                return res.status(200).send({
                    status: "success",
                    message: 'Te has identificado correctamente',
                    users: {
                        id: users._id,
                        ci: users.ci,
                        names: users.names,
                        surnames: users.surnames,
                        email: users.email
                    },
                    token
                })
            }
        })
        .catch((error) => {

            return res.status(500).send({
                status: "error",
                message: "Error en la consulta o creación de usuarios: " + error.message
            });

        });
}

const profileUsers = (req, res) => {

    // Receive user ID parameter from the URL
    const id = req.params.id;

    // Query to fetch user data
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

            // Return user data
            return res.status(200).send({
                status: 'success',
                users: userProfile
            });
        })
        .catch(error => {
            console.error(error); // Log the error for debugging
            return res.status(500).send({
                status: 'error',
                message: 'Error en la petición'
            });
        });
};

const listUsers = async (req, res) => {
    // Controlar en que pagina estamos
    let page = parseInt(req.params.page) || 1;

    // Consulta con mongoose pagination
    let itemsPerPage = 10;

    const options = {
        page: page,
        limit: itemsPerPage,
        sort: { _id: -1 },
        collation: {
            locale: "es",
        },

    };

    try {

        // Obtener listado de usuarios
        const users = await User.paginate({}, options);

        // obtener el numero total de usuarios
        const total = await User.countDocuments();

        if (!users) {
            return res.status(404).send({
                status: 'error',
                message: 'No se han encontrado usuarios'
            });
        }

        // Devolver listado de usuarios
        res.status(200).send({
            status: 'success',
            users: users.docs,
            page,
            itemsPerPage,
            total,
            pages: Math.ceil(total / itemsPerPage)
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

    const userIdentity = req.users;
    const userToUpdate = req.body;

    // Eliminar los campos que sobran
    delete userIdentity.iat;
    delete userIdentity.role;
    delete userIdentity.exp;

    try {
        // Verify extracted user ID
        //console.log("Extracted user ID:", userIdentity.id);

        // Check if user exists before updating
        const user = await User.findById(userIdentity.id);
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "El usuario no existe"
            });
        }

        // Si la contraseña se ha actualizado, encriptarla
        if (userToUpdate.password !== "" && userIdentity.password !== userToUpdate.password) {
            let hashedPassword = bcrypt.hashSync(userToUpdate.password, 10);
            userToUpdate.password = hashedPassword;
        }

        // Buscar y actualizar el usuario
        const updatedUser = await User.findByIdAndUpdate(userIdentity.id, userToUpdate, { new: true });

        if (!updatedUser) {
            return res.status(404).send({
                status: "error",
                message: "No se ha podido actualizar el usuario",
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Usuario actualizado",
            users: updatedUser
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            status: "error",
            message: "Error al actualizar el usuario",
            error: error.message
        });
    }
};

const uploadImg = async (req, res) => {

    try {
        // 1. Validación de la imagen
        if (!req.file) {
            return res.status(400).json({ error: 'No se proporcionó ninguna imagen.' });
        }

        const allowedExtensions = ['jpg', 'png', 'jpeg', 'webp'];
        const fileExtension = req.file.originalname.split('.').pop().toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ error: 'Extensión de archivo no permitida.' });
        }

        if (req.file.size > 2 * 1024 * 1024) {
            return res.status(413).json({ error: 'El tamaño de la imagen excede el límite de 2MB.' });
        }

        // 2. Subida a ImgBB
        const imgbbResponse = await imgbbUploader({
            apiKey: process.env.IMGBB_API_KEY,  // Cambiar 'apiKey' por 'key'
            base64string: req.file.buffer.toString('base64'),
            name: req.file.originalname
        });

        console.log('Respuesta de ImgBB:', imgbbResponse);


        // 3. Actualización de la base de datos
        const imageUrl = imgbbResponse.url;
        const deleteUrl = imgbbResponse.delete_url;

        // Guarda la imageUrl en la base de datos asociada al usuario
        const userUpdated = await User.findByIdAndUpdate(
            req.users.id,
            {
                image: imageUrl,
                delete_url: deleteUrl
            },
            { new: true }
        );

        if (!userUpdated) {
            return res.status(404).send({
                status: "error",
                message: "No se ha podido actualizar la foto de perfil",
            });
        }

        // 4. Respuesta exitosa
        return res.status(200).json({
            message: 'Imagen subida y perfil actualizado con éxito.',
            user: userUpdated,
            imageUrl,
        });

    } catch (error) {
        console.error('Error al subir la imagen a ImgBB:', error);

        if (error.response) {
            // El error viene de Axios (petición HTTP)
            return res.status(error.response.status).json({
                status: "error",
                message: error.response.data.error || "Error en la comunicación con ImgBB"
            });
        } else {
            // Otro tipo de error
            return res.status(500).json({
                status: "error",
                message: "Error al subir la imagen a ImgBB",
            });
        }
    }



};

const deleteImg = async (req, res) => {
    try {
        const userId = req.params.id; // Usar req.params.id

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ error: 'ID de usuario no válido.' });
        }

        const user = await User.findById(userId);
        if (!user || !user.delete_url) {
            return res.status(404).json({ error: 'No se encontró ninguna imagen para eliminar.' });
        }

        const deleteResponse = await axios.delete(user.delete_url);
        console.log('Respuesta de eliminación:', deleteResponse);

        // Actualizar el usuario y obtener el usuario actualizado
        const userUpdated = await User.findByIdAndUpdate(userId,
            {
                image: "default.png",
                delete_url: null
            },
            { new: true } // Opción para devolver el usuario actualizado
        );

        return res.status(200).json({
            message: 'Imagen eliminada con éxito.',
            user: userUpdated // Devolver el usuario actualizado
        });

    } catch (error) {
        console.error('Error al eliminar la imagen:', error);
        return res.status(500).json({ error: 'Error al eliminar la imagen.' });
    }
};

const avatarUser = async (req, res) => {

    //Sacar el parametro de la url
    const file = req.params.file;

    //Validacion de la presencia del  parametro
    if (!file) {
        return res.status(404).send({
            status: 'error',
            message: 'No se encuentra el parametro del archivo'
        });
    }

    //Montar el path real de la imagen
    const filePath = "./server/uploads/avatars/" + file;

    fs.stat(filePath, (error, exists) => {
        if (!exists) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encuentra la imagen'
            });
        }

        // Devolver el fichero
        return res.sendFile(path.resolve(filePath));
    });

}

//Exportar acciones
export default {
    pruebaUsers,
    registerUsers,
    loginUsers,
    profileUsers,
    listUsers,
    updateUsers,
    uploadImg,
    avatarUser,
    deleteImg
}