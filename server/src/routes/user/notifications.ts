import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { notificationModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const querystring = Type.Object(
    {
        page: Type.Integer({ minimum: 1, default: 1 }),
        count: Type.Integer({ minimum: 1, default: 25, maximum: 50 }),
    },
    { additionalProperties: false }
);

type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { count, page } = req.query;

    const receiver = req.session.user?.id;
    const data = await notificationModel
        .find({ receiver })
        .skip((page - 1) * count)
        .limit(count);

    const amount = await notificationModel.countDocuments({ receiver });

    return {
        count,
        page,
        next: page * count < amount,
        data,
    };
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
        onRequest: authenticate("user"),
    },
});
