import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true
        },
        action: {
            type: String,
            required: true
        },
        details: {
            type: String
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
});

const UserActivity = mongoose.model('Activity', userActivitySchema);

export default UserActivity