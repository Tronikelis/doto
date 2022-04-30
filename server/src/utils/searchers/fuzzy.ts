import { SearchResults } from "./types";

interface FuzzyProps {
    query: string;
    list: SearchResults[];
}

// add a space to these to make sure they aren't in the game's name
// blacklisted words, will add more
const blacklist = [
    "bundle",
    "pack",
    "dlc",
    "membership",
    "vip",
    "pass",
    "soundtrack",
    "upgrade",
].map(x => ` ${x}`);

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

        // some extra params for the highest accuracy
        const blacklisted = blacklist.some(word => cleanName.includes(word));
        const isIncluded = cleanName.includes(cleanQuery);
        // disable on extended search
        const atStart = cleanNameNoSpaces.indexOf(cleanQueryNoSpaces) === 0;
        const notFree = price.amount && price.amount > 0;

        return !blacklisted && atStart && checkSequel && isIncluded && notFree;
    });
}
