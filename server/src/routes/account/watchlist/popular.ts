import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { accountModel, gameModel } from "@mongo";

const querystring = Type.Object(
    {
        page: Type.Integer({ minimum: 1, default: 1 }),
        count: Type.Integer({ minimum: 1, maximum: 50, default: 25 }),
    },
    { additionalProperties: false }
);

type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { count, page } = req.query;

    const data = await accountModel
        .aggregate()
        .unwind("$watching")
        .sortByCount("$watching")
        .allowDiskUse(true)
        .skip((page - 1) * count)
        .limit(count);

    await accountModel.populate(data, { path: "_id", model: "Game" });
    const games = await gameModel.countDocuments();

    return {
        next: page * count < games,
        data,
    };
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
