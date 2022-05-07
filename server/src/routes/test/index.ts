import { Resource } from "fastify-autoroutes";

import { commentModel } from "@mongo";

import { Datum, DeepReplies, MongoAggregationComments } from "../thread/reply/.types";

const handler: any = async () => {
    const userId = "626e7569b48beadf4e36f22b";
    const count = 25;
    const page = 10;

    const comments = await commentModel
        .aggregate<MongoAggregationComments>([
            // get the correct comment/thread
            { $match: { description: "1212" } },

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
                                        },
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
                                        replies: [],
                                        hasReplies: { $gt: [{ $size: "$$reply.replies" }, 0] },
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

    console.log({ comments });

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
    },
});
