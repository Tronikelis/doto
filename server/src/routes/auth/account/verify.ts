import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import jwt from "jsonwebtoken";

import { userModel } from "@mongo";

import ErrorBuilder from "@utils/errorBuilder";

const querystring = Type.Object(
    {
        key: Type.String(),
    },
    { additionalProperties: false }
);
type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { key } = req.query;
    const { id } = jwt.decode(key) as { id: string };

    try {
        jwt.verify(key, process.env.SECRET || "");
    } catch {
        throw new ErrorBuilder().msg("Key not valid").status(403);
    }

    const user = await userModel.findById(id).orFail();
    user.attributes.verified = true;
    await user.save();

    return "Account verified";
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
