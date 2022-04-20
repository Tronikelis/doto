import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { commentModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

const body = Type.Object(
    {
        title: Type.String({ minLength: 1, maxLength: 500 }),
        description: Type.String({ minLength: 1, maxLength: 10_000 }),
        slug: Type.String(),
    },
    { additionalProperties: false }
);

type Body = Static<typeof body>;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { description, title, slug } = req.body;
    const userId = req.session.user?.id as string;

    const root = await commentModel.create({
        author: req.session.user?.id,
        description,
        root: {
            title,
            slug,
        },
    });

    await root.populate({ path: "author", select: ["nickname", "avatar"] });

    return root.genFormattedVotes(userId).toJSON();
};

export default (): Resource => ({
    post: {
        handler,
        schema: { body },
        onRequest: authenticate("admin"),
        config: {
            rateLimit: {
                max: 5,
            },
        },
    },
});
