import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import ErrorBuilder from "@utils/errorBuilder";
import aggregateComment from "@utils/mongo/aggregateComment";

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

    return aggregateComment({ userId, id, slug });
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
