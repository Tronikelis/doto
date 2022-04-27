import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { commentModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const body = Type.Object(
    {
        replyTo: Type.String(),
        description: Type.String({ minLength: 1, maxLength: 4_000 }),
    },
    { additionalProperties: false }
);

type Body = Static<typeof body>;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { description, replyTo } = req.body;
    const userId = req.session.user?.id as string;

    // just to be sure
    const replyingTo = await commentModel.findById(replyTo).orFail();

    const root = await commentModel.create({
        author: req.session.user?.id,
        description,
        replyTo,
    });

    replyingTo.replies.push(root.id);
    await replyingTo.save();

    await root.populate({ path: "author", select: ["nickname", "avatar"] });

    return root.genFormattedVotes(userId).toJSON();
};

export default (): Resource => ({
    post: {
        handler,
        schema: { body },
        onRequest: authenticate("verified"),
        config: {
            rateLimit: {
                max: 5,
            },
        },
    },
});
