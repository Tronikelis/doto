import { Avatar, Box, Link, Stack, Typography } from "@mui/material";
import { dequal } from "dequal";
import { memo, useMemo } from "react";
import { useContext } from "react";
import { SWRConfiguration } from "swr";
import TimeAgo from "timeago-react";

import { Reply } from "@types";

import { SWRImmutable } from "@config";

import ResponsiveImage from "@components/ResponsiveImage";

import useCommentMutation from "@hooks/mutations/thread/useCommentMutation";
import useReplyMutation from "@hooks/mutations/thread/useReplyMutation";

import Actions from "./Actions";
import { ThreadContext } from "./Context";
import ThreadLine from "./ThreadLine";

const ml = 1;

interface CommentBoxProps {
    fallback: Reply;
}

const config: SWRConfiguration = {
    ...SWRImmutable,
    revalidateOnMount: false,
};

const CommentBox = memo(({ fallback }: CommentBoxProps) => {
    const { count, slug } = useContext(ThreadContext);

    const {
        data: replies,
        loadMore,
        loading,
        reply,
        next,
    } = useReplyMutation(
        { id: fallback.id, count },
        {
            ...config,
            fallbackData: [{ next: false, data: fallback.replies }],
        }
    );

    const {
        data: comment,
        onVote,
        isDeleted,
        onReport,
        onDelete,
    } = useCommentMutation({ fallbackData: fallback });

    const comments = useMemo(() => {
        if (!replies) return [];
        return replies?.reduce((prev: any, curr) => [...prev, ...curr.data], []);
    }, [replies]) as Reply[];

    const onReply = (description: string) =>
        reply({ description, id: comment?.id || "", slug });

    const more = useMemo(() => {
        if (!replies) return null;
        // more if next is true (pagination) or (comment has replies but they are not populated)
        return next || (comment?.hasReplies && comments.length < 1);
    }, [comment?.hasReplies, comments.length, next, replies]);

    return (
        <Stack mt={2.5}>
            <Stack flexDirection="row">
                <Stack>
                    <Avatar sx={{ width: 25, height: 25 }}>
                        <ResponsiveImage src={comment?.author?.avatar} />
                    </Avatar>
                    <ThreadLine pt={1} />
                </Stack>

                <Box ml={ml}>
                    <Typography color="text.secondary">
                        <Typography fontWeight={600} component="span">
                            {comment?.author?.nickname || "[deleted]"}
                        </Typography>
                        <Typography variant="body2" component="span">
                            {" - "}
                            <TimeAgo datetime={new Date(comment?.date || "")} />
                        </Typography>
                    </Typography>

                    <Typography
                        mt={0.5}
                        whiteSpace="pre-line"
                        sx={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                    >
                        {comment?.description || "[deleted]"}
                    </Typography>

                    {!isDeleted && (
                        <Actions
                            onReply={onReply}
                            onReport={onReport}
                            onUpvote={() => onVote("upvote")}
                            onDownvote={() => onVote("downvote")}
                            onDelete={onDelete}
                            votes={comment?.votes}
                            authorId={comment?.author?.id}
                        />
                    )}
                </Box>
            </Stack>

            {/** use "comments" vars here */}
            {comments.length > 0 && (
                <Stack flexDirection="row">
                    <Box>
                        <ThreadLine />
                    </Box>

                    <Box>
                        {/** recursively add comments */}
                        {comments.map(comment => (
                            <CommentBox fallback={comment} key={comment.id} />
                        ))}
                    </Box>
                </Stack>
            )}

            {more && (
                <Link
                    ml={ml * 1.5}
                    mt={1}
                    underline="hover"
                    variant="body2"
                    color="primary.main"
                    sx={{ cursor: "pointer" }}
                    onClick={() => loadMore()}
                >
                    {loading ? "Loading" : "Load more"}
                    {" ↓"}
                </Link>
            )}
        </Stack>
    );
}, dequal);

export default CommentBox;
