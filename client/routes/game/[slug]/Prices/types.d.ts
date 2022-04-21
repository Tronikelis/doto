// Generated by https://quicktype.io

export interface AxiosPriceSearch {
    country: string;
    currency: string;
    query: string;
    prices: PriceElement[];
}

export interface PriceElement {
    provider: string;
    result: Result[];
}

export interface Result {
    link: string;
    name: string;
    image: string;
    price: ResultPrice;
    regions: string[];
    inRegion: boolean;
}

export interface ResultPrice {
    amount: number;
    currency: string;
}
