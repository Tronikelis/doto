import { createContext } from "react";

interface ThreadContextProps {
    count: number;
    threadId?: string;
    slug?: string;
}

export const ThreadContext = createContext<ThreadContextProps>({
    count: 25,
    threadId: "",
});

export function ThreadProvider({
    children,
    count,
    threadId,
    slug,
}: { children: any } & ThreadContextProps) {
    return (
        <ThreadContext.Provider value={{ count, threadId, slug }}>
            {children}
        </ThreadContext.Provider>
    );
}
