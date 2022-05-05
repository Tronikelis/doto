import { PopulatedDoc, Schema, model } from "mongoose";

import { User } from "./user";

interface Notification {
    sender?: PopulatedDoc<User>;
    receiver: PopulatedDoc<User>;
    read: boolean;
    type: "reply" | "news";
    title: string;
    summary?: string;
    href?: string;
    date: Date;
}

const notificationSchema = new Schema<Notification>({
    sender: { type: Schema.Types.ObjectId, default: null, ref: "User" },
    receiver: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    read: { type: Boolean, default: false },
    type: { type: String, enum: ["reply", "news"], required: true },
    title: { type: String, required: true },
    summary: { type: String, default: null },
    href: { type: String, default: null },
    date: { type: Date, default: () => new Date() },
});

export const notificationModel = model("Notification", notificationSchema);
