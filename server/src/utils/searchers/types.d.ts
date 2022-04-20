export interface SearchResults {
    name: string;
    image: string;
    link: string;
    price: {
        amount: number;
        currency: string;
    };
    regions: string[];
    inRegion: boolean;
}

export interface FetchPriceProps {
    currency?: string;
    country?: string;
    query: string;
}
