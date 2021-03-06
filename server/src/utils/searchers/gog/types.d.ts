// Generated by https://quicktype.io

export interface GogResult {
    pages: number;
    productCount: number;
    products: Product[];
    filters: Filters;
}

export interface Filters {
    releaseDateRange: ReleaseDateRange;
    priceRange: PriceRange;
    genres: Feature[];
    languages: Feature[];
    systems: Feature[];
    tags: Feature[];
    discounted: boolean;
    features: Feature[];
    releaseStatuses: Feature[];
    types: string[];
    fullGenresList: FullGenresList[];
    fullTagsList: Feature[];
}

export interface Feature {
    slug: string;
    name: string;
}

export interface FullGenresList {
    name: string;
    slug: string;
    level: number;
}

export interface PriceRange {
    min: number;
    max: number;
    currency: Currency;
    decimalPlaces: number;
}

export enum Currency {
    Eur = "EUR",
}

export interface ReleaseDateRange {
    min: number;
    max: number;
}

export interface Product {
    id: string;
    slug: string;
    releaseDate: string;
    productType: string;
    title: string;
    coverHorizontal: string;
    coverVertical: string;
    developers: string[];
    publishers: string[];
    operatingSystems: OperatingSystem[];
    price: Price;
    productState: string;
    genres: Feature[];
    tags: Feature[];
    reviewsRating: number;
}

export enum OperatingSystem {
    Linux = "linux",
    Osx = "osx",
    Windows = "windows",
}

export interface Price {
    final: string;
    base: string;
    discount: null;
    finalMoney: Money;
    baseMoney: Money;
}

export interface Money {
    amount: string;
    currency: Currency;
}
