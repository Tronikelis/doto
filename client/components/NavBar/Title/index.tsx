import { Link as MuiLink, Typography } from "@mui/material";
import NextLink from "next/link";
import useSWR from "swr/immutable";

import { AxiosGithubReleases } from "./types";

export default function Title() {
    const { data = [] } = useSWR<AxiosGithubReleases[]>(
        "https://api.github.com/repos/Tronikelis/doto/releases"
    );

    return (
        <NextLink href="/" passHref>
            <Typography variant="h6" component={MuiLink} underline="none">
                Doto {data.length > 0 && `- ${data?.[0].tag_name}`}
            </Typography>
        </NextLink>
    );
}
