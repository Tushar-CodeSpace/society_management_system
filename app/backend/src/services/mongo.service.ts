import mongoose from "mongoose";

export async function connectMongo(): Promise<void> {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI missing");
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { autoIndex: true });
    // eslint-disable-next-line no-console
    console.log("Mongo connected");
}
