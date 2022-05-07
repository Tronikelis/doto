export const fieldAggregation = (name: string, userId: string) => {
    return {
        votes: {
            upvotes: { $size: `${name}votes.upvotes` },
            downvotes: { $size: `${name}votes.downvotes` },
            voted: {
                $switch: {
                    branches: [
                        {
                            case: {
                                $in: [{ $toObjectId: userId }, `${name}votes.upvotes`],
                            },
                            then: "upvote",
                        },
                        {
                            case: {
                                $in: [{ $toObjectId: userId }, `${name}votes.downvotes`],
                            },
                            then: "downvote",
                        },
                    ],
                    default: null,
                },
            },
        },
        id: `${name}_id`,
        hasReplies: { $gt: [{ $size: `${name}replies` }, 0] },
        replies: [],
    };
};
