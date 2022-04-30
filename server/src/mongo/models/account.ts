import { PopulatedDoc, Schema, model } from "mongoose";

import { User } from "./user";

interface Account {
    user: PopulatedDoc<User>;
    settings: {
        currency: string | null;
        country: string | null;
    };
}

const accountSchema = new Schema<Account>({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    settings: {
        currency: { type: String, default: null, maxlength: 4 },
        country: { type: String, default: null, maxlength: 4 },
    },
});

export const accountModel = model("Account", accountSchema);
