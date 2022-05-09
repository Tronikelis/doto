import {
    Card,
    CardContent,
    Divider,
    Link,
    Link as MuiLink,
    Stack,
    Typography,
} from "@mui/material";
import { dequal } from "dequal";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { memo, useContext, useMemo } from "react";
import TimeAgo from "react-timeago";

import { Reply } from "@types";

import useCommentMutation from "@hooks/mutations/thread/useCommentMutation";
import useReplyMutation from "@hooks/mutations/thread/useReplyMutation";

import Actions from "./Actions";
import CommentBox from "./CommentBox";
import { ThreadContext, ThreadProvider } from "./Context";

interface ThreadProps {
    count?: number;
    slug?: string;
    minimal?: boolean;
}

interface CommentContainerProps {
    comments?: Reply[];
}

const CommentContainer = memo(({ comments = [] }: CommentContainerProps) => {
    return (
        <Stack overflow="auto" pb={1}>
            {comments.map(comment => (
                <CommentBox fallback={comment} key={comment.id} />
            ))}
        </Stack>
    );
}, dequal);

const Thread = () => {
    const { count, slug, minimal } = useContext(ThreadContext);

    const {
        data: comment,
        onVote,
        onReport,
        isDeleted,
        onDelete,
    } = useCommentMutation({ slug });

    const {
        data: replies,
        loadMore,
        next,
        loading,
        reply,
    } = useReplyMutation({ count, id: comment?.id });

    const comments = useMemo(
        () => replies?.reduce((prev: any, curr) => [...prev, ...curr.data], []),
        [replies]
    ) as Reply[];

    const onReply = (description: string) =>
        reply({ description, id: comment?.id || "", slug });

    return (
        <Card>
            <CardContent>
                <Typography variant="body2" color="text.secondary">
                    <Typography component="span">
                        {comment?.author?.nickname || "[deleted]"}
                        {" · "}
                    </Typography>

                    <Typography component="span">
                        <TimeAgo date={comment?.date || ""} />
                    </Typography>
                </Typography>

                {minimal ? (
                    <NextLink href={`/thread/${comment?.root?.slug}`} passHref>
                        <Typography
                            fontWeight={900}
                            variant="h6"
                            component={MuiLink}
                            gutterBottom
                        >
                            {comment?.root?.title || "[deleted]"}
                        </Typography>
                    </NextLink>
                ) : (
                    <Typography fontWeight={900} variant="h6" gutterBottom>
                        {comment?.root?.title || "[deleted]"}
                    </Typography>
                )}

                <Typography my={1}>{comment?.description || "[deleted]"}</Typography>

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

                {!minimal && (
                    <>
                        <Divider sx={{ my: 1 }} />
                        <CommentContainer comments={comments} />
                    </>
                )}

                {next && (
                    <Link
                        mt={1}
                        underline="hover"
                        variant="body2"
                        color="primary.main"
                        sx={{ cursor: "pointer" }}
                        onClick={loadMore}
                    >
                        {loading ? "Loading" : "Load more"}
                        {" ↓"}
                    </Link>
                )}
            </CardContent>
        </Card>
    );
};

const Root = memo(({ count = 25, slug, minimal = false }: ThreadProps) => {
    const { query } = useRouter();

    return (
        <ThreadProvider minimal={minimal} count={count} slug={slug || String(query.slug)}>
            <Thread />
        </ThreadProvider>
    );
});

export default Root;
