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

const defCountry = "LT";
const defCurrency = "EUR";

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

    const computedCountry = country?.toUpperCase() || data?.country_code || defCountry;
    const computedCurrency = currency || data.currency.code || defCurrency;

    if (steamId) {
        const result = await steam.fetchPrice({
            id: steamId,
            country: computedCountry,
            currency: computedCountry,
        });
        searchResult.push({ provider: steam.provider, result });
    }

    const result = await search({
        query,
        country: computedCountry,
        currency: computedCurrency,
    });

    return {
        country: data?.country_name
            ? `${data?.country_name} ${data?.location.country_flag_emoji}`
            : computedCountry,
        currency: computedCurrency,
        query,
        prices: [...searchResult, ...result],
    };
};

export default (): Resource => ({
    get: {
        handler,
        schema: { querystring },
    },
});
