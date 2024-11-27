import Employee from "../models/employee.js";
import Activity from "../models/userActivity.js";

const pruebaEmployees = (req, res) => {
    return res.status(200).send({
        message: 'Prueba de ruta del controlador para empleado'
    })
}

// Accion de registrar empleados
const registerEmployee = async (req, res) => {

    try {

        //Obtener los datos del empleado del cuerpo de la peticion
        const employeeData = req.body;

        //Obtener el nombre del usuario autenticado
        const userName = req.users.names + ' ' + req.users.surnames

        // Asignar el valor de userName a createdBy en employeeData
        employeeData.createdBy = {
            id: req.users.id,
            name: userName
        };

        //Validar los campos requeridos del empleado
        if (
            !employeeData.names ||
            !employeeData.surnames ||
            !employeeData.idType ||
            !employeeData.nationalId ||
            !employeeData.rif ||
            !employeeData.birthdate ||
            !employeeData.countryOfBirth ||
            !employeeData.cityOfBirth ||
            !employeeData.maritalStatus ||
            !employeeData.area ||
            !employeeData.gender ||
            !employeeData.familyDependents ||
            !employeeData.educationLevel ||
            !employeeData.email ||
            !employeeData.phoneNumber ||
            !employeeData.address ||
            !employeeData.bank ||
            !employeeData.payrollAccount ||
            !employeeData.createdBy
        ) {
            return res.status(400).json({
                status: "error",
                message: 'Faltan datos del empleado por agregar al registro',
            });
        }

        //Verificar si el usuario autenticado tiene el permiso para registrar un empleado
        const allowedRoles = ['role_master', 'role_rrhh'];
        if (!allowedRoles.includes(req.users.role)) {
            return res.status(403).json({
                status: "error",
                message: 'No tienes permiso para registrar empleados',
            });
        }

        // Crear el nuevo empleado
        const newEmployee = new Employee(employeeData);

        // Guardar el nuevo empleado
        await newEmployee.save();

        // Registrar la actividad del usuario en la bd
        const userActivity = new Activity({
            user: req.users.id,
            action: 'Nuevo registro de empleado el dia: ' + new Date(),
            details: 'Se agrego un nuevo registro de empleado al sistema en el area de: ' + employeeData.area
        })
        await userActivity.save();

        // Devolver una respuesta exitosa
        return res.status(201).json({
            status: "success",
            message: 'Empleado registrado correctamente',
        });

    } catch (error) {

        console.error("Error al registrar el empleado:", error);

        if (error.name === 'MongoServerError' && error.code === 11000) {
            // Error de clave duplicada (nationalId o rif)
            let duplicateField = Object.keys(error.keyPattern)[0];
            let message = `El valor de ${duplicateField} ya está en uso.`;
            return res.status(400).json({
                status: "error",
                message: message
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Error al registrar el empleado: " + error.message,
        });
    }
};

//Accion de actualizar informacion de un empleado
const updateEmployee = async (req, res) => {

    try {

        //Obtener el ID del empleado de la URL
        const employeeId = req.params.id;
        //Obtener los datos a actualizar del empleado
        const employeeUpdates = req.body;
        //Obtener el rol del usuario que esta autenticado y realizara la accion de actualizar
        const userRole = req.users.role;
        //Obtener el area del usuario que esta autenticado y realizara la accion de actualizar
        const userArea = req.users.area;

        // Obtener el empleado de la bd
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({
                status: "error",
                message: 'Empleado no encontrado'
            });
        }

        // Verificar si el usuario autenticado tiene el permiso para actualizar el empleado
        if (userRole === 'role_analyst' && employee.area !== userArea) {
            return res.status(403).json({
                status: "error",
                message: 'No tienes permiso para actualizar este empleado'
            });
        }

        // Si no hay datos para actualizar, devolver la información del empleado
        if (Object.keys(employeeUpdates).length === 0) {
            return res.status(200).json({
                status: "success",
                message: "Información del empleado",
                employee: employee
            });
        }

        // Actualizar el empleado en la bd
        const updatedEmployee = await Employee.findByIdAndUpdate(employeeId, employeeUpdates, { new: true });

        // Registrar la actividad del usuario en la bd
        const userActivity = new Activity({
            user: req.users.id,
            action: 'Actualizado el registro de empleado el dia: ' + new Date(),
            details: 'Se actualizo un nuevo registro de empleado al sistema en el area de: ' + employeeUpdates.area
        })
        await userActivity.save();

        // Devolver una respuesta exitosa
        return res.status(200).json({
            status: "success",
            message: 'Empleado actualizado correctamente',
            employee: updatedEmployee
        });

    } catch (error) {
        console.error("Error al actualizar el empleado:", error);

        if (error.name === 'MongoServerError' && error.code === 11000) {
            let duplicateField = Object.keys(error.keyPattern)[0];
            let message = `El valor de ${duplicateField} ya está en uso.`;
            return res.status(400).json({
                status: "error",
                message: message
            });
        }

        return res.status(500).json({
            status: "error",
            message: "Error al actualizar el empleado: " + error.message,
        });
    }

}

const deleteEmployee = async (req, res) => {
    try {
        //Obtencion el ID del empleado de la URL
        const employeeId = req.params.id;
        //Obtener el rol del usuario que esta autenticado y realizara la accion
        const userRole = req.users.role;

        //Verificar si el usuario tiene el permiso para borrar un empleado
        const allowedRoles = ["role_master", "role_rrhh"];
        if (!allowedRoles.includes(userRole)) {
            return res.status(403).json({
                status: "error",
                message: 'No tienes permiso para borrar este empleado'
            });
        }

        // Eliminar el empleado de la bd
        const deletedEmployee = await Employee.findByIdAndDelete(employeeId);

        if (!deletedEmployee) {
            return res.status(404).json({
                status: "error",
                message: 'Empleado no encontrado'
            });
        }

        // Registrar la actividad del usuario en la bd
        const userActivity = new Activity({
            user: req.users.id,
            action: 'Ha sido eliminado un empleado el dia: ' + new Date(),
            details: 'EL empleado ' + deletedEmployee.names + ' ha sido eliminado del sistema por el usuario ' + req.users.names
        })
        await userActivity.save();

        //Devolver una respuesta exitosa
        return res.status(200).json({
            status: "success",
            message: 'Empleado eliminado correctamente',
            employee: deletedEmployee
        });

    } catch (error) {
        console.error("Error al eliminar el empleado:", error);
        return res.status(500).json({
            status: "error",
            message: "Error al eliminar el empleado: " + error.message,
        });

    }
}

const listEmployees = async (req, res) => {
    try {

        //Obtener la pagina y el limite de la solicitud
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        //Obtener el rol del usuario autenticado
        const userRole = req.users.role;

        //Obtener el area del usuario autenticado
        const area = req.users.area;

        //Inicializar la consulta
        const query = {};

        //construir la consulta segun el rol del usuario autenticado
        if (userRole === 'role_master' || userRole === 'role_rrhh' || userRole === 'role_budget') {
            // Filtrar por area si se proporciona en la solicitud
            if (req.query.area) {
                query.area = req.query.area;
            }
        } else if (userRole === 'role_analyst') {
            //El usuario analyst solo puede ver los empleos de su area
            query.area = area;
        } else {
            return res.status(403).json({
                status: "error",
                message: 'No tienes permiso para listar empleados'
            });
        }

        //Obtener el listado de empleados con pagination
        const options = {
            page: page,
            limit: limit,
            sort: { _id: -1 },
            collation: {
                locale: "es",
            },
        };
        const employees = await Employee.paginate(query, options);

        //devolver el listado de empleados
        return res.status(200).json({
            status: "success",
            employess: employees.docs,
            page,
            itemsPerPage: limit,
            total: employees.totalDocs,
            pages: employees.totalPages
        });

    } catch (error) {

        console.error("Error al obtener el listado de empleados: ", error);
        return res.status(500).json({
            status: 'error',
            message: 'Error en la petición',
            error: error.message
        });

    }

}

export default {
    pruebaEmployees,
    registerEmployee,
    updateEmployee,
    deleteEmployee,
    listEmployees
}