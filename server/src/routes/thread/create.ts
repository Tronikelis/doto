import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import { nanoid } from "nanoid";

import { commentModel, userModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

import ErrorBuilder from "@utils/errorBuilder";
import aggregateComment from "@utils/mongo/aggregateComment";

const body = Type.Object(
    {
        title: Type.String({ minLength: 1, maxLength: 200 }),
        description: Type.String({ minLength: 1, maxLength: 10_000 }),
        variant: Type.Union([Type.Literal("home"), Type.Literal("explore")], {
            default: "explore",
        }),
    },
    { additionalProperties: false }
);

type Body = Static<typeof body>;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { description, title, variant } = req.body;
    const userId = req.session.user?.id as string;

    const user = await userModel.findById(userId).orFail();

    if (variant === "home" && !user.attributes.admin) {
        throw new ErrorBuilder().msg("Only admins can create home posts").status(400);
    }

    const slug = `${title}-${nanoid()}`
        .replace(/ /g, "_")
        .replace(/[^\w\s]/g, "")
        .toLowerCase();

    const root = await commentModel.create({
        author: req.session.user?.id,
        description,
        root: {
            title,
            slug,
            variant,
        },
    });

    return aggregateComment({ userId, id: root.id });
};

export default (): Resource => ({
    post: {
        handler,
        schema: { body },
        onRequest: authenticate("verified"),
        config: {
            rateLimit: {
                max: 5,
            },
        },
    },
});
