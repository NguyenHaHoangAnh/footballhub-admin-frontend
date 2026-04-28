"use client";

import { Funnel } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FILTER_OPTIONS } from "@/lib/constant";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { useStore } from "./store";
import { Calendar } from "../ui/calendar";
import { format } from "date-fns";
import { ColumnType, Filter, FilterCompare } from "./types/table";

export default function CustomFilter({
    field,
    type = "string",
}: {
    field: string;
    type: ColumnType;
}) {
    const { t } = useTranslation(["common"]);
    const {
        filter,
        pagination,
        setFilter,
        setPagination,
    } = useStore();
    const [open, setOpen] = useState<boolean>(false);
    const [filterValue, setFilterValue] = useState<Filter>({
        field,
        type,
        compare: filter[field]?.compare || FILTER_OPTIONS[type][0].value,
        value: filter[field]?.value || "",
    });
    const [openCalendar, setOpenCalendar] = useState<boolean>(false);
    const [date, setDate] = useState<Date | undefined>(undefined);

    const onOpenChange = () => {
        setOpen(!open);
    }

    useEffect(() => {
        setFilterValue({
            ...filterValue,
            compare: filter[field]?.compare || FILTER_OPTIONS[type][0].value,
            value: filter[field]?.value || "",
        });
    }, [field, type]);

    useEffect(() => {
        return () => handleClear();
    }, []);

    const handleSave = () => {
        setFilter(field, type, filterValue.compare, filterValue.value)
        onOpenChange();
        setPagination(0, pagination.size);
    }

    const handleClear = () => {
        setFilter(field, type, null, "");
        setFilterValue({
            field,
            type,
            compare: FILTER_OPTIONS[type][0].value,
            value: "",
        });
        setDate(undefined);
        onOpenChange();
        setPagination(0, pagination.size);
    }

    const isFiltered = useMemo(() => !!filter[field]?.compare && !!filter[field]?.value, [filter, field]);

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <Funnel className={`w-4 h-4 ${isFiltered ? "text-primary" : "text-muted-foreground"}`} />
            </PopoverTrigger>
            <PopoverContent
                className="w-50 bg-white space-y-2"
            >
                <Select 
                    value={filterValue.compare} 
                    onValueChange={(v: FilterCompare) => setFilterValue({...filterValue, compare: v})}
                >
                    <SelectTrigger>
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent
                        className="bg-white"
                    >
                        <SelectGroup>
                            {FILTER_OPTIONS[type].map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {t(option.label)}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                {type === "date" ? (
                    <div
                        className="relative"
                    >
                        <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
                            <PopoverTrigger asChild>
                                <Input 
                                    readOnly
                                    value={filterValue.value ? format(filterValue.value, "dd/MM/yyyy") : ""}
                                    className="text-left cursor-pointer"
                                />
                            </PopoverTrigger>
                            <PopoverContent
                                className="mt-1 bg-white"
                            >
                                <Calendar 
                                    mode="single"
                                    captionLayout="dropdown"
                                    className="w-full"
                                    classNames={{
                                        nav: "absolute inset-x-0 top-2.5 flex w-full items-center justify-between gap-1"
                                    }}
                                    selected={date}
                                    onSelect={(selectedDate) => {
                                        setDate(selectedDate);
                                        setFilterValue({...filterValue, value: selectedDate ? format(selectedDate, "yyyy-MM-dd'T'00:00:00.000+07:00") : ""});
                                        setOpenCalendar(false);
                                    }}
                                />
                            </PopoverContent>
                        </Popover>
                    </div>
                ) : (
                    <Input 
                        value={filterValue.value}
                        onChange={(e) => setFilterValue({...filterValue, value: e.target.value})}
                    />
                )}

                <div className="flex justify-end items-center gap-2">
                    <Button
                        variant="ghost"
                        onClick={handleClear}
                    >
                        {t("common:button.delete")}
                    </Button>
                    <Button
                        onClick={handleSave}
                    >
                        {t("common:button.save")}
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}