import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const userSchema = new mongoose.Schema({
    names: {
        type: String,
        required: true,
    },
    surnames: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
    },
    tokenValidation: {
        type: String    
    },
    nationalId: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: "https://i.ibb.co/SDSSdq7/user-avatar.png"
    },
    phone: { 
        type: String,
        required: true
    },
    area: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['role_master', 'role_analyst', 'role_budget', 'role_rrhh'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    created_at: {
        type: Date,
        default: Date.now
    },
});

// Indice de búsqueda por nationalId
userSchema.index({ nationalId: 1 });
// Indice de búsqueda por email
userSchema.index({ email: 1 });
// Indice de búsqueda por area
userSchema.index({ area: 1 });
// Indice de búsqueda por role
userSchema.index({ role: 1 });

userSchema.plugin(mongoosePaginate);

export default mongoose.model('User', userSchema);