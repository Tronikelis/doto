import ClearIcon from "@mui/icons-material/Clear";
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import NextLink from "next/link";
import { memo } from "react";

import ResponsiveImage from "@components/ResponsiveImage";

import useAccountMutation, { Account } from "@hooks/mutations/useAccountMutation";
import usePrices from "@hooks/usePrices";

import useNickname from "./useNickname";

const GameItem = memo(({ slug, title }: Account["watching"][0]) => {
    const nickname = useNickname();
    const {
        data,
        actions: { watchlist },
    } = useAccountMutation(nickname);

    const { computed } = usePrices({ query: title });

    return (
        <ListItem
            secondaryAction={
                data?.owner && (
                    <IconButton onClick={() => watchlist.del(slug)}>
                        <ClearIcon />
                    </IconButton>
                )
            }
            disablePadding
        >
            <NextLink href={`/game/${slug}`} passHref>
                <ListItemButton LinkComponent="a">
                    <ListItemAvatar>
                        <Avatar>
                            <ResponsiveImage src={computed?.total.lowest?.image} />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Typography>
                                {title}{" "}
                                <Typography
                                    fontWeight={500}
                                    color="success.main"
                                    component="span"
                                >
                                    ↓{computed?.total.lowest?.price.amount}
                                </Typography>
                            </Typography>
                        }
                        secondary={slug}
                    />
                </ListItemButton>
            </NextLink>
        </ListItem>
    );
});

export default function Watchlist() {
    const nickname = useNickname();
    const { data } = useAccountMutation(nickname);

    return (
        <Stack>
            <List>
                {data?.watching.map(game => (
                    <GameItem {...game} key={game.slug} />
                ))}
            </List>
        </Stack>
    );
}
