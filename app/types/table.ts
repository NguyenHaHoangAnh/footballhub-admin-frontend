export type FilterCompare = "contains" | "equals" | "neq" | "startswith" | "endswith" | "gt" | "gte" | "lt" | "lte";

export type FilterOperator = "and" | "or";

export type Filter = {
    field: string;
    type: "string" | "number" | "date";
    compare: FilterCompare | null;
    value: any;
    operator?: FilterOperator;
}

export type FilterOptions = {
    string: { label: string; value: FilterCompare; }[],
    number: { label: string; value: FilterCompare; }[],
    date: { label: string; value: FilterCompare; }[],
}

export type Pagination = {
    page: number;
    size: number;
}

export type Sort = {
    column: string;
    value: "asc" | "desc" | undefined;
}