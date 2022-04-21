import { SearchResults } from "./types";

interface FuzzyProps {
    query: string;
    list: SearchResults[];
}

const cleanRegex = /[^\w\s]/g;

const badWords = ["bundle", "pack", "dlc"];

export default async function Fuzzy({ list, query }: FuzzyProps) {
    return list.filter(({ name }) => {
        const cleanName = name.replace(cleanRegex, "").toLowerCase();
        const cleanQuery = query.replace(cleanRegex, "").toLowerCase();
        return (
            cleanName.includes(cleanQuery) && !badWords.some(word => cleanName.includes(word))
        );
    });
}
