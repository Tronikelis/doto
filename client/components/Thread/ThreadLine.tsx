import { Box, BoxProps } from "@mui/material";

interface ThreadLineProps extends BoxProps {
    depthColor?: string;
}

export default function ThreadLine({ depthColor, sx, ...props }: ThreadLineProps) {
    return (
        <Box
            sx={{
                boxSizing: "border-box",
                display: "inline-block",
                height: "100%",
                ml: "5px",
                verticalAlign: "top",
                width: "16px",
                ...sx,
            }}
            {...props}
        >
            <Box
                component="i"
                borderRight={({ palette }) =>
                    `2px solid ${depthColor || palette.secondary.dark}`
                }
                display="block"
                height="100%"
                width="50%"
            />
        </Box>
    );
}
