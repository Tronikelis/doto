import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { commentModel } from "@mongo";

import ErrorBuilder from "@utils/errorBuilder";

const querystring = Type.Object(
    {
        slug: Type.Optional(Type.String()),
        id: Type.Optional(Type.String()),
    },
    { additionalProperties: false }
);

type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { slug, id } = req.query;
    const userId = req.session.user?.id as string;

    if (!slug && !id) {
        throw new ErrorBuilder().msg("Pass an id/slug").status(404);
    }

    const comment = await commentModel
        .findOne({ $or: [{ _id: id }, { "root.slug": slug }] })
        .orFail()
        .populate({ path: "author", select: ["nickname", "avatar"] })
        .select("-replies");

    return comment.genFormattedVotes(userId).toJSON();
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
