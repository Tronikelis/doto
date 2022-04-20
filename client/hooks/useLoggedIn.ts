import useSWR from "swr/immutable";

export default function useLoggedIn() {
    const { data } = useSWR<any>("/user");
    return !!data?.nickname;
}
