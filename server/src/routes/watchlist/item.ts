import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { accountModel, gameModel } from "@mongo";

const querystring = Type.Object(
    {
        slug: Type.String(),
    },
    { additionalProperties: false }
);
type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { slug } = req.query;

    const game = await gameModel.findOne({ slug });
    const empty = { totalCount: 0 };

    if (!game) {
        return empty;
    }

    const count = await accountModel
        .aggregate()
        .unwind("$watching")
        .match({ watching: game._id })
        .count("totalCount")
        .allowDiskUse(true);

    return count[0] ? count[0] : empty;
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
