import nodemailer from "nodemailer";

import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendPasswordRecoveryEmail(email, token) {
    try {

        let frontendUrl;

        if (process.env.NODE_ENV === 'production') {
            // Obtener la URL de `ORIGIN_FRONTEND_DEPLOYMENT` (corregida)
            const deploymentUrls = process.env.ORIGIN_FRONTEND_DEPLOYMENT.split(', ');
            frontendUrl = deploymentUrls[0]; // O la URL que corresponda
        } else {
            // Obtener la URL de `ORIGIN_FRONTEND_LOCAL`
            const localUrls = process.env.ORIGIN_FRONTEND_LOCAL.split(',');
            frontendUrl = localUrls[0]; // http://localhost:5173
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Sistema GMP',
            html: `
            <head>
                <style>
                        .titulo {
                        color: #007bff; /* Color azul */
                        }
                        .advertencia {
                        color: #dc3545; /* Color rojo */
                        }
                        .resaltado {
                            font-weight: bold;
                        }
                        .button {
                            background-color: #007bff; /* Color azul */
                            color: white; /* Letras blancas */
                            font-weight: 600; /* Semi-bold */
                            padding: 10px 20px; /* Espaciado interno */
                            border: none; /* Sin borde */
                            border-radius: 5px; /* Bordes redondeados */
                            cursor: pointer; /* Cambiar el cursor al pasar   
                            el ratón */
                            text-decoration: none; /* Sin subrayado en el texto */
                        }
                            .button:hover {
                                background-color: #0069d9;
                                cursor: pointer;
                            }
                </style>
            </head>
            <body>
                <img src="https://i.ibb.co/k0qHmNk/Logo-Favicon.png" alt="Logo de la empresa" width="150" height="150"> 
                <h2 class="titulo">Siga los pasos para reestablecer su contraseña</h2>

                <p class="resaltado">Por favor, haga clic en el boton de abajo para reestablecer su contraseña: </p>
                    <a href="${frontendUrl}reset-password?token=${token}" class="button">Restablecer contraseña</a>

                    <br>
                <h4 class="advertencia">Tendra 1 HORA para reestablecer su contraseña, de lo contrario el enlace expirará</h4>
            </body>
            `
        };

        // En el caso que se desee enviar algun documento adjunto
        // mailOptions.attachments = [{
        //     filename: 'LogoFavicon.svg',
        //     path: __dirname + '/../assets/image/LogoFavicon.svg',
        //     cid: 'logo',
        //     contentDisposition: 'inline',
        // }]

        // Enviar el correo electrónico
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);

    } catch (error) {
        console.error('Error al enviar el correo:', error);
        throw error;

    }
}

export default sendPasswordRecoveryEmail;