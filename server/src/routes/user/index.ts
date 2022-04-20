import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { userModel } from "@mongo";

const handler: any = async (req: Req) => {
    if (!req.session.user) return {};
    const user = await userModel.findById(req.session.user.id).orFail().select("-password");
    return user.toJSON();
};

export default (): Resource => ({
    get: {
        handler,
    },
});
