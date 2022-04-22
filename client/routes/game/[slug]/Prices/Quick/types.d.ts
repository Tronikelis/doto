import { Result } from "../types";

export interface IPriceComparison {
    highest?: Result | null;
    lowest?: Result | null;
}

export interface PriceComparisonProps {
    total: IPriceComparison;
    compatible: IPriceComparison;
    baseline: Result | null;
}
