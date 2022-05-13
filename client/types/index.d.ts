export interface PageProps {
    fallback: any;
    error?: {
        status: string;
        data: string;
    };
}

// Generated by https://quicktype.io
export interface AxiosGameScreenshots {
    count: number;
    next: null;
    previous: null;
    results: ResultGameScreenshots[];
}

export interface ResultGameScreenshots {
    id: number;
    image: string;
    width: number;
    height: number;
    is_deleted: boolean;
}

// Generated by https://quicktype.io
export interface AxiosGames {
    count: number;
    next: boolean;
    previous: boolean;
    results: ResultGames[];
    user_platforms: boolean;
}

export interface ResultGames {
    background_image: string;
    slug: string;
    name: string;
    playtime: number;
    platforms: PlatformGames[];
    stores: StoreGames[];
    released: string;
    tba: boolean;
    rating: number;
    rating_top: number;
    ratings: RatingGames[];
    ratings_count: number;
    reviews_text_count: number;
    added: number;
    added_by_status: AddedByStatusGames;
    metacritic: number | null;
    suggestions_count: number;
    updated: string;
    id: number;
    score: null;
    clip: ClipGames | null;
    tags: TagGames[];
    esrb_rating: EsrbRatingGames | null;
    user_game: null;
    reviews_count: number;
    saturated_color: ColorGames;
    dominant_color: ColorGames;
    short_screenshots: ShortScreenshotGames[];
    parent_platforms: PlatformGames[];
    genres: GenreGames[];
}

export interface AddedByStatusGames {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped?: number;
    playing?: number;
}

export interface ClipGames {
    clip: string;
    clips: { [key: string]: string };
    video: string;
    preview: string;
}

export enum ColorGames {
    The0F0F0F = "0f0f0f",
}

export interface EsrbRatingGames {
    id: number;
    name: string;
    slug: string;
    name_en: string;
    name_ru: string;
}

export interface GenreGames {
    id: number;
    name: string;
    slug: string;
}

export interface PlatformGames {
    platform: GenreGames;
}

export interface RatingGames {
    id: number;
    title: TitleGames;
    count: number;
    percent: number;
}

export enum TitleGames {
    Exceptional = "exceptional",
    Meh = "meh",
    Recommended = "recommended",
    Skip = "skip",
}

export interface ShortScreenshotGames {
    id: number;
    image: string;
}

export interface StoreGames {
    store: GenreGames;
}

export interface TagGames {
    id: number;
    name: string;
    slug: string;
    language: LanguageGames;
    games_count: number;
    image_background: string;
}

export enum LanguageGames {
    Eng = "eng",
    Rus = "rus",
}

// Generated by https://quicktype.io
export interface AxiosGame {
    id: number;
    slug: string;
    name: string;
    name_original: string;
    description: string;
    metacritic: number;
    metacritic_platforms: MetacriticPlatformGame[];
    released: string;
    tba: boolean;
    updated: string;
    background_image: string;
    background_image_additional: string;
    website: string;
    rating: number;
    rating_top: number;
    ratings: RatingGame[];
    reactions: { [key: string]: number };
    added: number;
    added_by_status: AddedByStatusGame;
    playtime: number;
    screenshots_count: number;
    movies_count: number;
    creators_count: number;
    achievements_count: number;
    parent_achievements_count: number;
    reddit_url: string;
    reddit_name: string;
    reddit_description: string;
    reddit_logo: string;
    reddit_count: number;
    twitch_count: number;
    youtube_count: number;
    reviews_text_count: number;
    ratings_count: number;
    suggestions_count: number;
    alternative_names: any[];
    metacritic_url: string;
    parents_count: number;
    additions_count: number;
    game_series_count: number;
    user_game: null;
    reviews_count: number;
    saturated_color: string;
    dominant_color: string;
    parent_platforms: ParentPlatformGame[];
    platforms: PlatformElementGame[];
    stores: Game[];
    developers: DeveloperGame[];
    genres: DeveloperGame[];
    tags: DeveloperGame[];
    publishers: DeveloperGame[];
    esrb_rating: EsrbRatingGame;
    clip: ClipGame;
    description_raw: string;
}

export interface AddedByStatusGame {
    yet: number;
    owned: number;
    beaten: number;
    toplay: number;
    dropped: number;
    playing: number;
}

export interface ClipGame {
    clip: string;
    clips: { [key: string]: string };
    video: string;
    preview: string;
}

export interface DeveloperGame {
    id: number;
    name: string;
    slug: string;
    games_count: number;
    image_background: string;
    domain?: string;
    language?: LanguageGame;
}

export enum LanguageGame {
    Eng = "eng",
}

export interface EsrbRatingGame {
    id: number;
    name: string;
    slug: string;
}

export interface MetacriticPlatformGame {
    metascore: number;
    url: string;
    platform: MetacriticPlatformPlatformGame;
}

export interface MetacriticPlatformPlatformGame {
    platform: number;
    name: string;
    slug: string;
}

export interface ParentPlatformGame {
    platform: EsrbRatingGame;
}

export interface PlatformElementGame {
    platform: PlatformPlatformGame;
    released_at: string;
    requirements: RequirementsGame;
}

export interface PlatformPlatformGame {
    id: number;
    name: string;
    slug: string;
    image: null;
    year_end: null;
    year_start: number | null;
    games_count: number;
    image_background: string;
}

export interface RequirementsGame {
    minimum?: string;
    recommended?: string;
}

export interface RatingGame {
    id: number;
    title: string;
    count: number;
    percent: number;
}

export interface Game {
    id: number;
    url: string;
    store: DeveloperGame;
}

// Generated by https://quicktype.io

export interface AxiosRedditTop {
    kind: string;
    data: AxiosRedditTopData;
}

export interface AxiosRedditTopData {
    after: string;
    dist: number;
    modhash: string;
    geo_filter: string;
    children: Child[];
    before: null;
}

export interface Child {
    kind: Kind;
    data: ChildData;
}

export interface ChildData {
    approved_at_utc: null;
    subreddit: string;
    selftext: string;
    author_fullname: string;
    saved: boolean;
    mod_reason_title: null;
    gilded: number;
    clicked: boolean;
    title: string;
    link_flair_richtext: FlairRichtext[];
    subreddit_name_prefixed: string;
    hidden: boolean;
    pwls: number;
    link_flair_css_class: string;
    downs: number;
    thumbnail_height: number | null;
    top_awarded_type: null;
    hide_score: boolean;
    name: string;
    quarantine: boolean;
    link_flair_text_color: FlairTextColor;
    upvote_ratio: number;
    author_flair_background_color: null | string;
    subreddit_type: SubredditType;
    ups: number;
    total_awards_received: number;
    media_embed: MediaEmbed;
    thumbnail_width: number | null;
    author_flair_template_id: null | string;
    is_original_content: boolean;
    user_reports: any[];
    secure_media: Media | null;
    is_reddit_media_domain: boolean;
    is_meta: boolean;
    category: null;
    secure_media_embed: MediaEmbed;
    link_flair_text: string;
    can_mod_post: boolean;
    score: number;
    approved_by: null;
    is_created_from_ads_ui: boolean;
    author_premium: boolean;
    thumbnail: string;
    edited: boolean | number;
    author_flair_css_class: null | string;
    author_flair_richtext: FlairRichtext[];
    gildings: Gildings;
    post_hint?: PostHint;
    content_categories: null;
    is_self: boolean;
    mod_note: null;
    created: number;
    link_flair_type: AuthorFlairType;
    wls: number;
    removed_by_category: null;
    banned_by: null;
    author_flair_type: AuthorFlairType;
    domain: Domain;
    allow_live_comments: boolean;
    selftext_html: null | string;
    likes: null;
    suggested_sort: null;
    banned_at_utc: null;
    view_count: null;
    archived: boolean;
    no_follow: boolean;
    is_crosspostable: boolean;
    pinned: boolean;
    over_18: boolean;
    preview?: Preview;
    all_awardings: AllAwarding[];
    awarders: any[];
    media_only: boolean;
    link_flair_template_id: string;
    can_gild: boolean;
    spoiler: boolean;
    locked: boolean;
    author_flair_text: null | string;
    treatment_tags: any[];
    visited: boolean;
    removed_by: null;
    num_reports: null;
    distinguished: null;
    subreddit_id: SubredditID;
    author_is_blocked: boolean;
    mod_reason_by: null;
    removal_reason: null;
    link_flair_background_color: string;
    id: string;
    is_robot_indexable: boolean;
    report_reasons: null;
    author: string;
    discussion_type: null;
    num_comments: number;
    send_replies: boolean;
    whitelist_status: WhitelistStatus;
    contest_mode: boolean;
    mod_reports: any[];
    author_patreon_flair: boolean;
    author_flair_text_color: FlairTextColor | null;
    permalink: string;
    parent_whitelist_status: WhitelistStatus;
    stickied: boolean;
    url: string;
    subreddit_subscribers: number;
    created_utc: number;
    num_crossposts: number;
    media: Media | null;
    is_video: boolean;
    url_overridden_by_dest?: string;
}

export interface AllAwarding {
    giver_coin_reward: number | null;
    subreddit_id: null;
    is_new: boolean;
    days_of_drip_extension: number;
    coin_price: number;
    id: ID;
    penny_donate: number | null;
    award_sub_type: AwardSubType;
    coin_reward: number;
    icon_url: string;
    days_of_premium: number;
    tiers_by_required_awardings: null;
    resized_icons: ResizedIcon[];
    icon_width: number;
    static_icon_width: number;
    start_date: null;
    is_enabled: boolean;
    awardings_required_to_grant_benefits: null;
    description: string;
    end_date: null;
    subreddit_coin_reward: number;
    count: number;
    static_icon_height: number;
    name: Name;
    resized_static_icons: ResizedIcon[];
    icon_format: null | string;
    icon_height: number;
    penny_price: number | null;
    award_type: AwardType;
    static_icon_url: string;
}

export enum AwardSubType {
    Global = "GLOBAL",
}

export enum AwardType {
    Global = "global",
}

export enum ID {
    Award2Ae56630Cfe0424EB8104945B9145358 = "award_2ae56630-cfe0-424e-b810-4945b9145358",
    Award43F3Bf9992D647Ab8205130D26E7929F = "award_43f3bf99-92d6-47ab-8205-130d26e7929f",
    Award5F123E3D4F4842F49C11E98B566D5897 = "award_5f123e3d-4f48-42f4-9c11-e98b566d5897",
    Award88Fdcafc57A048DB99Cc76276Bfaf28B = "award_88fdcafc-57a0-48db-99cc-76276bfaf28b",
    AwardF44611F1B89E46Dc97Fe892280B13B82 = "award_f44611f1-b89e-46dc-97fe-892280b13b82",
    Gid1 = "gid_1",
}

export enum Name {
    Helpful = "Helpful",
    HelpfulPro = "Helpful (Pro)",
    PressF = "Press F",
    Silver = "Silver",
    TearingUp = "Tearing Up",
    Wholesome = "Wholesome",
}

export interface ResizedIcon {
    url: string;
    width: number;
    height: number;
}

export interface FlairRichtext {
    e: AuthorFlairType;
    t: string;
}

export enum AuthorFlairType {
    Richtext = "richtext",
    Text = "text",
}

export enum FlairTextColor {
    Dark = "dark",
    Light = "light",
}

export enum Domain {
    IReddIt = "i.redd.it",
    SteamdbInfo = "steamdb.info",
    VReddIt = "v.redd.it",
}

export interface Gildings {
    gid_1?: number;
}

export interface Media {
    reddit_video: RedditVideo;
}

export interface RedditVideo {
    bitrate_kbps: number;
    fallback_url: string;
    height: number;
    width: number;
    scrubber_media_url: string;
    dash_url: string;
    duration: number;
    hls_url: string;
    is_gif: boolean;
    transcoding_status: string;
}

type MediaEmbed = object;

export enum WhitelistStatus {
    SomeAds = "some_ads",
}

export enum PostHint {
    HostedVideo = "hosted:video",
    Image = "image",
    Self = "self",
}

export interface Preview {
    images: Image[];
    enabled: boolean;
}

export interface Image {
    source: ResizedIcon;
    resolutions: ResizedIcon[];
    variants: MediaEmbed;
    id: string;
}

export enum SubredditID {
    T53Gnpj = "t5_3gnpj",
}

export enum SubredditType {
    Public = "public",
}

export enum Kind {
    T3 = "t3",
}

// Generated by https://quicktype.io
export interface AxiosDenuvoUpdates {
    next: boolean;
    items: ItemDenuvoUpdates[];
}

export interface ItemDenuvoUpdates {
    img: string;
    status: string;
    date: string;
    price: string;
    steam: string;
}

// Generated by https://quicktype.io
export interface AxiosThread {
    count: number;
    page: number;
    next: boolean;
    data: Reply[];
}

export interface Author {
    id: string;
    nickname: string;
    avatar: string;
}

export interface Reply {
    id: string;
    description: Description;
    rootId: ReplyTo;
    root: {
        title: string;
        slug: string;
        image?: string;
        variant: "home" | "explore";
    } | null;
    author: Author | null;
    replyTo: ReplyTo;
    replies: Reply[];
    hasReplies: boolean;
    votes: Votes;
    replyCount: boolean;
    date: string;
    depth: number;
}

export interface Votes {
    upvotes: number;
    downvotes: number;
    voted: null | "upvote" | "downvote";
}

export interface AxiosThreads {
    count: string;
    page: string;
    next: boolean;
    data: Reply[];
}
