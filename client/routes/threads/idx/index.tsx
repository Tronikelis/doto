import { CircularProgress, Container, Stack } from "@mui/material";
import { NextSeo } from "next-seo";
import { useInView } from "react-intersection-observer";
import useSWR from "swr/infinite";
import urlCat from "urlcat";

import { AxiosThreads } from "@types";

import { SWRImmutable } from "@config";

import Thread from "@components/Thread";

export default function Threads() {
    const { data, setSize } = useSWR<AxiosThreads>((index, prev) => {
        if (prev && !prev.next) return null;
        return urlCat("/threads", { page: index + 1, variant: "explore" });
    }, SWRImmutable);
    const next = data && data[data.length - 1].next;

    const { ref } = useInView({
        onChange: inView => {
            inView && setSize(x => x + 1);
        },
    });

    return (
        <Container maxWidth="md" sx={{ mt: 3 }}>
            <NextSeo title="Threads" />

            <Stack spacing={4}>
                {data?.map(({ data }) =>
                    data.map(({ root, id }) => <Thread slug={root?.slug} minimal key={id} />)
                )}

                {next && <CircularProgress ref={ref} sx={{ alignSelf: "center" }} />}
            </Stack>
        </Container>
    );
}
