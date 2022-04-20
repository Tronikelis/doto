import { proxy } from "valtio";
import { derive } from "valtio/utils";

interface IndexStore {
    filters: {
        ordering: string;
        dates: number;
    };
}

export const store = proxy<IndexStore>({
    filters: {
        ordering: "-added",
        dates: -2,
    },
});

// translate this into querystring
export const computedQuery = derive({
    ordering: get => get(store).filters.ordering,
    dates: get => {
        const { dates } = get(store).filters;

        if (dates > 0) {
            return `0,${dates}`;
        }

        if (dates < 0) {
            return `${dates},0`;
        }

        return "0,0";
    },
});

export const actions = {
    setOrdering: (ordering: string) => {
        store.filters.ordering = ordering;
    },
    setDates: (dates: number) => {
        store.filters.dates = dates;
    },
};
