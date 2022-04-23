import { Result } from "../types";

export interface IPriceComparison {
    highest?: QuickResult | null;
    lowest?: QuickResult | null;
}

export interface PriceComparisonProps {
    total: IPriceComparison;
    compatible: IPriceComparison;
    baseline: Result | null;
}
