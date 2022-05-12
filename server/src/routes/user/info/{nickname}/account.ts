import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { accountModel, userModel } from "@mongo";

const params = Type.Object(
    {
        nickname: Type.String(),
    },
    { additionalProperties: false }
);

type Params = Static<typeof params>;

const handler: any = async (req: Req<{ Params: Params }>) => {
    const { nickname } = req.params;

    const user = await userModel
        .findOne({ nickname })
        .select(["-password", "-email"])
        .orFail();

    const owner = user.id === req.session.user?.id;
    const select = owner ? [] : ["-settings"];

    const account = await accountModel
        .findOne({ user: user.id })
        .select(select)
        .populate("watching")
        .orFail();

    return { ...account.toJSON(), owner };
};

export default (): Resource => ({
    get: {
        handler,
        schema: { params },
    },
});
