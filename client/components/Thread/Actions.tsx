import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import ReportIcon from "@mui/icons-material/Report";
import { Box, Button, IconButton, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { FormattedVotes } from "@types";

import { removeNewlines, removeSpaces } from "@config";

import useUserMutation from "@hooks/mutations/useUserMutation";

import numberToString from "@utils/numberToString";

interface ReplyBoxProps {
    onReply: (description: string) => any;
    onClose: () => any;
}

interface ActionsProps {
    votes?: FormattedVotes;
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
        <Stack px={1} py={2} component="form" alignItems="flex-end" onSubmit={onSubmit}>
            <TextField
                label="Your reply"
                variant="standard"
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

            <Box>
                <IconButton
                    size="small"
                    color="secondary"
                    disabled={!loggedIn}
                    onClick={() => setOpen(x => !x)}
                >
                    <ReplyIcon fontSize="small" />
                </IconButton>

                <IconButton
                    size="small"
                    color="secondary"
                    disabled={!loggedIn}
                    onClick={onReport}
                >
                    <ReportIcon fontSize="small" />
                </IconButton>

                {isDeletable && (
                    <IconButton size="small" color="secondary" onClick={onDelete}>
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                )}
            </Box>

            {open && <ReplyBox onClose={onClose} onReply={onReply} />}
        </Stack>
    );
};

export default Actions;
