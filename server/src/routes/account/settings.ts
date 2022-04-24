import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { accountModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const body = Type.Object(
    {
        country: Type.Optional(Type.String({ maxLength: 4 })),
        currency: Type.Optional(Type.String({ maxLength: 4 })),
    },
    { additionalProperties: false }
);
type Body = Static<typeof body>;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { body, session } = req;

    const account = await accountModel.findOne({ user: session.user?.id || null }).orFail();

    (Object.keys(body) as Array<keyof typeof body>).forEach(key => {
        body[key] && (account.settings[key] = body[key] as any);
    });

    await account.save();
    return account.toJSON();
};

export default (): Resource => ({
    post: {
        handler,
        schema: { body },
        onRequest: authenticate("user"),
    },
});
