import { FilterOptions, FilterCompare, FilterOperator } from "@/app/types/table";

export const SESSION_STATUS = {
    LOADING: "loading",
    AUTHENTICATED: "authenticated",
    UNAUTHENTICATED: "unauthenticated",
}

export const FILTER_OPTIONS: FilterOptions = {
    string: [
        { label: "common:filter.contains", value: "contains" },
        { label: "common:filter.equals", value: "equals" },
        { label: "common:filter.neq", value: "neq" },
        { label: "common:filter.startswith", value: "startswith" },
        { label: "common:filter.endswith", value: "endswith" },
    ],
    number: [
        { label: "common:filter.equals", value: "equals" },
        { label: "common:filter.gt", value: "gt" },
        { label: "common:filter.gte", value: "gte" },
        { label: "common:filter.lt", value: "lt" },
        { label: "common:filter.lte", value: "lte" },
    ],
    date: [
        { label: "common:filter.equals", value: "equals" },
        { label: "common:filter.gt", value: "gt" },
        { label: "common:filter.gte", value: "gte" },
        { label: "common:filter.lt", value: "lt" },
        { label: "common:filter.lte", value: "lte" },
    ],
}

export const FILTER_OPERATOR = {
    AND: "and",
    OR: "or",
}

export const IMAGE_FALLBACK = {
    flag: "/images/flags/no-flag.webp",
    logo: "/images/logos/no-logo.webp",
}

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_PAGE_SIZE = 10;

export const COMPETITION_TYPES = {
    LEAGUE: "LEAGUE",
    CUP: "CUP",
}

export const RESULT_STATUS = {
    WON: "W",
    DRAW: "D",
    LOST: "L",
}