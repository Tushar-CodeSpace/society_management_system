import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ['admin', 'user', 'superuser'], default: 'user' },
        lastlogin: { type: Date, default: Date.now },
        isActive: { type: Boolean, default: true }
    }, { timestamps: true, versionKey: false }
);

export default mongoose.model('User', userSchema);