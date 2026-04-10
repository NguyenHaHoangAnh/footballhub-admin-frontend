export type FilterOptionValue = "contains" | "equals" | "neq" | "startswith" | "endswith" | "gt" | "gte" | "lt" | "lte";

export type Filter = {
    field: string;
    type: "string" | "number" | "date";
    operator: FilterOptionValue | null;
    value: any;
}

export type FilterOptions = {
    string: { label: string; value: FilterOptionValue; }[],
    number: { label: string; value: FilterOptionValue; }[],
    date: { label: string; value: FilterOptionValue; }[],
}

export type Pagination = {
    page: number;
    size: number;
}

export type Sort = {
    column: string;
    value: "asc" | "desc" | undefined;
}