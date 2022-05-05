import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { commentModel } from "@mongo";

const querystring = Type.Object(
    {
        page: Type.Integer({ minimum: 1, default: 1 }),
        count: Type.Integer({ minimum: 1, maximum: 10, default: 3 }),
        variant: Type.Union([Type.Literal("home"), Type.Literal("explore")], {
            default: "explore",
        }),
    },
    { additionalProperties: false }
);

type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { count, page, variant } = req.query;

    const data = await commentModel
        .find({ "root.variant": variant })
        .skip((page - 1) * count)
        .limit(count)
        .sort("-date")
        // everything else is irrelevant
        .select(["root", "description", "date", "author"])
        .populate("author", ["nickname", "avatar"]);

    const amount = await commentModel.countDocuments({
        "root.variant": variant,
    });

    return {
        count,
        page,
        next: page * count < amount,
        data,
    };
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
