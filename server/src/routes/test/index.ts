import { Resource } from "fastify-autoroutes";

import { commentModel } from "@mongo";

const handler: any = async () => {
    const userId = "626e7569b48beadf4e36f22b";

    const comments = await commentModel
        .aggregate([
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
                    maxDepth: 8,
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
                                        replies: null,
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
        ])
        .allowDiskUse(true);

    await commentModel.populate(comments[0].deepReplies, {
        model: "User",
        path: "author",
        select: ["nickname", "avatar"],
    });

    return comments;
};

export default (): Resource => ({
    get: {
        handler,
    },
});
