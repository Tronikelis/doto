// Generated by https://quicktype.io

export interface MongoAggregationComments {
    _id: number;
    count: number;
    data: Datum[];
}

export interface Datum {
    _id: IDEnum;
    deepReplies: DeepReplies;
}

export enum IDEnum {
    The6274202A6B346659207C29CF = "6274202a6b346659207c29cf",
}

export interface DeepReplies {
    id: string;
    description: string;
    rootId: IDEnum | null;
    root: Root | null;
    author: Author;
    replyTo: null | string;
    replies: [];
    hasReplies: boolean;
    votes: Votes;
    date: string;
    depth: number;
}

export interface Author {
    avatar: string;
    nickname: Nickname;
    id: AuthorID;
}

export enum AuthorID {
    The626E7569B48Beadf4E36F22B = "626e7569b48beadf4e36f22b",
}

export enum Nickname {
    Tronikel = "Tronikel",
}

export interface Root {
    title: string;
    slug: string;
    image: null;
    variant: string;
    id: string;
}

export interface Votes {
    upvotes: number;
    downvotes: number;
    voted: null | string;
}
