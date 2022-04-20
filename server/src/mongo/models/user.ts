import { Schema, model } from "mongoose";

import { commentModel } from "@mongo";

interface UserAttributes {
    verified: boolean;
    admin: boolean;
}

export interface User {
    nickname: string;
    password: string;
    email: string;
    createdAt: Date;
    avatar: string;
    ip: string;
    attributes: UserAttributes;

    ban: () => Promise<void>;
}

const userSchema = new Schema<User>({
    avatar: { type: String, required: true },
    nickname: { type: String, required: true, minlength: 4, maxlength: 20, unique: true },
    password: { type: String, required: true, minlength: 6, maxlength: 400 },
    email: { type: String, required: true, minlength: 4, maxlength: 100, unique: true },
    createdAt: { type: Date, required: true, default: () => new Date() },
    attributes: {
        verified: { type: Boolean, required: true, default: false },
        admin: { type: Boolean, required: true, default: false },
    },
    // hashed ip for bans
    ip: { type: String, required: true },
});

userSchema.method("ban", async function () {
    const commentBan = commentModel.updateMany(
        { author: this.id, root: null },
        {
            $set: {
                description: "[deleted]",
            },
        }
    );

    const rootBan = commentModel.updateMany(
        { author: this.id, root: { $ne: null } },
        {
            $set: {
                description: "[deleted]",
                "root.title": "[deleted]",
            },
        }
    );

    const deleteUser = this.remove();

    // add to ip blacklist

    await Promise.all([commentBan, deleteUser, rootBan]);
});

export const userModel = model("User", userSchema);
