import { PopulatedDoc, Schema, model } from "mongoose";

import { User } from "./user";

interface Notification {
    sender?: PopulatedDoc<User>;
    receiver: PopulatedDoc<User>;
    read: {
        date?: Date;
        value: boolean;
    };
    type: "reply" | "news";
    title: string;
    summary?: string;
    href?: string;
}

const notificationSchema = new Schema<Notification>({
    sender: { type: Schema.Types.ObjectId, default: null },
    receiver: { type: Schema.Types.ObjectId, required: true },
    read: {
        date: { type: Date, default: null },
        value: { type: Boolean, default: false },
    },
    type: { type: String, enum: ["reply", "news"], required: true },
    title: { type: String, required: true },
    summary: { type: String, default: null },
    href: { type: String, default: null },
});

export const notificationModel = model("Notification", notificationSchema);
