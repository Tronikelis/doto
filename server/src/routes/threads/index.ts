import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { commentModel } from "@mongo";

import { fieldAggregation, ratingAggregation } from "@utils/mongo/aggregations";

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
    const userId = req.session.user?.id || "";

    const data = await commentModel.aggregate([
        { $match: { "root.variant": variant } },
        { $addFields: fieldAggregation("$", userId) },
        {
            $addFields: {
                rating: ratingAggregation("$"),
            },
        },
        {
            $sort: {
                rating: -1,
            },
        },
        { $skip: (page - 1) * count },
        { $limit: count },
    ]);

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
