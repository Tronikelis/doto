import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ReplyIcon from "@mui/icons-material/Reply";
import ReportIcon from "@mui/icons-material/Report";
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { Votes } from "@types";

import { removeNewlines, removeSpaces } from "@config";

import useUserMutation from "@hooks/mutations/useUserMutation";

import numberToString from "@utils/numberToString";

interface ReplyBoxProps {
    onReply: (description: string) => any;
    onClose: () => any;
}

interface ActionsProps {
    votes?: Votes;
    authorId?: string;
    onUpvote: () => any;
    onDownvote: () => any;
    onReply: (description: string) => any;
    onReport: () => any;
    onDelete: () => any;
}

const ReplyBox = ({ onReply, onClose }: ReplyBoxProps) => {
    const { register, handleSubmit } = useForm<{ comment: string }>();

    const onSubmit = handleSubmit(({ comment }) => {
        onReply(comment);
        onClose();
    });

    const setValueAs = (comment: string) =>
        comment.trim().replace(removeNewlines, "\n").replace(removeSpaces, "");

    return (
        <Stack
            width="100%"
            px={1}
            py={2}
            component="form"
            alignItems="flex-end"
            onSubmit={onSubmit}
        >
            <TextField
                label="Your reply"
                variant="standard"
                fullWidth
                {...register("comment", {
                    required: "Write a comment",
                    maxLength: 5_000,
                    setValueAs,
                })}
                multiline
                maxRows={10}
            />

            <Box mt={1}>
                <Button size="small" variant="text" sx={{ mr: 1 }} onClick={onClose}>
                    Close
                </Button>

                <Button type="submit" size="small" variant="contained">
                    Reply
                </Button>
            </Box>
        </Stack>
    );
};

interface SecondaryActionsProps extends Pick<ActionsProps, "onReport" | "onDelete"> {
    isDeletable: boolean;
    loggedIn: boolean;
}

const SecondaryActions = ({
    onReport,
    onDelete,
    isDeletable,
    loggedIn,
}: SecondaryActionsProps) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    return (
        <Box>
            <Menu
                anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                transformOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                open={!!anchorEl}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
            >
                <List disablePadding>
                    {isDeletable && (
                        <ListItem component={ListItemButton} onClick={onDelete}>
                            <ListItemIcon>
                                <DeleteIcon />
                            </ListItemIcon>
                            <ListItemText primary="Delete" />
                        </ListItem>
                    )}
                    <ListItem component={ListItemButton} onClick={onReport}>
                        <ListItemIcon>
                            <ReportIcon />
                        </ListItemIcon>
                        <ListItemText primary="Report" />
                    </ListItem>
                </List>
            </Menu>

            <IconButton
                disabled={!loggedIn}
                size="small"
                onClick={e => setAnchorEl(e.currentTarget)}
            >
                <MoreHorizIcon fontSize="small" />
            </IconButton>
        </Box>
    );
};

const Actions = ({
    votes = {
        downvotes: 0,
        upvotes: 0,
        voted: null,
    },
    onDownvote,
    onUpvote,
    onReply,
    onReport,
    onDelete,
    authorId,
}: ActionsProps) => {
    const { downvotes, upvotes, voted } = votes;

    const { data } = useUserMutation();
    const [open, setOpen] = useState(false);

    const loggedIn = !!data?.nickname;

    const formattedVotes = useMemo(
        () => numberToString(upvotes - downvotes),
        [downvotes, upvotes]
    );

    const onClose = () => setOpen(false);

    const isDeletable = data?.attributes?.admin || authorId === data?.id;

    return (
        <Stack flexDirection="row" flexWrap="wrap" justifyContent="space-between">
            <Stack flexDirection="row" justifyContent="center" alignItems="center">
                <IconButton size="small" onClick={onUpvote} disabled={!loggedIn}>
                    <ArrowUpwardIcon
                        fontSize="small"
                        color={voted === "upvote" ? "success" : "inherit"}
                    />
                </IconButton>

                <Typography mx={0.5}>{formattedVotes}</Typography>

                <IconButton size="small" onClick={onDownvote} disabled={!loggedIn}>
                    <ArrowDownwardIcon
                        fontSize="small"
                        color={voted === "downvote" ? "error" : "inherit"}
                    />
                </IconButton>
            </Stack>

            <Stack flexDirection="row">
                <IconButton
                    size="small"
                    color="secondary"
                    disabled={!loggedIn}
                    onClick={() => setOpen(x => !x)}
                >
                    <ReplyIcon fontSize="small" />
                </IconButton>

                <SecondaryActions
                    isDeletable={isDeletable}
                    loggedIn={loggedIn}
                    onDelete={onDelete}
                    onReport={onReport}
                />
            </Stack>

            {open && <ReplyBox onClose={onClose} onReply={onReply} />}
        </Stack>
    );
};

export default Actions;
