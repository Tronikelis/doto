import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import { Types } from "mongoose";

import { commentModel, userModel } from "@mongo";

import ErrorBuilder from "@utils/errorBuilder";
import { fieldAggregation } from "@utils/mongo/aggregations";

const querystring = Type.Object(
    {
        id: Type.String(),
    },
    { additionalProperties: false }
);

type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { id } = req.query;
    const userId = req.session.user?.id as string;

    const [user, reply] = await Promise.all([
        userModel.findById(userId).orFail(),
        commentModel.findById(id).select("-replies").orFail(),
    ]);

    if (user.attributes.admin) {
        await reply.ban();
        return reply.toJSON();
    }

    if (user.id !== reply.author?.toString()) {
        throw new ErrorBuilder().msg("This thread does not belong to you").status(400);
    }

    await reply.ban();

    const comment = await commentModel.aggregate([
        { $match: { _id: new Types.ObjectId(id) } },
        { $addFields: fieldAggregation("$", userId) },
    ]);

    if (comment.length < 1) {
        throw new ErrorBuilder().msg("Didn't find anything").status(404);
    }

    await commentModel.populate(comment, {
        path: "author",
        model: "User",
        select: ["nickname", "avatar"],
    });

    return comment[0];
};

export default (): Resource => ({
    delete: {
        handler,
        schema: { querystring },
    },
});
