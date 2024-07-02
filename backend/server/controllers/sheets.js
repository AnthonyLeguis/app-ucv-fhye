//Importar modelo
import Sheet from "../models/sheet.js";
import User from "../models/user.js";
import reqPropSheets from "../helpers/reqPropSheets.js";
import userHelpers from "../helpers/getUserByIdAndSchool.js";
import ExcelJS from 'exceljs';
import moment from "moment";

//acciones de prueba
const pruebaSheets = (req, res) => {
    return res.status(200).send({
        message: 'Mensaje enviado desde: controllers/sheets.js'
    })
}

//accion de crear una planilla
const createSheet = async (req, res) => {

    // Sacar id del usuario identificado
    const identity = req.users;
    //console.log(identity);

    //recoger datos de la peticion
    const userSheet = req.body;

    // Validacion de datos requeridos
    if (!reqPropSheets.every(property => userSheet[property])) {
        return res.status(400).json({
            status: "error",
            message: 'Faltan datos por agregar a la planilla',
        })
    }

    //Encontrar el usuario para la planilla
    const matchUser = await userHelpers.getUserByIdAndSchool(userSheet.id, userSheet.school);

    // Validar que el usuario exista
    if (!matchUser) {
        return res.status(400).json({
            status: "error",
            message: 'El usuario con el ID y escuela ingresada no existe',
        })
    }

    console.log(matchUser);

    // Crear objeto de la nueva planilla
    try {

        //comprobar que existen los datos (validar datos)
        if (!reqPropSheets.every(property => userSheet[property])) {

            return res.status(400).json({
                status: "error",
                message: 'Faltan datos por agregar a la planilla',
            })
        }

        //Tranformar la data a un objeto de mongoose
        const newsheet = new Sheet({
            user: matchUser.id,
            sheet_number: userSheet.sheet_number,
            school: userSheet.school,
            movement_type: userSheet.movement_type,
            proposed_dedication: userSheet.proposed_dedication,
            period: userSheet.period,
            category: userSheet.category,
            arguments: userSheet.arguments,
            income: userSheet.income,
            income_type: userSheet.income_type,
            income_date: userSheet.income_date ? new Date(userSheet.income_date) : null,
            attachments: userSheet.attachments,
            program_code: userSheet.program_code,
            accounting_code: userSheet.accounting_code,
            effective_date: userSheet.effective_date,
            created_by: identity.id,
        });

        //Guardar planilla en la bd
        await newsheet.save();

        res.status(201).json({
            status: "success",
            message: 'Planilla creada correctamente',
            sheet: newsheet
        })


    } catch (error) {

        return res.status(500).json({
            status: "error",
            message: 'Error al crear la planilla: ' + error.message,
        });

    }

};

//accion de editar una planilla
const updateSheet = async (req, res) => {
    const identity = req.users;
    const sheetId = req.params.id;
    const allowedRoles = ['role_admin', 'role_analista'];

    if (!identity || !allowedRoles.includes(identity.role)) {
        return res.status(401).send({
            status: 'error',
            message: 'No está autorizado para realizar esta operación',
        });
    }

    try {
        // Validación de datos (puedes usar un esquema de validación aquí)
        const allowedUpdates = ['sheet_number', 'movement_type', 'proposed_dedication', 'period', 'category', 'arguments', 'income', 'income_type', 'income_date', 'attachments', 'program_code', 'accounting_code']; // Campos permitidos
        const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));

        if (updates.length === 0) {
            return res.status(400).send({
                status: 'error',
                message: 'No se proporcionaron datos válidos para actualizar',
            });
        }

        // Buscar la planilla original
        const originalSheet = await Sheet.findById(sheetId);

        if (!originalSheet) {
            return res.status(404).send({
                status: 'error',
                message: 'Planilla no encontrada',
            });
        }

        // Creacion de copia de la planilla original para historial
        const historyEntry = { ...originalSheet.toObject(), updatedBy: identity.id, updatedAt: new Date() };

        // Actualizar la planilla original
        const sheetUpdated = await Sheet.findOneAndUpdate(
            { _id: sheetId },
            { $set: req.body, $push: { history: historyEntry } }, // Agregar nueva entrada al historial
            { new: true }
        );

        // Validar actualización sin exito
        if (!sheetUpdated) {
            return res.status(404).send({
                status: 'error',
                message: 'Planilla no actualizada',
            });
        }

        return res.status(200).send({
            message: 'Planilla actualizada exitosamente',
            sheet: sheetUpdated,
        });

    } catch (err) {
        console.error(err);
        return res.status(500).send({
            status: 'error',
            message: 'Error al actualizar la planilla',
        });
    }
};

//acccion de borrar una planilla
const deleteSheet = async (req, res) => {

    const identity = req.users; // Asumiendo que usas middleware de autenticación
    const sheetId = req.params.id; // Obtener el ID de la planilla de los parámetros de la URL

    const allowedRoles = ['role_admin', 'role_analista', 'role_master']; // Roles permitidos para borrar una planilla

    if (!identity || !allowedRoles.includes(identity.role)) {
        return res.status(401).send({
            status: 'error',
            message: 'No esta autorizado para realizar esta operación',
        });
    }

    try {
        // Buscar la planilla y verificar el propietario
        const sheetRemoved = await Sheet.findOneAndDelete({
            _id: sheetId
        });

        if (!sheetRemoved) {
            return res.status(404).send({ // Volvemos al estado 404
              status: 'error',
              message: 'Planilla no encontrada', // Mensaje claro y conciso
            });
          }

        return res.status(200).send({
            message: 'Planilla eliminada exitosamente',
            sheet: sheetRemoved // Opcional: devolver la planilla eliminada
        });

    } catch (err) {
        console.error(err); // Registrar el error en la consola
        return res.status(500).send({
            status: 'error',
            message: 'Error al eliminar la planilla',
        });
    }
};

//accion de listado de planillas
const listSheets = async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1; // Obtener página de query parameters
        let itemsPerPage = parseInt(req.query.limit) || 5; // Limite de planillas por petición

        // Validar parámetros
        if (isNaN(page) || page < 1 || isNaN(itemsPerPage) || itemsPerPage < 1) {
            return res.status(400).send({
                status: 'error',
                message: 'Parámetros de paginación inválidos',
            });
        }

        const options = {
            page,
            limit: itemsPerPage,
            sort: { _id: -1 },
            collation: {
                locale: "es",
            },
        };

        const sheets = await Sheet.paginate({}, options);

        return res.status(200).send({
            status: 'success',
            sheets: sheets.docs,
            page,
            itemsPerPage,
            total: sheets.totalDocs,
            pages: sheets.totalPages,
        });
    } catch (error) {
        console.error(error); // Registrar el error en consola
        return res.status(500).send({
            status: 'error',
            message: 'Error al obtener la lista de planillas: ' + error.message, // Detalle del error
        });
    }
};

//accion de buscar informacion de un usuario para la planilla
const getUserInfo = async (req, res) => {
    try {
        const userInfo = req.body; // Asumimos que CI y school vienen en la query string

        const user = await userHelpers.getUserByIdAndSchool(userInfo.id, userInfo.school);

        res.status(200).json({
            status: "success",
            user: user
        });

    } catch (error) {
        // Manejo de errores
        res.status(error.status || 500).json({
            status: "error",
            message: error.message
        });
    }
};

//descargar en excel las planillas
const exportsSheets = async (req, res) => {

    const identity = req.users; // Asumiendo que usas middleware de autenticación
    const allowedRoles = ['role_admin', 'role_analista']; // Roles permitidos para borrar una planilla

    if (!identity || !allowedRoles.includes(identity.role)) {
        return res.status(401).send({
            status: 'error',
            message: 'No esta autorizado para realizar esta operación',
        });
    }

    try {
        const { school } = req.body;
        const now = new Date();
        const timestamp = moment(now).format('DD-MM-YY')

        // Obtener los datos de los usuarios que pertenezcan a la escuela indicada
        const sheets = await Sheet.find({ school }).populate('user', 'school')

        if (sheets.length === 0) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encontraron planillas para la escuela especificada',
            });
        }

        const workbook = new ExcelJS.Workbook();
        const schoolWords = school.split(' ');
        const firstSchoolWord = schoolWords[0];
        const worksheetName = `Planillas_${firstSchoolWord}_${timestamp.replace(/[:.]/g, '')}`;
        const worksheet = workbook.addWorksheet(worksheetName);

        worksheet.columns = [
            { header: 'Número de Planilla', key: 'sheet_number', width: 15 },
            { header: 'Tipo de Movimiento', key: 'movement_type', width: 20 },
            { header: 'Dedicación Propuesta', key: 'proposed_dedication', width: 20 },
            { header: 'Periodo', key: 'period', width: 10 },
            { header: 'Categoría', key: 'category', width: 15 },
            { header: 'Argumentos', key: 'arguments', width: 30 },
            { header: 'Ingreso', key: 'income', width: 15 },
            { header: 'Tipo de Ingreso', key: 'income_type', width: 15 },
            { header: 'Fecha de Ingreso', key: 'income_date', width: 15 },
            { header: 'Adjuntos', key: 'attachments', width: 20 },
            { header: 'Código de Programa', key: 'program_code', width: 15 },
            { header: 'Código Contable', key: 'accounting_code', width: 15 },
            { header: 'Fecha Efectiva', key: 'effective_date', width: 15 },
            { header: 'Creado Por', key: 'created_by', width: 20 },
            { header: 'Creado En', key: 'created_at', width: 20 },
        ];

        sheets.forEach(sheet => {
            worksheet.addRow({
                sheet_number: sheet.sheet_number,
                movement_type: sheet.movement_type,
                proposed_dedication: sheet.proposed_dedication,
                period: sheet.period,
                category: sheet.category,
                arguments: sheet.arguments,
                income: sheet.income,
                income_type: sheet.income_type,
                income_date: sheet.income_date,
                attachments: sheet.attachments,
                program_code: sheet.program_code,
                accounting_code: sheet.accounting_code,
                effective_date: sheet.effective_date,
                created_by: sheet.created_by,
                created_at: sheet.created_at
            });
        });

        // Configuracion de las cabeceras de las respuestas
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Planillas_${firstSchoolWord}_${timestamp.replace(/[:.]/g, '')}.xlsx`);

        await workbook.xlsx.write(res);
        res.end();

    } catch (error) {
        console.error(error); // Registrar el error en consola
        return res.status(500).send({
            status: 'error',
            message: 'Error al obtener la lista de planillas: ' + error.message, // Detalle del error
        });
    }

}


//Exportar acciones
export default {
    pruebaSheets,
    createSheet,
    getUserInfo,
    deleteSheet,
    listSheets,
    updateSheet,
    exportsSheets
}