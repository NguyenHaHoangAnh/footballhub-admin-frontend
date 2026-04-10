"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useStore } from "./store";

type SortItem = {
    value: "asc" | "desc" | undefined,
    icon: any,
}

export default function CustomSort({
    field
}: {
    field: string;
}) {
    const {
        sort,
        setSort,
    } = useStore();
    const sortItems: SortItem[] = [
        { value: undefined, icon: <ChevronsUpDown className="w-4 h-4" /> },
        { value: "asc", icon: <ChevronDown className="w-4 h-4" /> },
        { value: "desc", icon: <ChevronUp className="w-4 h-4" /> },
    ];
    const initIndex = sortItems.findIndex((item) => item.value === sort[field]?.value);
    const [index, setIndex] = useState<number>(initIndex || 0);

    const handleSort = (index: number) => {
        setIndex(index);
        setSort(field, sortItems[index].value);
    }

    return (
        <div
            onClick={() => handleSort((index + 1) % sortItems.length)}
        >
            {sortItems[index] && sortItems[index].icon}
        </div>
    );
}