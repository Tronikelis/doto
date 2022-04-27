export const SWRImmutable = {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
};

export const RAWG_BASE = "https://api.rawg.io/api";

export const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export const SWRMutate = {
    rollbackOnError: true,
    revalidate: false,
    populateCache: true,
};

export const removeNewlines = /([ \t]*\n){3,}/g;

export const removeSpaces = / +(?= )/g;
