import axios from "axios";
import produce from "immer";
import { useMemo } from "react";
import useSWR from "swr";
import urlCat from "urlcat";

import { Reply } from "@types";

import { SWRImmutable, SWRMutate } from "@config";

import snack from "@hooks/useSnack";

interface useCommentMutationProps {
    fallbackData?: Reply;
    slug?: string;
}

export default function useCommentMutation({ fallbackData, slug }: useCommentMutationProps) {
    const url = useMemo(
        () => urlCat("/thread", { id: fallbackData?.id, slug }),
        [fallbackData?.id, slug]
    );

    const { data, mutate } = useSWR<Reply>(url, {
        ...SWRImmutable,
        revalidateOnMount: !fallbackData,
        fallbackData,
    });

    const isDeleted = !data?.author?.nickname;

    const onVote = (vote: "upvote" | "downvote") => {
        if (!data) return;

        const send = axios.put("/thread/reply/vote", { vote, id: data?.id }).then(x => x.data);

        const optimisticData = produce(data, draft => {
            switch (draft.votes.voted) {
                case "upvote":
                    draft.votes.upvotes--;
                    vote === "upvote" && draft.votes.upvotes++;
                    break;
                case "downvote":
                    draft.votes.downvotes--;
                    vote === "downvote" && draft.votes.downvotes++;
                    break;
            }
        });

        const populateCache = (added: any) =>
            produce(data, draft => {
                draft.votes = added;
            });

        mutate(send, {
            ...SWRMutate,
            optimisticData,
            populateCache,
        });
    };

    const onReport = async () => {
        if (!data?.description) return;
        if (!confirm("Report this comment ?")) return;

        await axios.post("/report/create", {
            type: data?.root ? "thread" : "comment",
            typeId: data?.id,
            summary: data?.description.slice(0, 100),
        });
        snack.success("Reported");
    };

    const onDelete = () => {
        if (!data) return;
        if (!confirm("Delete this comment ?")) return;

        const send = axios
            .delete(urlCat("/thread/reply/delete", { id: data?.id }))
            .then(x => x.data);

        const optimisticData = produce(data, draft => {
            draft.description = null;
            draft.author = null;
        });

        mutate(send, {
            ...SWRMutate,
            optimisticData,
        });
    };

    return {
        data,
        mutate,
        onVote,
        onReport,
        isDeleted,
        onDelete,
    };
}
