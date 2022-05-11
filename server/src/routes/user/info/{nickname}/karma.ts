import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { commentModel, userModel } from "@mongo";

const params = Type.Object(
    {
        nickname: Type.String(),
    },
    { additionalProperties: false }
);

type Params = Static<typeof params>;

const handler: any = async (req: Req<{ Params: Params }>) => {
    const { nickname } = req.params;

    const user = await userModel.findOne({ nickname }).orFail();

    const karma = await commentModel.aggregate([
        {
            $match: { author: user._id },
        },
        {
            $project: {
                karma: {
                    $subtract: [{ $size: "$votes.upvotes" }, { $size: "$votes.downvotes" }],
                },
            },
        },
        {
            $group: {
                _id: null,
                karma: { $sum: "$karma" },
            },
        },
    ]);

    if (karma.length < 1) {
        return { karma: 0, _id: null };
    }

    return karma[0];
};

export default (): Resource => ({
    get: {
        handler,
        schema: { params },
    },
});
