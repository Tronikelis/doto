import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import { Types } from "mongoose";

import { commentModel } from "@mongo";

import ErrorBuilder from "@utils/errorBuilder";
import { fieldAggregation } from "@utils/mongo/aggregations";

const querystring = Type.Object(
    {
        slug: Type.Optional(Type.String()),
        id: Type.Optional(Type.String()),
    },
    { additionalProperties: false }
);

type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { slug, id } = req.query;
    const userId = req.session.user?.id as string;

    if (!slug && !id) {
        throw new ErrorBuilder().msg("Pass an id/slug").status(404);
    }

    const comment = await commentModel.aggregate([
        { $match: { $or: [{ _id: new Types.ObjectId(id) }, { "root.slug": slug }] } },
        {
            $addFields: fieldAggregation("$", userId),
        },
    ]);

    if (comment.length < 1) {
        throw new ErrorBuilder().msg("Didn't find anything").status(404);
    }

    await commentModel.populate(comment, {
        path: "author",
        model: "User",
        select: ["nickname", "avatar"],
    });

    const replyCount = await commentModel.countDocuments({
        rootId: comment[0].id,
    });

    return { ...comment[0], replyCount };
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
