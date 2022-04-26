import useSWR from "swr";

export default function useLoggedIn() {
    const { data } = useSWR<any>("/user");
    return !!data?.nickname;
}
