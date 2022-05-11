import axios from "axios";
import { useMemo } from "react";
import useSWR from "swr";
import urlCat from "urlcat";

import { SWRMutate } from "@config";

import type { LoginArgs } from "@routes/auth/login";
import type { RegisterArgs } from "@routes/auth/register";

export interface User {
    nickname: string;
    avatar: string;
    createdAt: string;
    attributes?: {
        admin: boolean;
        verified: boolean;
    };
    id: string;
    owner: boolean;
}

export default function useUserMutation(nickname?: string) {
    const { data: user } = useSWR<User>("/user");
    const url = useMemo(() => {
        if (!user && !nickname) return null;
        return urlCat("/user/info/:nickname", { nickname: nickname || user?.nickname });
    }, [nickname, user]);

    const { data, mutate } = useSWR<User>(url);

    const logout = () => {
        return mutate(
            axios.post("/auth/logout").then(x => x.data),
            {
                ...SWRMutate,
                optimisticData: null as any,
            }
        );
    };

    const login = (data: LoginArgs) => {
        return mutate(axios.post("/auth/login", data).then(x => x.data));
    };

    const register = (data: RegisterArgs) => {
        return axios.post("/auth/register", data);
    };

    const validateNickname = async (nickname: string) => {
        const { data } = await axios.post<boolean>("/validate/nickname", { nickname });
        return data || "This nickname is already taken, sorry";
    };

    return {
        data,
        actions: {
            login,
            logout,
            register,
            validateNickname,
        },
    };
}
