import { Container } from "@mui/material";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";

import Thread from "@components/Thread";

import useCommentMutation from "@hooks/mutations/thread/useCommentMutation";

export default function ThreadSlug() {
    const {
        query: { slug },
    } = useRouter();

    const { data } = useCommentMutation({ slug: slug && String(slug) });

    return (
        <Container maxWidth="lg" sx={{ mt: 3 }}>
            <NextSeo title={data?.root?.title} />
            {slug && <Thread slug={String(slug)} />}
        </Container>
    );
}
