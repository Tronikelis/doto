import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import urlCat from "urlcat";

import { accountModel, gameModel } from "@mongo";

import { AxiosGame } from "@types";

import { authenticate } from "@hooks/authenticate";

import { rawgClient } from "@utils/axios";
import ErrorBuilder from "@utils/errorBuilder";

const body = Type.Object(
    {
        item: Type.Object({
            slug: Type.String(),
            title: Type.String(),
        }),
    },
    { additionalProperties: false }
);
type body = Static<typeof body>;

const PUT_handler: any = async (req: Req<{ Body: body }>) => {
    const {
        item: { slug, title },
    } = req.body;

    // verify this game exists
    const { data } = await rawgClient.get<AxiosGame>(
        urlCat("/games/:slug", {
            key: process.env.RAWG_KEY,
            slug,
        })
    );

    if (data.name !== title) {
        throw new ErrorBuilder().msg("Slug and title don't match").status(400);
    }

    const game =
        (await gameModel.findOne({ slug })) ||
        (await gameModel.create({
            slug,
            title,
        }));

    const account = await accountModel
        .findOne({ user: req.session.user?.id || null })
        .orFail();

    !account.watching.includes(game.id) && account.watching.push(game.id);
    await account.save();

    await account.populate("watching");
    return account.toJSON();
};

const querystring = Type.Object(
    {
        slug: Type.String(),
    },
    { additionalProperties: false }
);
type Querystring = Static<typeof querystring>;

const DEL_handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { slug } = req.query;

    const game = await gameModel.findOne({ slug }).orFail();

    const account = await accountModel
        .findOne({ user: req.session.user?.id || null })
        .orFail();

    account.watching = account.watching.filter(id => id?.toString() !== game.id);
    await account.save();

    await account.populate("watching");
    return account.toJSON();
};

const GET_handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { slug } = req.query;

    const game = await gameModel.findOne({ slug });
    const empty = { totalCount: 0 };

    if (!game) {
        return empty;
    }

    const count = await accountModel
        .aggregate()
        .unwind("$watching")
        .match({ watching: game._id })
        .count("totalCount");

    return count[0] ? count[0] : empty;
};

export default (): Resource => ({
    put: {
        handler: PUT_handler,
        schema: { body },
        onRequest: authenticate("user"),
    },
    delete: {
        handler: DEL_handler,
        schema: { querystring },
        onRequest: authenticate("user"),
    },
    get: {
        handler: GET_handler,
        schema: { querystring },
    },
});
