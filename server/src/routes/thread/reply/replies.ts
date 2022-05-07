import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import { Types } from "mongoose";

import { commentModel } from "@mongo";

import ErrorBuilder from "@utils/errorBuilder";

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

    // const { options, populate, select } = genDeepCommentPopulation(count, page);

    // const comment = await commentModel
    //     .findById(id)
    //     .orFail()
    //     .populate({
    //         path: "replies",
    //         options,
    //         populate,
    //     })
    //     .populate({ path: "author", select });

    // const replyCount = await commentModel.countDocuments({
    //     replyTo: comment.id,
    // });

    // comment.genFormattedVotes(userId);

    // return {
    //     page,
    //     count,
    //     next: page * count < replyCount,
    //     data: comment.replies,
    // };

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
            {
                $addFields: {
                    deepReplies: {
                        $map: {
                            input: "$deepReplies",
                            as: "reply",
                            in: {
                                $mergeObjects: [
                                    "$$reply",
                                    {
                                        votes: {
                                            upvotes: { $size: "$$reply.votes.upvotes" },
                                            downvotes: { $size: "$$reply.votes.downvotes" },
                                            voted: {
                                                $switch: {
                                                    branches: [
                                                        {
                                                            case: {
                                                                $in: [
                                                                    { $toObjectId: userId },
                                                                    "$$reply.votes.upvotes",
                                                                ],
                                                            },
                                                            then: "upvote",
                                                        },
                                                        {
                                                            case: {
                                                                $in: [
                                                                    { $toObjectId: userId },
                                                                    "$$reply.votes.downvotes",
                                                                ],
                                                            },
                                                            then: "downvote",
                                                        },
                                                    ],
                                                    default: null,
                                                },
                                            },
                                        },
                                        replies: { $gt: [{ $size: "$$reply.replies" }, 0] },
                                    },
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
            {
                $unwind: "$deepReplies",
            },
            {
                $addFields: {
                    "deepReplies.id": "$deepReplies._id",
                },
            },
            {
                $sort: {
                    "deepReplies.date": -1,
                },
            },
            {
                $group: {
                    _id: "$deepReplies.depth",
                    count: { $sum: 1 },
                    data: { $push: "$$ROOT" },
                },
            },
            {
                $sort: {
                    _id: 1,
                },
            },
            {
                $addFields: {
                    data: {
                        $slice: ["$data", (page - 1) * count, count],
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
    // and populates the replies with the reducedComments that replyTo === own _id
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
        next: count < total,
        data: root.replies,
    };
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
