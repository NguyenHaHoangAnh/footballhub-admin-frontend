import { FilterOptions, FilterCompare, FilterOperator } from "@/app/types/table";

export const SESSION_STATUS: Record<string, string> = {
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

export const FILTER_OPERATOR: Record<string, string> = {
    AND: "and",
    OR: "or",
}

export const IMAGE_FALLBACK: Record<string, string> = {
    flag: "/images/flags/no-flag.webp",
    logo: "/images/logos/no-logo.webp",
}

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export const DEFAULT_PAGE_SIZE = 10;

export const COMPETITION_TYPES: Record<string, string> = {
    LEAGUE: "LEAGUE",
    CUP: "CUP",
}

export const COMPETITION_TOTAL_MATCH_DAY: Record<string, number> = {
    PL: 38,
    FL1: 34,
    BL1: 34,
    SA: 38,
    PD: 38,
}

export const RESULT_STATUS: Record<string, string> = {
    WON: "W",
    DRAW: "D",
    LOST: "L",
}

export const MATCH_STATUS: Record<string, string> = {
    TIMED: "TIMED",
    LIVE: "LIVE",
    IN_PLAY: "IN_PLAY",
    PAUSE: "PAUSE",
    FINISHED: "FINISHED",
    POSTPONED: "POSTPONED",
    SUSPENDED: "SUSPENDED",
    CANCELLED: "CANCELLED",
}