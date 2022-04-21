// Generated by https://quicktype.io

export interface AxiosPriceSearch {
    country: string;
    currency: string;
    query: string;
    baseline: Baseline[];
    thirdParty: ThirdParty[];
}

export interface ThirdParty {
    provider: string;
    result: Result[];
}

export interface Baseline extends ThirdParty {
    result: Result;
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
