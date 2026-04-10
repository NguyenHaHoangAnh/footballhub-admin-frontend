export type ColumnType = "string" | "number" | "date";

export type Column<T> = {
    title: string;
    key?: keyof T;
    type?: ColumnType;
    render?: (value: any, record: T) => React.ReactNode;
};

export type Filter = {
    field: string;
    type: "string" | "number" | "date";
    operator: FilterOptionValue;
    value: any;
}

export type FilterOptionValue = "contains" | "equals" | "neq" | "startswith" | "endswith" | "gt" | "gte" | "lt" | "lte";

export type FilterValue = {
    field: string;
    type: "string" | "number" | "date";
    operator: FilterOptionValue;
    value: any;
}

export type Pagination = {
    page: number;
    size: number;
}

export type Sort = {
    column: string;
    value: "asc" | "desc" | undefined;
}

export type ControllerValue = "C" | "R" | "U" | "D";