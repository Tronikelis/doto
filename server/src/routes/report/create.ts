import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { reportModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const body = Type.Object(
    {
        type: Type.Union([
            Type.Literal("user"),
            Type.Literal("comment"),
            Type.Literal("thread"),
        ]),
        typeId: Type.String(),
        summary: Type.Optional(Type.String({ maxLength: 500 })),
    },
    { additionalProperties: false }
);

type Body = Static<typeof body>;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { type, typeId, summary } = req.body;

    const report = await reportModel.findOne({ type, typeId });

    if (report) {
        // yes, I know
        report.reportCount++;
        await report.save();
        return "OK";
    }

    await reportModel.create({
        by: req.session.user?.id,
        summary,
        type,
        typeId,
    });

    return "OK";
};

export default (): Resource => ({
    post: {
        handler,
        schema: { body },
        onRequest: authenticate("verified"),
        config: {
            rateLimit: {
                max: 15,
            },
        },
    },
});
