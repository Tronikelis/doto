import { ObjectId, PopulatedDoc, Schema, model } from "mongoose";

import { User } from "@mongo";

interface Report {
    by: PopulatedDoc<User>;
    summary: string;
    type: "user" | "comment" | "thread";
    typeId: ObjectId;
    reportCount: number;
    date: Date;
}

const reportSchema = new Schema<Report>({
    by: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    type: { type: String, required: true },
    typeId: { type: Schema.Types.ObjectId, required: true },
    summary: { type: String, required: true },
    date: { type: Date, default: () => new Date() },
    reportCount: { type: Number, required: true, default: 1 },
});

export const reportModel = model("Report", reportSchema);
