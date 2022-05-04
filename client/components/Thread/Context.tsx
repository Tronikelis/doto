import { createContext } from "react";

interface ThreadContextProps {
    count: number;
    slug: string;
}

export const ThreadContext = createContext<ThreadContextProps>({
    count: 25,
    slug: "",
});

export function ThreadProvider({
    children,
    count,
    slug,
}: { children: any } & ThreadContextProps) {
    return <ThreadContext.Provider value={{ count, slug }}>{children}</ThreadContext.Provider>;
}
