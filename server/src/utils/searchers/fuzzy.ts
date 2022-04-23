import { SearchResults } from "./types";

interface FuzzyProps {
    query: string;
    list: SearchResults[];
}

// add spaces to these to make sure they aren't in the game's name
const badWords = ["bundle", "pack", "dlc", "membership", "vip", "pass"].map(x => ` ${x} `);

const cleanRegex = /[^\w\s]/g;

export default async function Fuzzy({ list, query }: FuzzyProps) {
    return list.filter(({ name, price }) => {
        const cleanName = name.toLowerCase().replace(cleanRegex, "");
        const cleanQuery = query.toLowerCase().replace(cleanRegex, "");

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
        const notFree = price.amount && price.amount > 0;

        return noBadWords && checkSequel && atStart && isIncluded && notFree;
    });
}
