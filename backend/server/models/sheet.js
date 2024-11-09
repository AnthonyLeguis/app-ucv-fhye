import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const sheetSchema = new Schema({
  // Información general de la planilla
  sheetNumber: { type: Number, required: true, unique: true }, // Número único de la planilla
  area: { type: String, required: true, index: true }, // Área a la que pertenece la planilla (con índice)
  status: { 
    created: { type: Boolean, default: true }, 
    pending: { type: Boolean, default: true }, 
    approvedRRHH: { type: Boolean, default: false }, 
    approvedBudget: { type: Boolean, default: false }, 
    rejectedRRHH: { type: Boolean, default: false }, 
    rejectedBudget: { type: Boolean, default: false }
  },
  printPermission: { type: Boolean, default: false, index: true }, // Indica si la planilla se puede imprimir (con índice)
  idac: { type: Number, required: true, unique: true, index: true }, // Número único de identificación del cargo (con índice)

  // Sección Datos del Empleado
  employeeId: {
    type: Object,
    ref: 'Employee',
    required: true
  },

  // Sección General
  movementType: {
    type: String,
    required: true
  },
  ubication: {
    type: String,
    required: true
  },
  introducedDate: {
    type: Date
  },
  sentDate: {
    type: Date
  },
  receivedByBudgetDate: {
    type: Date
  },
  acceptedByBudgetDate: {
    type: Date
  },
  receivedByHRDate: {
    type: Date
  },
  acceptedByHRDate: {
    type: Date
  },
  receivedByPayrollDate: {
    type: Date
  },
  acceptedByPayrollDate: {
    type: Date
  },
  observations_general: {
    type: String
  },


  // Sección Datos del Cargo o Puesto de Trabajo
  facultyOrDependency: {
    type: String
  },
  entryDate: {
    type: Date
  },
  effectiveDate: {
    type: Date
  },
  contractEndDate: {
    type: Date
  },
  executingUnit: {
    type: Number
  },
  dedication: {
    type: String
  },
  teachingCategory: {
    type: String
  },
  position: {
    type: String
  },
  currentPosition: {
    type: String
  },
  grade: {
    type: String
  },
  opsuTable: {
    type: String
  },
  personnelType: {
    type: String
  },
  workingDay: {
    type: String
  },
  typeContract: {
    type: String
  },
  valueSalary: {
    type: Number
  },
  mounthlySalary: {
    type: Number
  },
  ReasonForMovement: {
    type: String
  },
  recognitionDate: {
    type: Date
  },

  // Historial de modificaciones
  modificaciones: [
    {
      campo: String,
      valorAnterior: Schema.Types.Mixed,
      valorNuevo: Schema.Types.Mixed,
      fechaModificacion: { type: Date, default: Date.now },
      usuarioModificacion: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  ],

  // Usuarios que han intervenido en la planilla
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Usuario que creó la planilla
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Usuario que aprobó la planilla (opcional)
  rejectedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Usuario que rechazó la planilla (opcional)

  //Motivos en caso de rechazo
  rejectedReasonInBudget: {
    type: String
  },
  rejectedReasonInRRHH: {
    type: String
  },


  // Sección Datos de Remuneraciones adicionales al salario básico del empleado
  salaryCompensationDiff: {
    type: Number
  },
  representationExpenses: {
    type: Number
  },
  typePrimaA: {
    type: String,
  },
  amountPrimaA: {
    type: Number
  },
  typePrimaB: {
    type: String,
    amount: Number
  },
  amountPrimaB: {
    type: Number
  },
  primaRangoV: {
    type: Number
  },
  otherCompensation: {
    type: Number
  },

  // Sección Datos presupuestarios del cargo o puesto
  budgetCode: {
    type: String
  },
  accountingCode: {
    type: Number
  },
  executingUnit: {
    type: Number
  },
  personnelType: {
    type: String
  },

  // Sección Observaciones
  observations: {
    type: String
  },

  // Sección Historial de Actividades
  history: [
    {
      modifiedField: String,  // Campo modificado
      oldValue: Schema.Types.Mixed,  // Valor anterior
      newValue: Schema.Types.Mixed,  // Nuevo valor
      updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Usuario que modificó
      updatedAt: { type: Date, default: Date.now } // Fecha y hora de la modificación
    }
  ],

  // Historial de cambios de estado
  statusHistory: [
    { status: { 
      created: { type: Boolean, default: false }, 
      pending: { type: Boolean, default: false }, 
      approvedRRHH: { type: Boolean, default: false }, 
      approvedBudget: { type: Boolean, default: false }, 
      rejectedRRHH: { type: Boolean, default: false }, 
      rejectedBudget: { type: Boolean, default: false }, 
    }, 
      timestamp: { type: Date, default: Date.now }, 
      user: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  ],
  area: {
    type: String,
    required: true
  },
  printPermission: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  modificatedDate: {
    type: Date,
    default: Date.now
  }
});

sheetSchema.plugin(mongoosePaginate);

// Indice de búsqueda por (area)
sheetSchema.index({ area: 1 });
sheetSchema.index({ status: 1 });
sheetSchema.index({ idac: 1 });
sheetSchema.index({ printPermission: 1 });

export default model('Sheet', sheetSchema, "sheets");