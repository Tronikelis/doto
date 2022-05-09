import { createContext } from "react";

interface ThreadContextProps {
    count: number;
    slug: string;
    minimal: boolean;
}

export const ThreadContext = createContext<ThreadContextProps>({
    count: 25,
    slug: "",
    minimal: false,
});

export function ThreadProvider({
    children,
    count,
    slug,
    minimal,
}: { children: any } & ThreadContextProps) {
    return (
        <ThreadContext.Provider value={{ count, slug, minimal }}>
            {children}
        </ThreadContext.Provider>
    );
}
