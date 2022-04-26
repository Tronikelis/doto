import { CardMedia } from "@mui/material";
import { useState } from "react";
import { useInView } from "react-intersection-observer";

import ResponsiveImage from "@components/ResponsiveImage";

import useMobile from "@hooks/useMobile";

interface MediaProps {
    img: string | null;
    video?: string;
}

export default function Media({ img, video }: MediaProps) {
    const [hovering, setHovering] = useState(false);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const isMobile = useMobile();

    const { ref } = useInView({
        threshold: 0.8,
        onChange: inView => {
            isMobile && setHovering(inView);
        },
    });

    const imageHidden = !!(hovering && video && videoLoaded);

    return (
        <CardMedia
            sx={{
                height: 250,
                position: "relative",
                display: "flex",
                flexDirection: "column",
            }}
            ref={ref}
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
        >
            {hovering && (
                <video
                    muted
                    preload="none"
                    src={video}
                    autoPlay
                    onCanPlay={() => setVideoLoaded(true)}
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
