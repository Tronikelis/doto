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
                                $in: [
                                    {
                                        $convert: {
                                            input: userId,
                                            to: "objectId",
                                            onError: null,
                                        },
                                    },
                                    `${name}votes.upvotes`,
                                ],
                            },
                            then: "upvote",
                        },
                        {
                            case: {
                                $in: [
                                    {
                                        $convert: {
                                            input: userId,
                                            to: "objectId",
                                            onError: null,
                                        },
                                    },
                                    `${name}votes.downvotes`,
                                ],
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

const gravity = 1.8;

// hacker news algorithm
export const ratingAggregation = (name: string) => {
    return {
        $let: {
            vars: {
                points: {
                    $add: [
                        { $subtract: [`${name}votes.upvotes`, `${name}votes.downvotes`] },
                        1,
                    ],
                },
                hours: {
                    $divide: [
                        {
                            $dateDiff: {
                                endDate: new Date(),
                                startDate: `${name}date`,
                                unit: "second",
                            },
                        },
                        60 * 60,
                    ],
                },
            },
            in: {
                $divide: ["$$points", { $pow: [{ $add: ["$$hours", 2] }, gravity] }],
            },
        },
    };
};
