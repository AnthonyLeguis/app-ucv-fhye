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

        //Obtener los datos de la planilla del cuerpo de la solicitud
        const sheetData = req.body;
        //Obtener el Id del usuario del cuerpo del token
        const userId = req.users.id;
        //Obtener el rol del usuario del cuerpo del token
        const userRole = req.users.role;
        //Obtener el area del usuario del cuerpo del token
        const userArea = req.users.area;
        const userName = req.users.names + ' ' + req.users.surnames;

        // Verificar si el usuario tiene el permiso para crear una planilla
        if (userRole !== 'role_analyst') {
            return res.status(403).json({
                status: "error",
                message: 'No posee la permisologia para crear una planilla'
            });
        }

        //Verificar si el area de la planilla coincide con el area del usuario
        if (sheetData.area !== userArea) {
            return res.status(403).json({
                status: "error",
                message: 'No puede crear una planilla para un area diferente a la suya'
            });
        }

        //Obtener el Id del empleado de la planilla
        const findEmployeeId = async (nationalId) => {
            const employee = await Employee.findOne({ nationalId: nationalId });
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
            } else {
                return null;
            }
        }

        //Asignar el valor del documento completo del empleado al campo employeeId a la planilla
        sheetData.employeeId = await findEmployeeId(sheetData.nationalId);

        //Validar los datos de la planilla
        if (
            !sheetData.sheetNumber ||
            !sheetData.area ||
            !sheetData.introducedDate ||
            !sheetData.sentDate ||
            !sheetData.observations_general ||
            !sheetData.facultyOrDependency ||
            !sheetData.entryDate ||
            !sheetData.effectiveDate ||
            !sheetData.contractEndDate ||
            !sheetData.executingUnit ||
            !sheetData.dedication ||
            !sheetData.teachingCategory ||
            !sheetData.movementType ||
            !sheetData.sheetNumber ||
            !sheetData.ubication ||
            !sheetData.employeeId ||
            !sheetData.idac ||
            !sheetData.position ||
            !sheetData.currentPosition ||
            !sheetData.grade ||
            !sheetData.opsuTable ||
            !sheetData.personnelType ||
            !sheetData.workingDay ||
            !sheetData.typeContract ||
            !sheetData.typeContract ||
            !sheetData.valueSalary ||
            !sheetData.mounthlySalary ||
            !sheetData.ReasonForMovement
        ) {
            return res.status(400).json({
                status: "error",
                message: 'Faltan datos por registrar en la planilla'
            });
        }

        //Crear una nueva planilla
        const newsheet = new Sheet({
            ...sheetData,
            createdBy: userId,
            user: [userId],
        });

        //Guardar planilla en la bd
        const sheetStored = await newsheet.save();

        //Registrar la actividad del usuario en la bd
        const newActivity = new Activity({
            user: userId,
            action: "Planilla creada por: " + userName + " del area: " + userArea,
            details: `Se ha creado una nueva planilla con ID: ${sheetStored._id}`
        });
        await newActivity.save();

        res.status(201).json({
            status: "success",
            message: 'Planilla creada correctamente',
            sheet: sheetStored
        })


    } catch (error) {
        console.error("Error al registrar la planilla:", error);

        if (error.name === 'MongoServerError' && error.code === 11000) {
            // Error de clave duplicada (sheetNumber o idac)
            let duplicateField = Object.keys(error.keyPattern)[0];
            let message = `El valor de ${duplicateField} ya está en uso.`;
            return res.status(400).json({
                status: "error",
                message: message
            });
        }

        return res.status(500).json({
            status: "error",
            message: 'Error al registrar la planilla: ' + error.message,
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
                // Puede ver planillas creadas, pendientes o aprobadas por RRHH
                status: { $in: ['created', 'pending', 'approvedRRHH'] }
            };
            if (req.query.area) {
                // Filtrar por área si se proporciona en la solicitud
                query.area = req.query.area;
            }
        } else if (role === 'role_rrhh') {
            query = {
                // Puede ver planillas creadas, pendientes o aprobadas por Budget
                status: { $in: ['created', 'pending', 'approvedBudget'] }
            };
            if (req.query.area) {
                // Filtrar por área si se proporciona en la solicitud
                query.area = req.query.area;
            }
        } else if (role === 'role_master') {
            query = {
                // Puede ver planillas creadas, pendientes o aprobadas por Budget
                status: { $in: ['created', 'pending', 'approvedRRHH', 'approvedBudget', 'rejectedRRHH', 'rejectedBudget'] }
            };
            if (req.query.area) {
                // Filtrar por área si se proporciona en la solicitud
                query.area = req.query.area;
            }
        }
        else if (role === 'role_analyst') {
            // Mostrar planillas según el tipo de listado solicitado
            const listType = req.query.status; // 'approved', 'rejected_budget' o 'rejected_rrhh'
            // Solo listar planillas de su área
            query.area = area;
            if (listType === 'approved') {
                query = {
                    area: area, // Solo planillas de su área
                    status: 'approved', // Solo planillas aprobadas
                    printPermission: true // Con permiso de impresión
                };
            } else if (listType === 'rejectedBudget') {
                query = {
                    area: area, // Solo planillas de su área
                    status: 'rejectedBudget' // Solo planillas rechazadas por Budget
                };
            } else if (listType === 'rejectedRRHH') {
                query = {
                    area: area, // Solo planillas de su área
                    status: 'rejectedRRHH' // Solo planillas rechazadas por RRHH
                };
            } else {
                return res.status(400).json({ message: 'Tipo de listado inválido' });
            }
        } else {
            return res.status(403).json({ message: 'No tienes permiso para listar planillas' });
        }

        // Obtener el listado de planillas con paginación
        const options = {
            page: page,
            limit: limit,
            sort: { _id: -1 }, // Ordenar por ID descendente
            collation: {
                locale: "es",
            },
        };
        const sheets = await Sheet.paginate(query, options);

        // Devolver el listado de planillas
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


//Exportar acciones
export default {
    pruebaSheets,
    registerSheet,
    deleteSheet,
    listSheets,
    updateSheet,
    exportsSheets
}