import { Container, Stack } from "@mui/material";
import { NextSeo } from "next-seo";
import useSWR from "swr/infinite";
import urlCat from "urlcat";

import { AxiosThreads } from "@types";

import Thread from "@components/Thread";

export default function Threads() {
    const { data } = useSWR<AxiosThreads>((index, prev) => {
        if (prev && !prev.next) return null;
        return urlCat("/threads", { page: index + 1, variant: "explore" });
    });

    return (
        <Container maxWidth="md" sx={{ mt: 3 }}>
            <NextSeo title="Threads" />

            <Stack spacing={4}>
                {data?.map(({ data }) =>
                    data.map(({ root, id }) => <Thread slug={root?.slug} minimal key={id} />)
                )}
            </Stack>
        </Container>
    );
}
