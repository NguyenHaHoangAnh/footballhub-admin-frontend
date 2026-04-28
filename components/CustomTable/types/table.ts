export type ColumnType = "string" | "number" | "date";

type Primitive = string | number | boolean | Date | null | undefined;

type DeepKeys<T> = T extends Primitive
    ? never
        : {
            [K in keyof T & string]:
                T[K] extends Primitive
                    ? K
                    : K | `${K}.${DeepKeys<T[K]>}`
        }[keyof T & string];

export type Column<T> = {
    title: string;
    key?: DeepKeys<T>;
    type?: ColumnType;
    render?: (value: any, record: T) => React.ReactNode;
};

export type FilterCompare = "contains" | "equals" | "neq" | "startswith" | "endswith" | "gt" | "gte" | "lt" | "lte";

export type FilterOperator = "and" | "or";

export type Filter = {
    field: string;
    type: "string" | "number" | "date";
    compare: FilterCompare;
    value: any;
    operator?: FilterOperator;
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