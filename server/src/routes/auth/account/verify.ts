import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import jwt from "jsonwebtoken";
import urlCat from "urlcat";

import { userModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

import { transporter } from "@utils/email";
import ErrorBuilder from "@utils/errorBuilder";

const querystring = Type.Object(
    {
        key: Type.String(),
    },
    { additionalProperties: false }
);

type Querystring = Static<typeof querystring>;

const GET_handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { key } = req.query;
    const { id } = jwt.decode(key) as { id: string };

    try {
        jwt.verify(key, process.env.SECRET as string);
    } catch {
        throw new ErrorBuilder().msg("Key not valid").status(403);
    }

    const user = await userModel.findById(id).orFail();
    user.attributes.verified = true;
    await user.save();

    return "Account verified";
};

const POST_handler: any = async (req: Req) => {
    const user = await userModel.findById(req.session.user?.id || null).orFail();

    const key = jwt.sign({ id: user.id }, process.env.SECRET as string, { expiresIn: "7d" });
    const url = urlCat(process.env.BASE_URL as string, "/api/v1/auth/account/verify", {
        key,
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        subject: "Doto account verification",
        to: user.email,
        html:
            `<p>Hello, if you didn't register an account at doto.dev you can safely ignore this email</p>` +
            `<p>To verify your account click this <a href="${url}">link</a></p>`,
    });

    return "OK";
};

export default (): Resource => ({
    get: {
        handler: GET_handler,
        schema: { querystring },
    },
    post: {
        handler: POST_handler,
        onRequest: authenticate("user"),
        config: {
            rateLimit: {
                max: 3,
                timeWindow: "60 minutes",
            },
        },
    },
});
