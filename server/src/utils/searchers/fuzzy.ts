import { SearchResults } from "./types";

interface FuzzyProps {
    query: string;
    list: SearchResults[];
    type: "strict" | "fuzzy";
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
    // consoles
    "xbox",
    "ps1",
    "ps2",
    "ps3",
    "ps4",
    "ps5",
    "ps 1",
    "ps 2",
    "ps 3",
    "ps 4",
    "ps 5",
].map(x => ` ${x}`);

const cleanRegex = /[^\w\s]/g;

const isSequel = (string: string, query: string) => {
    const index = string.indexOf(query) + query.length;
    const [first] = string.slice(index).split("");
    return !isNaN(parseInt(first));
};

export default async function Fuzzy({ list, query, type }: FuzzyProps) {
    return list.filter(({ name, price }) => {
        const cleanName = name.toLowerCase().replace(cleanRegex, "");
        const cleanQuery = query.toLowerCase().replace(cleanRegex, "");

        const cleanNameNoSpaces = cleanName.replace(/ /g, "");
        const cleanQueryNoSpaces = cleanQuery.replace(/ /g, "");

        // fuzzy type props
        const blacklisted = blacklist.some(word => cleanName.includes(word));
        const notFree = price.amount && price.amount > 0;

        if (type === "fuzzy") {
            return !blacklisted && notFree;
        }

        // strict props
        const isIncluded = cleanName.includes(cleanQuery);
        const sequel = isSequel(cleanNameNoSpaces, cleanQueryNoSpaces);
        const atStart = cleanNameNoSpaces.indexOf(cleanQueryNoSpaces) === 0;

        return !blacklisted && !sequel && atStart && isIncluded && notFree;
    });
}
