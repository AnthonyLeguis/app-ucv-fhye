import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new mongoose.Schema({
    names: {
        type: String,
        required: true
    },
    surnames: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'role_user',
        required: true
    },
    ci_tipo: {
        type: String,
        required: true,
        enum: ['V', 'E'],
    },
    ci: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    idac: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: "default.png"
    },
    delete_url: { 
        type: String
    },
    address: String,
    phone: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    school: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    professorship: {
        type: String,
        required: true,
    },
    current_dedication: {
        type: String,
        required: true,
    },
    executing_unit: {
        type: Number,
        required: true,
    },
    hire_date: {
        type: Date,
        required: true,
    }
});

// Indice de búsqueda por school
userSchema.index({ school: 1 });
// Indice de búsqueda por ci
userSchema.index({ ci: 1 });
//indice de busqueda por idac
userSchema.index({ idac: 1 });

userSchema.plugin(mongoosePaginate);

export default mongoose.model('User', userSchema);