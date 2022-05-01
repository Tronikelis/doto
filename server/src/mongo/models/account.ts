import { PopulatedDoc, Schema, model } from "mongoose";

import { Game } from "./game";
import { User } from "./user";

interface Account {
    user: PopulatedDoc<User>;
    settings: {
        currency: string | null;
        country: string | null;
    };
    watching: PopulatedDoc<Game>[];
}

const accountSchema = new Schema<Account>({
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    settings: {
        currency: { type: String, default: null, maxlength: 4 },
        country: { type: String, default: null, maxlength: 4 },
    },
    watching: {
        type: [Schema.Types.ObjectId],
        ref: "Game",
        default: [],
        validate: [
            (value: any[]) => value.length <= 100,
            "You can't watch more than 100 games",
        ],
    },
});

export const accountModel = model("Account", accountSchema);
