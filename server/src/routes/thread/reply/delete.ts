import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { commentModel, userModel } from "@mongo";

import ErrorBuilder from "@utils/errorBuilder";

const querystring = Type.Object(
    {
        id: Type.String(),
    },
    { additionalProperties: false }
);

type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { id } = req.query;
    const userId = req.session.user?.id as string;

    const user = await userModel.findById(userId).orFail();
    const comment = await commentModel.findById(id).orFail().select("-replies");

    if (user.attributes.admin) {
        await comment.ban();
        return comment.toJSON();
    }

    if (user.id !== comment.author?.toString()) {
        throw new ErrorBuilder().msg("This thread does not belong to you").status(400);
    }

    await comment.ban();
    return comment.genFormattedVotes(userId).toJSON();
};

export default (): Resource => ({
    delete: {
        handler,
        schema: { querystring },
    },
});
