import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
    Button,
    Divider,
    FormControlLabel,
    Grid,
    Popover,
    Radio,
    RadioGroup,
    Slider,
    Stack,
    Typography,
} from "@mui/material";
import { useState } from "react";
import { useSnapshot } from "valtio";

import { actions, store } from "./store";

interface PopoverMenuProps {
    open: boolean;
    onClose: () => any;
    anchor: HTMLElement | null;
}

const PopoverMenu = ({ onClose, open, anchor }: PopoverMenuProps) => {
    const { dates, ordering } = useSnapshot(store.filters);
    const { setDates, setOrdering } = actions;

    const valueLabelFormat = (value: number) => {
        if (value > 0) {
            return `${value} months ahead`;
        }

        if (value < 0) {
            return `${Math.abs(value)} months behind`;
        }

        return "Now, literally lol";
    };

    return (
        <Popover
            sx={{ mt: 1 }}
            open={open}
            onClose={onClose}
            anchorEl={anchor}
            anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
            }}
            transformOrigin={{
                vertical: "top",
                horizontal: "left",
            }}
        >
            <Stack
                py={2}
                px={4}
                maxWidth={400}
                width={{
                    xs: "80vw",
                    md: 400,
                }}
            >
                <Typography variant="h6" align="center" gutterBottom>
                    Apply custom filters
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Stack>
                            <Typography color="text.secondary">Release date</Typography>
                            <Slider
                                value={dates}
                                onChange={(_, value) => setDates(Number(value))}
                                defaultValue={-6}
                                min={-12}
                                max={12}
                                marks={[
                                    {
                                        value: -8,
                                        label: "8 months behind",
                                    },
                                    {
                                        value: 8,
                                        label: "8 months ahead",
                                    },
                                ]}
                                valueLabelDisplay="auto"
                                valueLabelFormat={valueLabelFormat}
                            />
                        </Stack>
                    </Grid>
                    <Divider />

                    <Grid item xs={12} md={6}>
                        <Stack>
                            <Typography color="text.secondary">Sort by</Typography>
                            <RadioGroup
                                value={ordering}
                                onChange={(_, value) => setOrdering(value)}
                            >
                                <FormControlLabel
                                    value="-added"
                                    label="Popularity"
                                    control={<Radio />}
                                />
                                <FormControlLabel
                                    value="-metacritic"
                                    label="Metacritic"
                                    control={<Radio />}
                                />
                            </RadioGroup>
                        </Stack>
                    </Grid>
                </Grid>
            </Stack>
        </Popover>
    );
};

export default function Filters() {
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);

    return (
        <>
            <Button
                onClick={e => setAnchor(e.currentTarget)}
                variant="contained"
                startIcon={<FilterAltIcon />}
            >
                Filters
            </Button>

            <PopoverMenu open={!!anchor} onClose={() => setAnchor(null)} anchor={anchor} />
        </>
    );
}
