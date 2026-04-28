"use client";

import { useDebounce } from "@/lib/hooks/useDebounce";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { useStore } from "./store";
import { useTranslation } from "react-i18next";

export default function CustomGlobalFilter({
    fields,
}: {
    fields: string[];
}) {
    const { t } = useTranslation(["common"])
    const {
        filter,
        pagination,
        setFilter,
        setPagination,
    } = useStore();
    const [filterValue, setFilterValue] = useState<string>("");
    const filterDebounce = useDebounce(filterValue, 500);
    const memoFields = useMemo(() => fields, []);

    useEffect(() => {
        if (!filterDebounce || !memoFields || (memoFields && memoFields.length === 0)) {
            setFilter(memoFields, "string", "contains", null, "or");
            return;
        }
        setFilter(memoFields, "string", "contains", filterDebounce, "or");
        setPagination(0, pagination.size);
    }, [filterDebounce, memoFields]);

    return (
        <div>
            <Input 
                className="w-1/4 m-px"
                placeholder={t("common:placeholder.search")}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
            />
        </div>
    );
}