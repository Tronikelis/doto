import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { gameModel } from "@mongo";

const querystring = Type.Object(
    {
        page: Type.Integer({ default: 1 }),
        count: Type.Integer({ default: 25, minimum: 1, maximum: 50 }),
    },
    { additionalProperties: false }
);

type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { count, page } = req.query;

    const games = await gameModel
        .find({})
        .sort("-date")
        .skip((page - 1) * count)
        .limit(count);

    const gameCount = await gameModel.countDocuments();

    return {
        next: page * count < gameCount,
        data: games,
    };
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
