// Generated by https://quicktype.io

export interface AxiosNotifications {
    count: number;
    page: number;
    next: boolean;
    data: Datum[];
}

export interface Datum {
    sender: Receiver;
    receiver: Receiver;
    read: boolean;
    type: string;
    title: string;
    summary: null;
    href: string;
    date: string;
    id: string;
}

export interface Receiver {
    avatar: string;
    nickname: string;
    id: string;
}
