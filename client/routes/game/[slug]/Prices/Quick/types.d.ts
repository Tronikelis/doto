import { Result, ResultWProvider } from "@hooks/usePrices/types";

export interface IPriceComparison {
    highest?: ResultWProvider | null;
    lowest?: ResultWProvider | null;
}

export interface PriceComparisonProps {
    total: IPriceComparison;
    compatible: IPriceComparison;
    baseline: Result | null;
}
