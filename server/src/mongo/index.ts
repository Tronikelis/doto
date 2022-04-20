import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL || "mongodb://127.0.0.1:27017/kuraku";

mongoose.plugin(require("@meanie/mongoose-to-json"));

export const getMongoClient = async () => {
    await mongoose.connect(DATABASE_URL);
    return mongoose.connection.getClient();
};

if (mongoose.connection.readyState === 0) {
    mongoose.connect(DATABASE_URL, error => {
        if (error) throw error;
    });
}

export const toObjectId = (id: string) => {
    return new mongoose.Types.ObjectId(id);
};

export * from "./models/user";
export * from "./models/thread/comment";
export * from "./models/report";
