import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import { Types } from "mongoose";

import { commentModel } from "@mongo";

import ErrorBuilder from "@utils/errorBuilder";
import { fieldAggregation } from "@utils/mongo/aggregations";

import { Datum, DeepReplies, MongoAggregationComments } from "./.types";

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

    const comments = await commentModel
        .aggregate<MongoAggregationComments>([
            // get the correct comment/thread
            { $match: { _id: new Types.ObjectId(id) } },

            // get recursively all its replies
            {
                $graphLookup: {
                    from: "comments",
                    startWith: "$_id",
                    connectFromField: "replies",
                    connectToField: "_id",
                    as: "deepReplies",
                    depthField: "depth",
                    maxDepth: 10,
                },
            },

            // format votes
            // turns votes into array lengths
            // checks if the userId has already voted
            {
                $addFields: {
                    deepReplies: {
                        $map: {
                            input: "$deepReplies",
                            as: "reply",
                            in: {
                                $mergeObjects: [
                                    "$$reply",
                                    fieldAggregation("$$reply.", userId),
                                ],
                            },
                        },
                    },
                },
            },

            // select only needed results
            {
                $project: {
                    deepReplies: 1,
                },
            },

            // turns one doc with a huge array of replies into separate docs containing deepReply
            {
                $unwind: "$deepReplies",
            },

            // change this to custom ranking sort later
            {
                $sort: {
                    "deepReplies.date": -1,
                },
            },

            // group all replies into depths (we need pagination on the first depth)
            {
                $group: {
                    _id: "$deepReplies.depth",
                    count: { $sum: 1 },
                    data: { $push: "$$ROOT" },
                },
            },

            // just for debugging clarity
            {
                $sort: {
                    _id: 1,
                },
            },

            // pagination is done here
            // paginate only the first/root replies
            // leave the rest at slice(0, count)
            {
                $addFields: {
                    data: {
                        $cond: {
                            if: { $eq: ["$_id", 1] },
                            then: {
                                $slice: ["$data", (page - 1) * count, count * page],
                            },
                            else: {
                                $slice: ["$data", 0, count],
                            },
                        },
                    },
                },
            },
        ])
        .allowDiskUse(true);

    if (comments.length < 1) {
        throw new ErrorBuilder().msg("Comment does not exist (probably)").status(400);
    }

    await commentModel.populate(comments, {
        model: "User",
        path: "data.deepReplies.author",
        select: ["nickname", "avatar"],
    });

    const root = { ...comments[0].data[0].deepReplies };
    const reducedComments = comments.reduce(
        (prev: any, cur) => [...prev, ...cur.data],
        []
    ) as Datum[];

    // generate a tree structure -> reducedComments <=> replyTo
    // basically recursively traverses every comments reply
    // and populates the replies with the reducedComments that replyTo === own id
    const generate = (reply: DeepReplies) => {
        const id = reply.id.toString();

        const replies = reducedComments
            .filter(({ deepReplies }) => deepReplies.replyTo?.toString() === id)
            .reduce((prev: any, curr) => [...prev, curr.deepReplies], []) as DeepReplies[];

        if (replies.length < 1) return;

        reply.replies = replies as any;
        replies.forEach(reply => generate(reply));
    };
    generate(root);

    // calculate next based on root replies (depth 1)
    const total = comments.find(({ _id }) => _id === 1)?.count || 0;

    return {
        count,
        page,
        next: count * page < total,
        data: root.replies,
    };
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
