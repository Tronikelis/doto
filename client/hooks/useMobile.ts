import { Theme, useMediaQuery } from "@mui/material";

export default () => useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));
