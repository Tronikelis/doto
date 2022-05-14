import { GetStaticProps } from "next";
import { SWRConfig } from "swr";

import { PageProps } from "@types";

import Index from "@routes/idx";

const { handler } = require("../../server/dist/routes/games");

export const getStaticProps: GetStaticProps = async () => {
    const result = await handler({
        query: {
            page: 1,
            dates: "-10,0",
            ordering: "-added",
        },
    });

    return {
        props: {
            fallback: {
                games: { ...result, next: true },
            },
        },
        revalidate: 60 * 60 * 24 * 2,
    };
};

export default function Page({ fallback }: PageProps) {
    return (
        <SWRConfig value={{ fallback }}>
            <Index />
        </SWRConfig>
    );
}
