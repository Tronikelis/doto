import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import { Box, IconButton, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useCallback, useMemo, useRef, useState } from "react";

import useInterval from "@hooks/useInterval";
import useOnClickOutside from "@hooks/useOnClickOutside";

import chunk from "@utils/chunk";

import Gallery from "./Gallery";

interface CarouselProps {
    images?: string[];
    autoRotate?: number;
}

export default function Carousel({ images = [], autoRotate }: CarouselProps) {
    const [active, setActive] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);

    const containerRef = useRef<HTMLElement | null>(null);

    const chunkImages = useMemo(() => {
        if (!images) return [[]];
        return chunk(images, 4);
    }, [images]);

    const swipeRight = () => {
        setActive(x => (x + 1) % chunkImages.length);
    };

    const swipeLeft = () => {
        if (active - 1 < 0) {
            setActive(chunkImages.length - 1);
            return;
        }
        setActive(x => x - 1);
    };

    const onClickOutside = useCallback(() => {
        setFullscreen(false);
    }, []);

    const { reset } = useInterval(() => {
        autoRotate && swipeRight();
    });

    useOnClickOutside(containerRef, onClickOutside);

    return (
        <Box
            overflow="hidden"
            sx={{
                borderRadius: ({ shape }) => `${shape.borderRadius}px`,
                position: fullscreen ? "fixed" : "relative",
                width: fullscreen ? "90%" : "100%",
                height: fullscreen ? "90%" : "100%",
                transform: fullscreen ? "translate(-50%, -50%)" : undefined,
                top: fullscreen ? "50%" : undefined,
                left: fullscreen ? "50%" : undefined,
                zIndex: fullscreen ? 1 : "auto",
            }}
            ref={containerRef}
        >
            <Box position="absolute" height="100%" width="100%">
                <Stack
                    mx={1}
                    justifyContent="space-between"
                    flexDirection="row"
                    alignItems="center"
                    height="100%"
                >
                    <Stack height="100%">
                        <Box flex={0.5} pt={1}>
                            <IconButton
                                sx={{ zIndex: 1 }}
                                onClick={() => setFullscreen(x => !x)}
                            >
                                {fullscreen ? (
                                    <FullscreenExitIcon fontSize="large" />
                                ) : (
                                    <FullscreenIcon fontSize="large" />
                                )}
                            </IconButton>
                        </Box>
                        <IconButton
                            onClick={() => {
                                swipeLeft();
                                reset();
                            }}
                            sx={{ zIndex: 1 }}
                        >
                            <ChevronLeftIcon fontSize="large" />
                        </IconButton>
                    </Stack>
                    <IconButton
                        onClick={() => {
                            swipeRight();
                            reset();
                        }}
                        sx={{ zIndex: 1 }}
                    >
                        <ChevronRightIcon fontSize="large" />
                    </IconButton>
                </Stack>
            </Box>

            {chunkImages.map((images, index) => (
                <Box
                    sx={{
                        borderRadius: ({ shape }) => `${shape.borderRadius}px`,
                    }}
                    position="absolute"
                    width="100%"
                    height="100%"
                    overflow="hidden"
                    component={motion.div}
                    key={index}
                    animate={{
                        scale: active === index ? 1 : 0.3,
                        x: `${(index - active) * 100}%`,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                    }}
                >
                    <Gallery images={images} />
                </Box>
            ))}
        </Box>
    );
}
