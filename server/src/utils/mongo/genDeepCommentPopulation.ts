// deep populate hell, very nice
// populate level 3
// comments <= replies <= replies <= replies
const genDeepCommentPopulation = (count: number, page: number) => {
    const select = ["nickname", "avatar"];

    const options = {
        sort: "-date",
        skip: count * (page - 1),
        limit: count,
    };

    const populate = [
        {
            options,
            path: "replies",
            populate: [
                {
                    path: "replies",
                    populate: [
                        {
                            path: "author",
                            select,
                        },
                        {
                            path: "replies",
                            populate: [
                                {
                                    path: "author",
                                    select,
                                },
                            ],
                            options: {
                                ...options,
                                skip: undefined,
                            },
                        },
                    ],
                    options: {
                        ...options,
                        skip: undefined,
                    },
                },
                {
                    path: "author",
                    select,
                },
            ],
        },
        {
            path: "author",
            select,
        },
    ];

    return {
        options,
        select,
        populate,
    };
};

export default genDeepCommentPopulation;
