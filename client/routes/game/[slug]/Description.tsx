import CodeIcon from "@mui/icons-material/Code";
import PublishIcon from "@mui/icons-material/Publish";
import WebIcon from "@mui/icons-material/Web";
import { Box, Button, Chip, Collapse, Divider, Paper, Stack, Typography } from "@mui/material";
import Markdown from "markdown-to-jsx";
import { useMemo, useState } from "react";

import { useGame } from "./hooks";

const MARGIN = 40;

interface SummaryProps {
    summary?: string;
}

const Summary = ({ summary }: SummaryProps) => {
    const [open, setOpen] = useState(false);

    const sliced = useMemo(() => {
        if (!summary) return ["", null];
        if (summary.length < MARGIN) return [summary, null];

        const spaces = summary.split(" ");

        return [spaces.slice(0, MARGIN).join(" "), spaces.slice(MARGIN).join(" ")];
    }, [summary]);

    return (
        <Stack>
            <Divider flexItem sx={{ mb: 2 }}>
                <Chip label="Summary" />
            </Divider>

            <Markdown>{String(sliced[0])}</Markdown>

            <Collapse
                in={open}
                sx={{
                    whiteSpace: "pre-line",
                    wordBreak: "break-word",
                    overflowWrap: "anywhere",
                }}
            >
                <Markdown>{String(sliced[1])}</Markdown>
            </Collapse>

            {sliced[1] && (
                <Typography
                    component="span"
                    color="secondary.main"
                    sx={{ cursor: "pointer" }}
                    onClick={() => setOpen(x => !x)}
                    whiteSpace="pre-line"
                >
                    {" ... "}
                    {!open ? "More" : "Less"}
                </Typography>
            )}
        </Stack>
    );
};

export default function Description() {
    const { data } = useGame();

    return (
        <Box component={Paper} p={2}>
            <Typography variant="h2" mb={2} sx={{ overflowWrap: "anywhere" }}>
                {data?.name}
            </Typography>

            <Stack flexDirection="row" flexWrap="wrap" alignItems="center" mb={2}>
                <Typography mr={0.5} color="text.secondary">
                    By:{" "}
                </Typography>
                {data?.developers.map(({ name }) => (
                    <Chip icon={<CodeIcon />} label={name} key={name} sx={{ m: 0.5 }} />
                ))}
                {data?.publishers.map(({ name }) => (
                    <Chip icon={<PublishIcon />} label={name} key={name} sx={{ m: 0.5 }} />
                ))}
            </Stack>

            <Stack mb={2} flexDirection="row" flexWrap="wrap" alignItems="center">
                <Typography mr={0.5} color="text.secondary">
                    Genres:{" "}
                </Typography>
                {data?.genres.map(({ name }) => (
                    <Chip label={name} key={name} sx={{ m: 0.5 }} />
                ))}
            </Stack>

            <Typography mb={2}>
                <Typography component="span" color="text.secondary">
                    Released:{" "}
                </Typography>
                {data?.released || "Not yet"}
            </Typography>

            <Summary summary={data?.description_raw} />

            <Stack flexDirection="row" mt={2}>
                {data?.website && (
                    <Button
                        href={data.website}
                        target="_blank"
                        LinkComponent="a"
                        startIcon={<WebIcon />}
                    >
                        Website
                    </Button>
                )}
            </Stack>
        </Box>
    );
}
