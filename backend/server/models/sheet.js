import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const sheetSchema = Schema({
    user: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        required: true
    },
    sheet_number: {
        type: Number
    },
    school: {
        type: String,
        required: true
    },
    movement_type: {
        type: String
    },
    proposed_dedication: {
        type: String
    },
    period: {
        type: String
    },
    category: {
        type: String
    },
    arguments: {
        type: String
    },
    income: {
        type: Number
    },
    income_type: {
        type: String
    },
    income_date: {
        type: Date
    },
    attachments: {
        type: String
    },
    program_code: {
        type: String
    },
    accounting_code: {
        type: String
    },
    effective_date: {
        type: Date
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    history: [
        {
            sheet_number: Number,
            movement_type: String,
            proposed_dedication: String,
            period: String,
            category: String,
            arguments: String,
            income: Number,
            income_type: String,
            income_date: Date,
            attachments: String,
            program_code: String,
            accounting_code: String,
            effective_date: Date,
            updatedBy: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            updatedAt: Date,
            _id: false
        }
    ]

});

sheetSchema.plugin(mongoosePaginate);

// Indice de búsqueda por school
sheetSchema.index({ school: 1 });

export default model('Sheet', sheetSchema, "sheets");