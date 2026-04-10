import { Filter, Pagination, Sort, FilterOptionValue, ControllerValue } from "./types/table";
import { DEFAULT_PAGE_SIZE } from "@/lib/constant";
import { create } from "zustand";

interface State {
    filter: Record<string, Filter>;
    sort: Record<string, Sort>;
    pagination: Pagination;
    selectedEtt: any;

    setFilter: (field: string, type: "string" | "number" | "date", operator: FilterOptionValue | null, value: any) => void;
    setSort: (column: string, value: "asc" | "desc" | undefined) => void;
    setPagination: (page: number, size: number) => void;
    setSelectedEtt: (selectedEtt: any) => void;
}

export const useStore = create<State>((set) => ({
    filter: {},
    sort: {},
    pagination: {
        page: 0,
        size: DEFAULT_PAGE_SIZE,
    },
    selectedEtt: null,

    setFilter: (field: string, type: "string" | "number" | "date", operator: FilterOptionValue | null, value: any) => set((state) => {
        const newFilter = { ...state.filter };
        if (!operator || !value) {
            delete newFilter[field];
        } else {
            newFilter[field] = { field, type, operator, value };
        }
        return { filter: newFilter };
    }),
    setSort: (column: string, value: "asc" | "desc" | undefined) => set((state) => {
        const newSort = { ...state.sort };
        if (!value) {
            delete newSort[column];
        } else {
            newSort[column] = { column, value };
        }
        return { sort: newSort };
    }),
    setPagination: (page: number, size: number) => set((state) => ({
        pagination: { page, size },
    })),
    setSelectedEtt: (selectedEtt: any) => set({ selectedEtt }),
}));