import type { onRequestHookHandler } from "fastify";

import { userModel } from "@mongo";

import ErrorBuilder from "@utils/errorBuilder";

type Authentication = "admin" | "verified" | "user";

export const authenticate = (type?: Authentication): onRequestHookHandler => {
    switch (type) {
        case "admin": {
            return async req => {
                const user = await userModel.findById(req.session.user?.id || null).orFail();
                if (!user.attributes.admin) {
                    throw new ErrorBuilder().msg("You need to be an admin").status(400);
                }
            };
        }

        case "verified": {
            return async req => {
                const user = await userModel.findById(req.session.user?.id || null).orFail();
                if (!user.attributes.verified) {
                    throw new ErrorBuilder().msg("You need to be verified").status(400);
                }
            };
        }

        default: {
            return (req, res, done) => {
                if (!req.session.user?.id) {
                    res.status(401).send("You need to be authorized for this route");
                    return;
                }
                done();
            };
        }
    }
};
