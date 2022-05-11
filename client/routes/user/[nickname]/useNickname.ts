import { useRouter } from "next/router";

export default function useNickname() {
    const {
        query: { nickname },
    } = useRouter();

    return nickname && String(nickname);
}
