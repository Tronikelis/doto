interface FormatVotesProps {
    upvotes: string[];
    downvotes: string[];
    userId: string;
}

interface Votes {
    upvotes: number;
    downvotes: number;
    voted: string | null;
}

const formatVotes = ({ downvotes, upvotes, userId }: FormatVotesProps) => {
    const [upvoted, downvoted] = [upvotes.includes(userId), downvotes.includes(userId)];

    const votes: Votes = {
        upvotes: upvotes.length,
        downvotes: downvotes.length,
        voted: null,
    };

    if (upvoted) {
        votes.voted = "upvote";
        return votes;
    }

    if (downvoted) {
        votes.voted = "downvote";
        return votes;
    }

    return votes;
};

interface FormatVotesRecursiveProps {
    items: any[];
    key?: string;
    userId: string;
}

const formatVotesRecursive = ({
    items,
    key = "replies",
    userId,
}: FormatVotesRecursiveProps) => {
    for (const item of items) {
        const { upvotes, downvotes } = item.votes;
        const votes = formatVotes({ upvotes, downvotes, userId });

        item.formattedVotes = votes;
        item.votes = undefined;

        item[key]?.[0]?.votes && formatVotesRecursive({ items: item[key], key, userId });
    }
};

const formatVotesMethod = (obj: any, userId: string) => {
    const { downvotes, upvotes } = obj.votes;

    const votes = formatVotes({ downvotes, upvotes, userId });

    obj.formattedVotes = votes;
    obj.votes = undefined;

    if (Array.isArray(obj)) {
        formatVotesRecursive({ items: obj, userId, key: "replies" });
        return obj;
    }

    if (obj.replies?.[0]?.votes) {
        formatVotesRecursive({ items: obj.replies, userId, key: "replies" });
    }

    return obj;
};

export default formatVotesMethod;
