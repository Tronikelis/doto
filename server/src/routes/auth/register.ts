import { Static, Type } from "@sinclair/typebox";
import { createHash, randomBytes, scrypt } from "crypto";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import jwt from "jsonwebtoken";
import urlCat from "urlcat";
import { promisify } from "util";

import { accountModel, userModel } from "@mongo";

import { transporter } from "@utils/email";
import ErrorBuilder from "@utils/errorBuilder";

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g;
const nicknameRegex = /^[a-zA-Z]\w*$/g;

const body = Type.Object(
    {
        nickname: Type.String({ minLength: 4, maxLength: 20, pattern: nicknameRegex.source }),
        password: Type.String({ minLength: 6, maxLength: 100 }),
        email: Type.String({ maxLength: 100, pattern: emailRegex.source }),
    },
    { additionalProperties: false }
);
type Body = Static<typeof body>;

const randomBytesPromise = promisify(randomBytes);
const scryptPromise = promisify(scrypt);

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { email, nickname, password } = req.body;

    if (await userModel.findOne({ $or: [{ email }, { nickname }] })) {
        throw new ErrorBuilder().status(400).msg("User already exists");
    }

    const salt = (await randomBytesPromise(16)).toString("base64");
    const hashed = ((await scryptPromise(password, salt, 64)) as any as Buffer).toString(
        "base64"
    );

    const avatar = `https://avatars.dicebear.com/api/initials/${encodeURIComponent(
        nickname
    )}.svg`;

    // hash the user's ip
    const ip = req.headers["cf-connecting-ip"]?.toString() || req.ip;
    const hash = createHash("sha256").update(ip).digest("base64");

    const user = await userModel.create({
        email,
        nickname,
        password: `${salt}:${hashed}`,
        avatar,
        ip: ip && hash,
    });

    await accountModel.create({ user: user.id });

    const key = jwt.sign({ id: user.id }, process.env.SECRET as string);
    const url = urlCat(process.env.BASE_URL || "", "/api/v1/auth/account/verify", {
        key,
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        subject: "Doto account verification",
        to: user.email,
        html:
            `<p>Hello, if you didn't register an account at doto you can safely ignore this email</p>` +
            `<p>To verify your account click this <a href="${url}">link</a></p>`,
    });

    return "OK";
};

export default (): Resource => ({
    post: {
        handler,
        schema: { body },
        config: {
            rateLimit: {
                max: 2,
                timeWindow: "60 minutes",
            },
        },
    },
});
