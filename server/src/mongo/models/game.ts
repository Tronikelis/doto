import { Schema, model } from "mongoose";

interface Game {
    currency: string;
    slug: string;
    title: string;
    date: Date;

    // prices in EUR
    price: {
        lowest: {
            provider: string;
            link: string;
            amount: number;
            date: Date;
        };
    };
}

const gameSchema = new Schema<Game>({
    currency: { type: String, default: "EUR" },
    date: { type: Date, default: () => new Date() },
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: {
        lowest: {
            provider: { type: String, required: true },
            link: { type: String, required: true },
            amount: { type: Number, required: true },
            date: { type: Date, default: () => new Date() },
        },
    },
});

export const gameModel = model("Game", gameSchema);
