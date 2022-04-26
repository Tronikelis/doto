import { Typography } from "@mui/material";
import useSWR from "swr";

import { AxiosGithubReleases } from "./types";

export default function Title() {
    const { data } = useSWR<AxiosGithubReleases[]>(
        "https://api.github.com/repos/Tronikelis/doto/releases"
    );

    return (
        <Typography>
            <Typography variant="h6">Doto {data && `- ${data?.[0].tag_name}`}</Typography>
        </Typography>
    );
}
