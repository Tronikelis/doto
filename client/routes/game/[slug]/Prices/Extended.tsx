import { AxiosPriceSearch } from "./types";

interface ExtendedProps {
    data?: AxiosPriceSearch;
}

export default function Extended({ data }: ExtendedProps) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
