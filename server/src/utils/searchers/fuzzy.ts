import { SearchResults } from "./types";

interface FuzzyProps {
    query: string;
    list: SearchResults[];
    type?: "all" | "pc";
}

// add a space to these to make sure they aren't in the game's name
// blacklisted words, will add more
const allFilter = [
    "bundle",
    "pack",
    "dlc",
    "membership",
    "vip",
    "pass",
    "soundtrack",
    "upgrade",
].map(x => ` ${x}`);
const pcFilter = [
    "xbox",
    "ps 1",
    "ps 2",
    "ps 3",
    "ps 4",
    "ps 5",
    "ps1",
    "ps2",
    "ps3",
    "ps4",
    "ps5",
]
    .map(x => ` ${x}`)
    .concat(allFilter);

const cleanRegex = /[^\w\s]/g;

export default async function Fuzzy({ list, query, type = "pc" }: FuzzyProps) {
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

        // filter based on the type =>
        // pc: blacklist console words
        // all: all :D
        let noBadWords = false;
        switch (type) {
            case "pc":
                noBadWords = !pcFilter.some(word => cleanName.includes(word));
                break;
            default:
                noBadWords = !allFilter.some(word => cleanName.includes(word));
                break;
        }

        // some extra params for the highest accuracy
        const isIncluded = cleanName.includes(cleanQuery);
        const atStart = cleanNameNoSpaces.indexOf(cleanQueryNoSpaces) === 0;
        const notFree = price.amount && price.amount > 0;

        return noBadWords && checkSequel && atStart && isIncluded && notFree;
    });
}
