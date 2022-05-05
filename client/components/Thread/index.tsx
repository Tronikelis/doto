import { Card, CardContent, Divider, Link, Typography } from "@mui/material";
import { dequal } from "dequal";
import { useRouter } from "next/router";
import { memo, useContext, useMemo } from "react";
import TimeAgo from "timeago-react";

import { Reply } from "@types";

import useCommentMutation from "@hooks/mutations/thread/useCommentMutation";
import useReplyMutation from "@hooks/mutations/thread/useReplyMutation";

import Actions from "./Actions";
import CommentBox from "./CommentBox";
import { ThreadContext, ThreadProvider } from "./Context";

interface ThreadProps {
    count?: number;
    slug?: string;
}

interface CommentContainerProps {
    comments?: Reply[];
}

const CommentContainer = memo(({ comments = [] }: CommentContainerProps) => {
    return (
        <>
            {comments.map(comment => (
                <CommentBox fallback={comment} key={comment.id} />
            ))}
        </>
    );
}, dequal);

const Thread = () => {
    const { count, slug } = useContext(ThreadContext);

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
                        {" - "}
                    </Typography>

                    <Typography component="span">
                        <TimeAgo datetime={new Date(comment?.date || "")} />
                    </Typography>
                </Typography>

                <Typography fontWeight={900} variant="h6" gutterBottom>
                    {comment?.root?.title || "[deleted]"}
                </Typography>
                <Typography gutterBottom>{comment?.description || "[deleted]"}</Typography>

                {!isDeleted && (
                    <Actions
                        onReply={onReply}
                        onReport={onReport}
                        onUpvote={() => onVote("upvote")}
                        onDownvote={() => onVote("downvote")}
                        onDelete={onDelete}
                        votes={comment?.formattedVotes}
                        authorId={comment?.author?.id}
                    />
                )}

                <Divider sx={{ my: 2 }} />

                <CommentContainer comments={comments} />

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

const Root = memo(({ count = 25, slug }: ThreadProps) => {
    const { asPath } = useRouter();

    return (
        <ThreadProvider count={count} slug={slug || asPath}>
            <Thread />
        </ThreadProvider>
    );
});

export default Root;
