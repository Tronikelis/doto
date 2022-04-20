import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { commentModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const body = Type.Object(
    {
        vote: Type.String({ pattern: /^(upvote|downvote)$/g.source }),
        id: Type.String(),
    },
    { additionalProperties: false }
);

type Body = Static<typeof body>;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { vote, id } = req.body;
    const userId = req.session.user?.id as any;

    const thread = await commentModel
        .findById(id)
        .orFail()
        .populate({ path: "author", select: ["nickname", "avatar"] });

    // remove the downvote if it exists
    thread.votes.downvotes = thread.votes.downvotes.filter(id => id?.toString() !== userId);

    // remove the vote if it already has been upvoted
    thread.votes.upvotes = thread.votes.upvotes.filter(id => id?.toString() !== userId);

    switch (vote) {
        case "upvote": {
            thread.votes.upvotes.push(userId);
            await thread.save();
            break;
        }
        case "downvote": {
            thread.votes.downvotes.push(userId);
            await thread.save();
            break;
        }
    }

    return (thread.genFormattedVotes(userId) as any).formattedVotes;
};

export default (): Resource => ({
    put: {
        handler,
        schema: { body },
        onRequest: authenticate(),
    },
});
