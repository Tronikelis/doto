import { Box } from "@mui/material";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { memo, useRef, useState } from "react";
import { useThrottledCallback } from "use-debounce";

import ResponsiveImage from "@components/ResponsiveImage";

import useOnClickOutside from "@hooks/useOnClickOutside";

interface GalleryProps {
    images?: string[];
}

function Gallery({ images = [] }: GalleryProps) {
    const [selected, setSelected] = useState<string | null>(null);

    const imageRef = useRef<HTMLDivElement | null>(null);

    const setSelectedThrottled = useThrottledCallback((image: string) => {
        setSelected(image);
    }, 1000);

    useOnClickOutside(imageRef, e => {
        e.preventDefault();
        setSelected(null);
    });

    return (
        <Box width="100%" height="100%">
            <LayoutGroup>
                <Box width="100%" height="100%" position={selected ? "absolute" : "static"}>
                    {images.map(image => (
                        <Box
                            component={motion.div}
                            sx={{
                                width: "50%",
                                height: "50%",
                                float: "left",
                                p: 1,
                                cursor: "pointer",
                            }}
                            key={image}
                            layoutId={image}
                            onClick={() => setSelectedThrottled(image)}
                        >
                            <Box
                                width="100%"
                                height="100%"
                                overflow="hidden"
                                sx={{
                                    borderRadius: ({ shape }) => `${shape.borderRadius}px`,
                                }}
                            >
                                <ResponsiveImage src={image} />
                            </Box>
                        </Box>
                    ))}
                </Box>

                {/** shown when pressed */}
                <AnimatePresence>
                    {selected && (
                        <Box
                            layoutId={selected}
                            component={motion.div}
                            sx={{
                                width: "100%",
                                height: "100%",
                                p: 1,
                                cursor: "pointer",
                            }}
                            onClick={() => setSelected(null)}
                            ref={imageRef}
                        >
                            <ResponsiveImage
                                props={{
                                    sx: {
                                        borderRadius: ({ shape }) => `${shape.borderRadius}px`,
                                    },
                                }}
                                src={selected}
                            />
                        </Box>
                    )}
                </AnimatePresence>
            </LayoutGroup>
        </Box>
    );
}

export default memo(Gallery);
