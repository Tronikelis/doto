import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { accountModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const body = Type.Object(
    {
        country: Type.Optional(Type.String({ maxLength: 4 })),
        currency: Type.Optional(Type.String({ maxLength: 4 })),
        filter: Type.Optional(Type.String({ pattern: /^(all|pc)$/g.source })),
    },
    { additionalProperties: false }
);
type Body = Static<typeof body>;

const POST_handler: any = async (req: Req<{ Body: Body }>) => {
    const { body, session } = req;

    const account = await accountModel.findOne({ user: session.user?.id || null }).orFail();

    (Object.keys(body) as Array<keyof typeof body>).forEach(key => {
        body[key] && (account.settings[key] = body[key] as any);
    });

    await account.save();
    return account.toJSON();
};

const DEL_handler = async (req: Req) => {
    const account = await accountModel
        .findOne({ user: req.session.user?.id || null })
        .orFail();

    (Object.keys(account.settings) as Array<keyof typeof account["settings"]>).forEach(key => {
        account.settings[key] = null;
    });

    await account.save();
    return account.toJSON();
};

export default (): Resource => ({
    delete: {
        handler: DEL_handler,
        onRequest: authenticate("user"),
    },
    post: {
        handler: POST_handler,
        schema: { body },
        onRequest: authenticate("user"),
    },
});
