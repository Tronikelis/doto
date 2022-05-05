import { FastifyRequest } from "fastify";
import { Resource } from "fastify-autoroutes";

import { notificationModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const handler: any = async (req: FastifyRequest) => {
    const userId = req.session.user?.id || null;

    await notificationModel.updateMany(
        {
            receiver: userId,
        },
        {
            $set: {
                read: true,
            },
        }
    );

    return "OK";
};

export default (): Resource => ({
    post: {
        handler,
        onRequest: authenticate("user"),
    },
});
