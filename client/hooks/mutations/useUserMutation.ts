import axios from "axios";
import produce from "immer";
import useSWR from "swr/immutable";

import { SWRMutate } from "@config";

import type { LoginArgs } from "@routes/auth/login";
import type { RegisterArgs } from "@routes/auth/register";

export interface User {
    nickname: string;
    email: string;
    avatar: string;
    createdAt: string;
    attributes: {
        admin: boolean;
        verified: boolean;
    };
    id: string;
}

export default function useUserMutation() {
    const { data: user, mutate } = useSWR<User | Record<string, never>>("/user");

    const logout = () => {
        return mutate(
            axios.post("/auth/logout").then(x => x.data),
            {
                ...SWRMutate,
                optimisticData: {},
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

    const changeAvatar = (img: string) => {
        if (!user?.avatar) return;
        return mutate(
            axios.put("/user/avatar", { img }).then(x => x.data),
            {
                ...SWRMutate,
                optimisticData: produce(user, draft => {
                    (draft.avatar as any) = user;
                }),
            }
        );
    };

    return {
        login,
        logout,
        register,
        user,
        validateNickname,
        changeAvatar,
    };
}
