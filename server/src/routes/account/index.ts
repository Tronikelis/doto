import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { accountModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const handler: any = async (req: Req) => {
    const account = await accountModel
        .findOne({ user: req.session.user?.id || null })
        .orFail();

    return account.toJSON();
};

export default (): Resource => ({
    get: {
        handler,
        onRequest: authenticate("user"),
    },
});
