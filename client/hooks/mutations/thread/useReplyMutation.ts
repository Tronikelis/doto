import axios from "axios";
import produce from "immer";
import type { SWRConfiguration } from "swr";
import useSWRInfinite from "swr/infinite";
import urlCat from "urlcat";

import { AxiosReplies } from "@types";

interface useReplyMutation {
    count: number;
    id?: string;
}

interface OnReplyProps {
    description: string;
    id?: string;
}

const getKey = ({ count, id }: useReplyMutation) => {
    // HOF to pass additional options
    return (index: number, previous: AxiosReplies | null) => {
        if (previous && !previous.next) return null;
        if (!id) return null;

        return urlCat("/thread/reply/replies", {
            id,
            count,
            page: index + 1,
        });
    };
};

export default function useReplyMutation(props: useReplyMutation, config?: SWRConfiguration) {
    // this doesn't get called on render be
    const { data, error, setSize, isValidating, mutate } = useSWRInfinite<AxiosReplies>(
        getKey(props),
        null,
        config
    );

    const loading = (!error && !data) || isValidating;

    const loadMore = () => {
        setSize(x => x + 1);
    };

    const reply = ({ description, id }: OnReplyProps) => {
        const send = axios
            .post("/thread/reply/create", {
                replyTo: id,
                description,
            })
            .then(x => x.data);

        mutate(async comments => {
            const data = await send;

            if (!comments) {
                return [
                    {
                        count: props.count,
                        page: 1,
                        next: false,
                        data: [data],
                    },
                ];
            }

            return produce(comments, draft => {
                draft[0].data.unshift(data);
            });
        }, false);
    };

    return {
        loading,
        data,
        loadMore,
        next: data ? data[data.length - 1].next : null,
        mutate,
        reply,
    };
}
