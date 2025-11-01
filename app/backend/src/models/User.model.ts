import mongoose, { type InferSchemaType } from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            index: true,
            lowercase: true,
            trim: true
        },
        passwordHash: { type: String, required: true },
        refreshTokenHash: { type: String }
    },
    { timestamps: true, versionKey: false }
);

export type UserDoc = InferSchemaType<typeof UserSchema>;
export default mongoose.model<UserDoc>("User", UserSchema);
