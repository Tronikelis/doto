import { Static, Type } from "@sinclair/typebox";
import axios from "axios";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

import { userModel } from "@mongo";

import { authenticate } from "@hooks/authenticate";

import ErrorBuilder from "@utils/errorBuilder";

const body = Type.Object(
    {
        img: Type.String({ minLength: 1, maxLength: 800 }),
    },
    { additionalProperties: false }
);

type Body = Static<typeof body>;

const imgRegex = /\.(jpeg|jpg|gif|png)$/;

const handler: any = async (req: Req<{ Body: Body }>) => {
    const { img } = req.body;

    const user = await userModel
        .findById(req.session.user?.id || null)
        .orFail()
        .select("-password");

    const url = new URL(img);
    if (!url.href.match(imgRegex)) {
        throw new ErrorBuilder().msg("Incorrect URL").status(400);
    }

    // check the file size
    const { headers } = await axios.get(url.href, { responseType: "blob" });

    const size = Number(headers["content-length"]);

    if (size / Math.pow(10, 6) >= 1) {
        throw new ErrorBuilder().msg("This image is too large").status(400);
    }

    user.avatar = img;
    await user.save();

    return user.toJSON();
};

export default (): Resource => ({
    put: {
        handler,
        schema: { body },
        onRequest: authenticate(),
    },
});
