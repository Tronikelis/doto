import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { userModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const handler: any = async (req: Req) => {
    const user = await userModel.findById(req.session.user?.id).select("-password").orFail();
    return user.toJSON();
};

export default (): Resource => ({
    get: {
        handler,
        onRequest: authenticate("user"),
    },
});
