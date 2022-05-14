import { GetServerSideProps } from "next";
import { SWRConfig } from "swr";

import { PageProps } from "@types";

import Game from "@routes/game/[slug]";

const { handler } = require("../../../server/dist/routes/game/{slug}");

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const { slug } = params as any;
    const game = await handler({ params: { slug } });

    return {
        props: {
            fallback: {
                [`/game/${slug}`]: game,
            },
        },
    };
};

export default function Page({ fallback }: PageProps) {
    return (
        <SWRConfig value={{ fallback }}>
            <Game />
        </SWRConfig>
    );
}
