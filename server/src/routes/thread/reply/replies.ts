import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { commentModel } from "@mongo";

import genDeepCommentPopulation from "@utils/mongo/genDeepCommentPopulation";

const querystring = Type.Object(
    {
        id: Type.String(),
        page: Type.Integer({ minimum: 1, default: 1 }),
        count: Type.Integer({ minimum: 1, maximum: 50, default: 25 }),
    },
    { additionalProperties: false }
);

type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { id, count, page } = req.query;
    const userId = req.session.user?.id as string;

    const { options, populate, select } = genDeepCommentPopulation(count, page);

    const comment = await commentModel
        .findById(id)
        .orFail()
        .populate({
            path: "replies",
            options,
            populate,
        })
        .populate({ path: "author", select });

    const replyCount = await commentModel.countDocuments({
        replyTo: comment.id,
    });

    comment.genFormattedVotes(userId);

    return {
        page,
        count,
        next: page * count < replyCount,
        data: comment.replies,
    };
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
