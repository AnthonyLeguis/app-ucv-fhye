import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const employeeSchema = new mongoose.Schema({
    area: { 
        type: String, 
        required: true
    },
    names: {
        type: String,
        required: true
    },
    surnames: {
        type: String,
        required: true
    },
    idType: { 
        type: String, 
        enum: ['V', 'E'],
        required: true
    },
    nationalId: { 
        type: String, 
        required: true, 
        unique: true 
    },
    rif: { 
        type: String, 
        required: true, 
        unique: true 
    },
    birthdate: { 
        type: Date, 
        required: true
    },
    countryOfBirth: {
        type: String

    },
    cityOfBirth: {
        type: String

    },
    maritalStatus: {
        type: String, 
        required: true

    },
    gender: {
        type: String, 
        required: true

    },
    familyDependents: {
        type: Number, 
        required: true

    },
    educationLevel: {
        type: String, 
        required: true

    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String, 
        required: true

    },
    address: {
        type: String, 
        required: true

    },
    bank: {
        type: String, 
        required: true

    },
    payrollAccount: {
        type: String, 
        required: true

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: Object,
        required: true
    }
});

employeeSchema.index({ nationalId: 1 }); 

employeeSchema.plugin(mongoosePaginate);

export default mongoose.model('Employee', employeeSchema);