import { Schema, model } from "mongoose";

import { accountModel, commentModel, notificationModel } from "@mongo";

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
    attributes: UserAttributes;

    ban: () => Promise<void>;
}

const userSchema = new Schema<User>(
    {
        avatar: { type: String, required: true },
        nickname: { type: String, required: true, minlength: 4, maxlength: 20, unique: true },
        password: { type: String, required: true, minlength: 6, maxlength: 400 },
        email: { type: String, required: true, minlength: 4, maxlength: 100, unique: true },
        createdAt: { type: Date, required: true, default: () => new Date() },
        attributes: {
            verified: { type: Boolean, required: true, default: false },
            admin: { type: Boolean, required: true, default: false },
        },
    },
    { toJSON: { virtuals: true } }
);

userSchema.virtual("owner").get(function () {
    return true;
});

userSchema.method("ban", async function () {
    const commentBan = commentModel
        .updateMany(
            { author: this.id, root: null },
            {
                $set: {
                    description: null,
                },
            }
        )
        .exec();

    const rootBan = commentModel
        .updateMany(
            { author: this.id, root: { $ne: null } },
            {
                $set: {
                    description: null,
                    "root.title": null,
                    "root.image": null,
                },
            }
        )
        .exec();

    // cleanup
    const deleteAccount = accountModel.deleteOne({ user: this.id }).exec();
    const deleteUser = this.delete();
    const deleteNotifications = notificationModel.deleteMany({ receiver: this.id }).exec();

    await Promise.all([commentBan, deleteUser, rootBan, deleteAccount, deleteNotifications]);
});

export const userModel = model("User", userSchema);
