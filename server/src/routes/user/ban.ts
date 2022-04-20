import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { userModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const body = Type.Object(
    {
        id: Type.String(),
    },
    { additionalProperties: false }
);

type Body = Static<typeof body>;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { id } = req.body;

    const user = await userModel.findById(id).orFail();
    await user.ban();

    return "OK";
};

export default (): Resource => ({
    post: {
        handler,
        onRequest: authenticate("admin"),
    },
});
