import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const sheetSchema = new Schema({
  // Para la logica de la planilla segun el usuario autenticado
  // Permitira mostrar los listados de planillas segun su status a los distintos empleados,
  //quienes podran realizar acciones en ellas si cumplen los estatus
  area: { // El área es la que une la logica entre los usuarios, empleados y planillas
    type: String,
    required: true,
    index: true
  },
  // Saber cual es la planilla actual
  isCurrent: {
    type: Boolean,
    default: true,
    index: true
  },
  // Saber cuales son las planillas pendientes para el usuario autenticado
  status: {
    created: { type: Boolean, default: true, index: true }, // Índice individual para created
    pending: { type: Boolean, default: true, index: true }, // Índice individual para pending
    approvedRRHH: { type: Boolean, default: false, index: true }, // Índice individual para approvedRRHH
    approvedBudget: { type: Boolean, default: false, index: true }, // Índice individual para approvedBudget
    rejectedRRHH: { type: Boolean, default: false, index: true }, // Índice individual para rejectedRRHH
    rejectedBudget: { type: Boolean, default: false, index: true }, // Índice individual para rejectedBudget
    printPermission: { type: Boolean, default: false, index: true }, // Índice individual para printPermission
  },
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

  // Sección de información general de la planilla
  movementType: {
    type: String,
    required: true
  },
  sheetNumber: {
    type: Number,
    required: true,
    unique: true
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


  // Sección A de la información del empleado
  employeeId: {
    type: Object,
    ref: 'Employee',
    required: true
  },

  // Sección B
  TypeOfPayroll: {
    type: String,
    required: true
  },
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

  // Sección C Modificaciones (Verificar si cambia algun valor de la seccion A y B para registrarlo en la seccion C)
  recognitionDate: {
    type: Date
  },
  modificaciones: [
    {
      campo: String,
      valorAnterior: Schema.Types.Mixed,
      valorNuevo: Schema.Types.Mixed,
      fechaModificacion: { type: Date, default: Date.now },
      usuarioModificacion: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  ],

  // Sección D 
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

  // Sección E
  budgetCode: {
    type: String
  },
  accountingCode: {
    type: Number
  },
  executingUnit_E: {
    type: Number
  },
  personnelType_E: {
    type: String
  },

  idac: { //(Idac es un número único por planilla y tambien se usa para el indice de búsqueda)
    type: Number,
    required: true,
    unique: true,
    index: true
  },


  // Sección Observaciones
  observations: {
    type: String
  },

  //Historial de Actividades
  history: [
    {
      modifiedField: String,  // Campo modificado
      oldValue: Schema.Types.Mixed,  // Valor anterior
      newValue: Schema.Types.Mixed,  // Nuevo valor
      updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Usuario que modificó
      updatedAt: { type: Date, default: Date.now } // Fecha y hora de la modificación
    }
  ],

  // Seccion de Historiales
  statusHistory: [
    {
      status: {
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
sheetSchema.index({ 'status.created': 1, 'status.pending': 1, 'status.approvedRRHH': 1, 'status.approvedBudget': 1, 'status.rejectedRRHH': 1, 'status.rejectedBudget': 1, 'status.printPermission': 1 });
sheetSchema.index({ idac: 1 });
sheetSchema.index({ isCurrent: 1 });

export default model('Sheet', sheetSchema, "sheets");