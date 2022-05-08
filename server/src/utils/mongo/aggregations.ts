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

const seconds = 1134028003;
// increase to decrease the importance of a post's recency
const interval = 69000;
// increase to amplify score impact
const sign = 1.75;

// thanks to:
// https://hackernoon.com/from-reddits-hot-ranking-algorithm-to-my-satisfying-blend-or-top-ranked-and-new-by2h35tm
export const ratingAggregation = (name: string) => {
    return {
        $let: {
            vars: {
                score: {
                    $subtract: [`${name}.votes.upvotes`, `${name}.votes.downvotes`],
                },
                seconds: {
                    $subtract: [{ $subtract: [`${name}.date`, new Date(0)] }, seconds],
                },
                order: {
                    $log: [
                        {
                            $max: [
                                {
                                    $abs: {
                                        $subtract: [
                                            `${name}.votes.upvotes`,
                                            `${name}.votes.downvotes`,
                                        ],
                                    },
                                },
                                1,
                            ],
                        },
                        10,
                    ],
                },
            },
            in: {
                $round: [
                    {
                        $add: [
                            {
                                $let: {
                                    vars: {
                                        sign: {
                                            $switch: {
                                                branches: [
                                                    {
                                                        case: { $gte: ["$$score", 0] },
                                                        then: sign,
                                                    },
                                                    {
                                                        case: { $lt: ["$$score", 0] },
                                                        then: -sign,
                                                    },
                                                ],
                                                default: 0,
                                            },
                                        },
                                    },
                                    in: { $multiply: ["$$sign", "$$order"] },
                                },
                            },
                            {
                                $divide: ["$$seconds", interval],
                            },
                        ],
                    },
                    2,
                ],
            },
        },
    };
};
