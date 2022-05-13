import { createContext } from "react";

interface ThreadContextProps {
    count: number;
    slug: string;
    minimal: boolean;
    opId?: string;
}

export const ThreadContext = createContext<ThreadContextProps>({
    count: 25,
    slug: "",
    minimal: false,
    opId: "",
});

export function ThreadProvider({
    children,
    count,
    slug,
    minimal,
    opId,
}: { children: any } & ThreadContextProps) {
    return (
        <ThreadContext.Provider value={{ opId, count, slug, minimal }}>
            {children}
        </ThreadContext.Provider>
    );
}
