import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import { Types } from "mongoose";

import { commentModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

import ErrorBuilder from "@utils/errorBuilder";
import { fieldAggregation } from "@utils/mongo/aggregations";

const body = Type.Object(
    {
        vote: Type.Union([Type.Literal("upvote"), Type.Literal("downvote")]),
        id: Type.String(),
    },
    { additionalProperties: false }
);

type Body = Static<typeof body>;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { vote, id } = req.body;
    const userId = req.session.user?.id as any;

    switch (vote) {
        case "upvote":
            await commentModel
                .findByIdAndUpdate(id, {
                    $addToSet: { "votes.upvotes": userId },
                    $pull: { "votes.downvotes": userId },
                })
                .exec();
            break;
        case "downvote":
            await commentModel
                .findByIdAndUpdate(id, {
                    $addToSet: { "votes.downvotes": userId },
                    $pull: { "votes.upvotes": userId },
                })
                .exec();
            break;
    }

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
    put: {
        handler,
        schema: { body },
        onRequest: authenticate("user"),
    },
});
