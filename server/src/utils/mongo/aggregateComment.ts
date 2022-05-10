import { Types } from "mongoose";

import { commentModel } from "@mongo";

import ErrorBuilder from "@utils/errorBuilder";

import { fieldAggregation } from "./aggregations";

interface AggregateComment {
    id?: string;
    slug?: string;
    userId: string;
}

export default async function aggregateComment({ userId, id, slug }: AggregateComment) {
    const comment = await commentModel.aggregate([
        {
            $match: {
                $or: [
                    { _id: new Types.ObjectId(id) },
                    // if searching by slug then return only not null ones
                    { $and: [{ "root.slug": slug }, { "root.slug": { $ne: null } }] },
                ],
            },
        },
        {
            $limit: 1,
        },
        {
            $addFields: fieldAggregation("$", userId),
        },
    ]);

    if (comment.length < 1) {
        throw new ErrorBuilder().msg("Didn't find anything").status(404);
    }

    await commentModel.populate(comment, {
        path: "author",
        model: "User",
        select: ["nickname", "avatar"],
    });

    const replyCount = await commentModel.countDocuments({
        $or: [{ rootId: comment[0].id }, { replyTo: comment[0].id }],
    });

    return { replyCount, ...comment[0] };
}
