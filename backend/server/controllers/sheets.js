//Importar modelo
import Sheet from "../models/sheet.js";
import { getSheetColumns, getSheetRowData } from "../helpers/reqPropSheets.js";
import userHelpers from "../helpers/getUserByIdAndSchool.js";
import ExcelJS from 'exceljs';
import moment from "moment";
import Activity from "../models/userActivity.js";
import Employee from "../models/employee.js";

//acciones de prueba
const pruebaSheets = (req, res) => {
    return res.status(200).send({
        message: 'Mensaje enviado desde: controllers/sheets.js'
    })
}

//accion de crear una planilla
const registerSheet = async (req, res) => {
    try {
        const sheetData = req.body;
        const userId = req.users.id;
        const userRole = req.users.role;
        const userArea = req.users.area;
        const userName = `${req.users.names} ${req.users.surnames}`;

        // Verificar permisos del usuario
        if (userRole !== 'role_analyst') {
            return res.status(403).json({
                status: "error",
                message: 'No posee la permisología para crear una planilla'
            });
        }

        // Verificar área del usuario
        if (sheetData.area !== userArea) {
            return res.status(403).json({
                status: "error",
                message: 'No puede crear una planilla para un área diferente a la suya'
            });
        }

        // Buscar el ID del empleado
        const findEmployeeId = async (nationalId) => {
            const employee = await Employee.findOne({ nationalId });
            if (employee) {
                return {
                    _id: employee._id,
                    area: employee.area,
                    names: employee.names,
                    surnames: employee.surnames,
                    idType: employee.idType,
                    nationalId: employee.nationalId,
                    rif: employee.rif,
                    birthdate: employee.birthdate,
                    countryOfBirth: employee.countryOfBirth,
                    cityOfBirth: employee.cityOfBirth,
                    maritalStatus: employee.maritalStatus,
                    gender: employee.gender,
                    familyDependents: employee.familyDependents,
                    educationLevel: employee.educationLevel,
                    email: employee.email,
                    phoneNumber: employee.phoneNumber,
                    address: employee.address,
                    bank: employee.bank,
                    payrollAccount: employee.payrollAccount
                };
            }
            return null;
        };

        // Asignar el valor del documento completo del empleado al campo employeeId de la planilla
        sheetData.employeeId = await findEmployeeId(sheetData.nationalId);

        // Validar los datos de la planilla
        const requiredFields = [
            'sheetNumber', 'area', 'introducedDate', 'sentDate', 'observations_general',
            'facultyOrDependency', 'entryDate', 'effectiveDate', 'contractEndDate',
            'executingUnit', 'dedication', 'teachingCategory', 'movementType',
            'sheetNumber', 'ubication', 'employeeId', 'idac', 'position',
            'currentPosition', 'grade', 'opsuTable', 'personnelType',
            'workingDay', 'typeContract', 'valueSalary', 'mounthlySalary',
            'ReasonForMovement'
        ];

        const missingFields = requiredFields.filter(field => !sheetData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                status: "error",
                message: `Faltan datos por registrar en la planilla: ${missingFields.join(', ')}`
            });
        }

        // Crear una nueva planilla
        const newSheet = new Sheet({
            ...sheetData,
            createdBy: userId,
            user: [userId],
        });

        // Guardar planilla en la base de datos
        const sheetStored = await newSheet.save();

        // Registrar la actividad del usuario en la base de datos
        const newActivity = new Activity({
            user: userId,
            action: `Planilla creada por: ${userName} del área: ${userArea}`,
            details: `Se ha creado una nueva planilla con ID: ${sheetStored._id}`
        });
        await newActivity.save();

        return res.status(201).json({
            status: "success",
            message: 'Planilla creada correctamente',
            sheet: sheetStored
        });

    } catch (error) {
        console.error("Error al registrar la planilla:", error);

        if (error.name === 'MongoServerError' && error.code === 11000) {
            // Error de clave duplicada (sheetNumber o idac)
            const duplicateField = Object.keys(error.keyPattern)[0];
            const message = `El valor de ${duplicateField} ya está en uso.`;
            return res.status(400).json({
                status: "error",
                message
            });
        }

        return res.status(500).json({
            status: "error",
            message: `Error al registrar la planilla: ${error.message}`,
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const role = req.users.role;
        const area = req.users.area;

        let query = {};

        if (role === 'role_budget') {
            query = {
                created: true,
                pending: true
            };
            if (req.query.area) {
                query.area = req.query.area;
            }
        } else if (role === 'role_rrhh') {
            query = {
                created: true,
                pending: true,
                approvedBudget: true
            };
            if (req.query.area) {
                query.area = req.query.area;
            }
        } else if (role === 'role_master') {
            query = {
                created: true,
                pending: true,
                approvedRRHH: true,
                approvedBudget: true,
                rejectedRRHH: true,
                rejectedBudget: true
            };
            if (req.query.area) {
                query.area = req.query.area;
            }
        } else if (role === 'role_analyst') {
            const listType = req.query.status;
            query.area = area;
            if (listType === 'approved') {
                query = {
                    area: area,
                    approved: true,
                    printPermission: true
                };
            } else if (listType === 'rejectedBudget') {
                query = {
                    area: area,
                    rejectedBudget: true
                };
            } else if (listType === 'rejectedRRHH') {
                query = {
                    area: area,
                    rejectedRRHH: true
                };
            } else {
                return res.status(400).json({ message: 'Tipo de listado inválido' });
            }
        } else {
            return res.status(403).json({ message: 'No tienes permiso para listar planillas' });
        }

        // Añadir logs para verificar el query
        console.log('Query:', query);

        const options = {
            page: page,
            limit: limit,
            sort: { _id: -1 },
            collation: {
                locale: "es",
            },
        };
        const sheets = await Sheet.paginate(query, options);

        // Añadir logs para verificar la respuesta
        console.log('Sheets:', sheets.docs);

        return res.status(200).send({
            status: 'success',
            sheets: sheets.docs,
            page,
            itemsPerPage: limit,
            total: sheets.totalDocs,
            pages: sheets.totalPages,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send({
            status: 'error',
            message: 'Obtuvo el siguiente error en la solicitud: ' + error.message,
        });
    }
};

//descargar en excel las planillas
const exportsSheets = async (req, res) => {

    const identity = req.users; // Asumiendo que usas middleware de autenticación
    const allowedRoles = ['role_master', 'role_rrhh', 'role_budget']; // Roles permitidos para exportar una planilla

    if (!identity || !allowedRoles.includes(identity.role)) {
        return res.status(401).send({
            status: 'error',
            message: 'No esta autorizado para realizar esta operación',
        });
    }

    try {
        const { idac, nationalId } = req.body; // Obtener idac o nationalId de la solicitud

        let query = {};

        if (idac) {
            query.idac = parseInt(idac); // Buscar por idac si se proporciona
        } else if (nationalId) {
            // Buscar por nationalId si se proporciona
            const employee = await Employee.findOne({ nationalId });
            if (employee) {
                query.employeeId = employee._id;
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'No se encontró ningún empleado con ese nationalId',
                });
            }
        } else {
            return res.status(400).send({
                status: 'error',
                message: 'Debes proporcionar un idac o un nationalId',
            });
        }

        const sheet = await Sheet.findOne(query)
            .populate('employeeId')
            .lean();
        //console.log(sheet.employeeId)//

        if (!sheet) {
            return res.status(404).send({
                status: 'error',
                message: 'No se encontró ninguna planilla con ese idac o nationalId',
            });
        }

        const workbook = new ExcelJS.Workbook();
        const areaWords = sheet.area.split(' ');
        const firstAreaWord = areaWords[0];
        const timestamp = moment().format('DD-MM-YY');
        const worksheetName = `Planilla_${firstAreaWord}_${timestamp.replace(/[:.]/g, '')}`;
        const worksheet = workbook.addWorksheet(worksheetName);

        // Ajustar las columnas del excel según el modelo de datos (sin incluir historiales ni status)
        worksheet.columns = getSheetColumns();

        worksheet.addRow(getSheetRowData(sheet));

        // Configuración de las cabeceras de las respuestas
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename=Planilla_${firstAreaWord}_${timestamp.replace(/[:.]/g,
            '')}.xlsx`);

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

const getAlerts = async (req, res) => {
    try {
        const role = req.users.role;
        const area = req.users.area;

        // Validar el rol del usuario
        const validRoles = ['role_budget', 'role_rrhh', 'role_master', 'role_analyst'];
        if (!validRoles.includes(role)) {
            return res.status(403).json({
                status: 'error',
                message: 'No tienes permiso para acceder a las alertas'
            });
        }

        let query = { area }; // Filtra por área del usuario

        // Consulta personalizada según el rol del usuario
        if (role === 'role_budget') {
            query.status = { $in: ['created', 'pending'] };
        } else if (role === 'role_rrhh') {
            query.status = { $in: ['created', 'pending', 'approvedBudget'] };
        } else if (role === 'role_master') {
            query.status = { $in: ['created', 'pending', 'approvedRRHH', 'approvedBudget', 'rejectedRRHH', 'rejectedBudget'] };
        } else if (role === 'role_analyst') {
            query.$or = [
                { status: 'approved', printPermission: true },
                { status: { $in: ['rejectedBudget', 'rejectedRRHH'] } }
            ];
        }

        // Obtener los conteos de alertas con una sola consulta
        const alerts = await Sheet.aggregate([
            { $match: query }, // Filtrar por la consulta principal
            {
                $group: {
                    _id: null,
                    pendingSheets: { $sum: { $cond: [{ $in: ['$status', ['created', 'pending']] }, 1, 0] } },
                    rejectedSheets: { $sum: { $cond: [{ $in: ['$status', ['rejectedBudget', 'rejectedRRHH']] }, 1, 0] } },
                    approvedSheets: { $sum: { $cond: [{ $and: [{ $eq: ['$status', 'approved'] }, { $eq: ['$printPermission', true] }] }, 1, 0] } },
                },
            },
        ]);

        // Devolver los resultados en la respuesta
        return res.status(200).json({
            pendingSheets: alerts[0]?.pendingSheets || 0,
            rejectedSheets: alerts[0]?.rejectedSheets || 0,
            approvedSheets: alerts[0]?.approvedSheets || 0
        });
    } catch (error) {
        console.error('Error al obtener las alertas:', error);
        // Manejo de errores más específico
        if (error.name === 'MongoNetworkError') {
            return res.status(500).json({
                status: 'error',
                message: 'Error de conexión a la base de datos'
            });
        }
        return res.status(500).json({
            status: 'error',
            message: 'Error al obtener las alertas'
        });
    }
};

//Exportar acciones
export default {
    pruebaSheets,
    registerSheet,
    deleteSheet,
    listSheets,
    updateSheet,
    exportsSheets,
    getAlerts
}