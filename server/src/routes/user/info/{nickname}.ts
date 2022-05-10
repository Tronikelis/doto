import { FastifyRequest as Req } from "fastify";
import { Resource } from "fastify-autoroutes";

const handler: any = async (req: Req) => {
    const params = req.params;

    // get user nick avatar karma posts

    return { params };
};

export default (): Resource => ({
    get: {
        handler,
    },
});
