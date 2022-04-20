import { Card } from "@mui/material";
import { dequal } from "dequal";
import { memo } from "react";

import Content from "./Content";
import Media from "./Media";

interface GameCardProps {
    img: string | null;
    name: string;
    video?: string;
    genres?: string[];
    slug: string;
    variant?: "elevation" | "outlined";
    animations?: true;
}

const GameCard = memo(
    ({ img, name, video, genres, slug, variant = "elevation", animations }: GameCardProps) => {
        return (
            <Card
                variant={variant}
                sx={
                    animations && {
                        transition: ({ transitions }) =>
                            `all 0.2s ${transitions.easing.sharp}`,
                        "&:hover": {
                            transform: "scale(1.05)",
                        },
                    }
                }
            >
                <Media img={img} video={video} />
                <Content name={name} slug={slug} genres={genres} />
            </Card>
        );
    },
    dequal
);

export default GameCard;
