import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { notificationModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

import ErrorBuilder from "@utils/errorBuilder";

const body = Type.Object(
    {
        id: Type.String(),
    },
    { additionalProperties: false }
);

type Body = Static<typeof body>;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { id } = req.body;

    const notification = await notificationModel.findById(id).orFail();
    if (notification.receiver?.toString() !== req.session.user?.id) {
        throw new ErrorBuilder().msg("This notification doesn't belong to you").status(400);
    }

    notification.read = true;
    await notification.save();

    return notification.toJSON();
};

export default (): Resource => ({
    post: {
        handler,
        onRequest: authenticate("user"),
    },
});
