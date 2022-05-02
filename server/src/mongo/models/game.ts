import { Schema, model } from "mongoose";

export interface Game {
    title: string;
    slug: string;
}

const gameSchema = new Schema<Game>({
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
});

export const gameModel = model("Game", gameSchema);
