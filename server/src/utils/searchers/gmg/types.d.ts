// Generated by https://quicktype.io

export interface GMGResult {
    results: Result[];
}

export interface Result {
    hits: Hit[];
    nbHits: number;
    page: number;
    nbPages: number;
    hitsPerPage: number;
    facets: Facets;
    facets_stats: FacetsStats;
    exhaustiveFacetsCount: boolean;
    exhaustiveNbHits: boolean;
    exhaustiveTypo: boolean;
    query: string;
    params: string;
    index: string;
    queryID: string;
    renderingContent: RenderingContent;
    processingTimeMS: number;
}

export interface Facets {
    Genre: GenreClass;
    DrmName: DRMName;
    Franchise: Franchise;
    PlatformName: PlatformName;
    IsEarlyAccess: IsEarlyAccess;
    PublisherName: PublisherName;
    "Regions.LT.Drp": { [key: string]: number };
    "Regions.LT.IsOnSale": RegionsLTIsOnSale;
    "Regions.LT.ReleaseDateStatus": RegionsLTReleaseDateStatus;
}

export interface DRMName {
    Steam: number;
}

export interface Franchise {
    "Elden Ring"?: number;
    "Elven Legacy"?: number;
}

export interface GenreClass {
    Action?: number;
    RPG?: number;
    Strategy?: number;
}

export interface IsEarlyAccess {
    false: number;
}

export interface PlatformName {
    PC: number;
}

export interface PublisherName {
    "BANDAI NAMCO Entertainment"?: number;
    "1C Company"?: number;
}

export interface RegionsLTIsOnSale {
    true?: number;
    false?: number;
}

export interface RegionsLTReleaseDateStatus {
    InStock: number;
}

export interface FacetsStats {
    "Regions.LT.Drp": RegionsLTDrp;
}

export interface RegionsLTDrp {
    min: number;
    max: number;
    avg: number;
    sum: number;
}

export interface Hit {
    GameVariantId: number;
    ProviderName: string;
    DisplayName: string;
    Url: string;
    ImageUrl: string;
    PlatformId: string;
    PlatformName: string[];
    PublisherId: number;
    IsSellable: boolean;
    ExcludeCountryCodes: string[] | null;
    SupportedVrs: null;
    MobilePages: any[];
    BestSellingRank: number;
    SteamAppId: string;
    DrmName: string;
    IsMultiBuy: boolean;
    IsFreeToPlay: boolean;
    IsEarlyAccess: boolean;
    RoyaltyCode: string;
    IsSellableOnMobile: boolean;
    Genre: GenreElement[];
    Franchise: string;
    IsDlc: boolean;
    StartPublishTimestamp: number;
    StopPublishTimestamp: number;
    IndexTimestamp: number;
    ProductId: number;
    RegionalRelatedVariantsByDrmId: RegionalRelatedVariants;
    OutOfStockRegions: OutOfStockRegions;
    DrmOrder: number;
    Regions: Regions;
    FreeToPlayLink: string;
    AvailableRegions: AvailableRegion[];
    CampaignName: CampaignName[];
    PublisherName: string;
    DrmId: string;
    UpdatedBy: string;
    SearchScore: number;
    RegionalRelatedVariants: RegionalRelatedVariants;
    objectID: string;
    _highlightResult: HighlightResult;
    RelatedVariants?: any[];
    ShowMoreDrms?: boolean;
}

export enum AvailableRegion {
    Li = "LI",
    Lt = "LT",
}

export enum CampaignName {
    BasePrice = "base_price",
    NcGmgXP13Apr22 = "NC_GMG_XP_13APR22",
}

export enum GenreElement {
    Action = "Action",
    RPG = "RPG",
    Strategy = "Strategy",
}

export interface OutOfStockRegions {
    LI: boolean;
    LT: boolean;
}

export interface RegionalRelatedVariants {
    LI: any[];
    LT: any[];
}

export interface Regions {
    LI: Li;
    LT: Li;
}

export interface Li {
    IsComingSoon: boolean;
    CountryCode: AvailableRegion;
    CurrencyCode: CurrencyCode;
    Mrp: number;
    Rrp: number;
    Drp: number;
    ReleaseDateDisplayText: ReleaseDateDisplayText;
    ReleaseDate: number;
    UnlockDate: number | null;
    IsHideMrp: boolean;
    IsHideDrp: boolean;
    CornerFlashColor: null;
    CornerFlashBackgroundColor: null;
    CornerFlashText: null;
    CornerFlashCustomDesign: null;
    CornerFlashIcon: CornerFlashIcon;
    CornerFlashIconDesign: string;
    CornerFlashOverrideVip: boolean;
    CornerFlashVipUsersOnly: boolean;
    HasCornerFlash: boolean;
    CampaignName: CampaignName;
    IsXpOffer: boolean;
    IsOnSale: boolean;
    IsOnSaleVip: boolean;
    ReleaseDateStatus: ReleaseDateStatus;
    ReleaseDateForSort: number;
    DrpDiscountPercentage: number;
    MrpDiscountPercentage: number;
}

export enum CornerFlashIcon {
    BackgroundURLStaticImgXPOfferSVGNoRepeat = "background: url(/static/img/XP_Offer.svg) no-repeat;",
}

export enum CurrencyCode {
    Eur = "EUR",
    Usd = "USD",
}

export enum ReleaseDateDisplayText {
    The03December2009 = "03 December 2009",
    The24February2022 = "24 February 2022",
}

export enum ReleaseDateStatus {
    InStock = "InStock",
}

export interface HighlightResult {
    DisplayName: DisplayName;
}

export interface DisplayName {
    value: string;
    matchLevel: string;
    fullyHighlighted: boolean;
    matchedWords: MatchedWord[];
}

export enum MatchedWord {
    Elden = "elden",
    Ring = "ring",
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RenderingContent {}
