import { Static, Type } from "@sinclair/typebox";
import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";
import urlCat from "urlcat";

import { AxiosGeolocate } from "@types";

import { cacheClient } from "@utils/axios";
import { search } from "@utils/searchers";
import steam from "@utils/searchers/steam";

const querystring = Type.Object(
    {
        country: Type.Optional(Type.String({ minLength: 1, maxLength: 4 })),
        currency: Type.Optional(Type.String({ minLength: 1, maxLength: 4 })),
        steamId: Type.Optional(Type.Integer({ minimum: 0 })),
        query: Type.String(),
    },
    { additionalProperties: false }
);
type Querystring = Static<typeof querystring>;

const handler: any = async (req: Req<{ Querystring: Querystring }>) => {
    const { query, country, currency, steamId } = req.query;

    const ip =
        req.headers["cf-connecting-ip"]?.toString() ||
        req.headers["x-forwarded-for"]?.toString() ||
        req.ip;

    const { data } = await cacheClient.get<AxiosGeolocate>(
        urlCat("https://ipapi.com/ip_api.php", {
            ip,
        })
    );

    const searchResult = [];

    if (steamId) {
        const result = await steam.fetchPrice({
            id: steamId,
            country: country?.toUpperCase() || data.country_code,
        });
        searchResult.push({ provider: steam.provider, result });
    }

    const result = await search({
        query,
        country: country?.toUpperCase() || data.country_code,
        currency: currency || data.currency.code,
    });

    return [...searchResult, ...result];
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
