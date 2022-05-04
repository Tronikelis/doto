import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { commentModel, notificationModel, userModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const body = Type.Object(
    {
        replyTo: Type.String(),
        slug: Type.String(),
        description: Type.String({ minLength: 1, maxLength: 4_000 }),
    },
    { additionalProperties: false }
);

type Body = Static<typeof body>;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { description, replyTo, slug } = req.body;

    const userId = req.session.user?.id as string;

    const [user, replyingTo, root] = await Promise.all([
        userModel.findById(req.session.user?.id || null).orFail(),
        commentModel.findById(replyTo).orFail(),
        commentModel.findOne({ "root.slug": slug }).orFail(),
    ]);

    const reply = await commentModel.create({
        rootId: root.id,
        author: req.session.user?.id,
        description,
        replyTo,
    });

    replyingTo.replies.push(reply.id);
    await replyingTo.save();

    // push a notification to the receiver
    if (replyingTo.author?.toString() !== userId) {
        notificationModel.create({
            href: root?.root?.slug,
            receiver: replyingTo.author,
            sender: userId,
            type: "reply",
            title: `${user.nickname} replied to your comment`,
        });
    }

    await reply.populate({ path: "author", select: ["nickname", "avatar"] });
    return reply.genFormattedVotes(userId).toJSON();
};

export default (): Resource => ({
    post: {
        handler,
        schema: { body },
        onRequest: authenticate("verified"),
        config: {
            rateLimit: {
                max: 10,
            },
        },
    },
});
