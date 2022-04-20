import { CardMedia } from "@mui/material";
import { useState } from "react";

import ResponsiveImage from "@components/ResponsiveImage";

interface MediaProps {
    img: string | null;
    video?: string;
}

export default function Media({ img, video }: MediaProps) {
    const [hovering, setHovering] = useState(false);

    const imageHidden = !!(hovering && video);

    return (
        <CardMedia
            sx={{
                height: 250,
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
            onMouseEnter={() => setHovering(true)}
            onClick={() => setHovering(x => !x)}
            onMouseLeave={() => setHovering(false)}
        >
            {hovering && (
                <video
                    muted
                    preload="none"
                    src={video}
                    autoPlay
                    loop
                    style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                    }}
                />
            )}

            <ResponsiveImage
                props={{
                    sx: {
                        opacity: !imageHidden ? 1 : 0,
                        transition: ({ transitions }) =>
                            `all 0.2s ${transitions.easing.sharp}`,
                    },
                }}
                src={img}
            />
        </CardMedia>
    );
}
