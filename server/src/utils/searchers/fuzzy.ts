import { SearchResults } from "./types";

interface FuzzyProps {
    query: string;
    list: SearchResults[];
}

const cleanRegex = /[^\w\s]/g;

const badWords = ["bundle", "pack", "dlc", "xbox", "ps 1", "ps 2", "ps 3", "ps 4", "ps 5"];

export default async function Fuzzy({ list, query }: FuzzyProps) {
    return list.filter(({ name, price }) => {
        const cleanName = name.replace(cleanRegex, "").toLowerCase();
        const cleanQuery = query.replace(cleanRegex, "").toLowerCase();

        const cleanNameNoSpaces = cleanName.replace(/ /g, "");
        const cleanQueryNoSpaces = cleanQuery.replace(/ /g, "");

        // upgrade this somehow
        // true if it is a number
        const checkSequel = isNaN(
            cleanNameNoSpaces.slice(
                cleanNameNoSpaces.indexOf(cleanQueryNoSpaces) + cleanQueryNoSpaces.length
            )[0] as any
        );

        // params
        const isIncluded = cleanName.includes(cleanQuery);
        const noBadWords = !badWords.some(word => cleanName.includes(word));
        const atStart = cleanNameNoSpaces.indexOf(cleanQueryNoSpaces) === 0;
        const notFree = price.amount > 0;

        return noBadWords && checkSequel && atStart && isIncluded && notFree;
    });
}
