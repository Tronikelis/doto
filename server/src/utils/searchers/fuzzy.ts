import fuzzysort from "fuzzysort";

interface FuzzyProps<T> {
    query: string;
    list: T[];
    options?: Fuzzysort.Options;
}

// play around with these settings
const defaultOptions: Fuzzysort.Options = {
    allowTypo: false,
    limit: 10,
    threshold: -30,
};

export default async function Fuzzy<T>({
    list,
    query,
    options = defaultOptions,
}: FuzzyProps<T>): Promise<T[]> {
    const result = await fuzzysort.goAsync(query, list, {
        ...defaultOptions,
        ...options,
        key: "name",
    });

    return result.reduce((prev: any, { obj }) => [...prev, obj], []);
}
