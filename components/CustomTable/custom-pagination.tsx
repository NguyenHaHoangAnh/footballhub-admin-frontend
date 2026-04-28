"use client";

import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { SelectValue } from "@radix-ui/react-select";
import { PAGE_SIZE_OPTIONS } from "@/lib/constant";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink } from "../ui/pagination";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useStore } from "./store";

export default function CustomPagination({
    totalPages,
    totalElements,
    showPagination,
}: {
    totalPages: number;
    totalElements: number;
    showPagination: boolean;
}) {
    const { t } = useTranslation(["common"]);
    const {
        pagination,
        setPagination,
    } = useStore();
    
    const [jumpPage, setJumpPage] = useState<string>((pagination.page + 1).toString());

    const getPages = () => {
        const pages: (number | string)[] = [];
        const max = 3;

        let start = Math.max(1, (pagination.page + 1) - 2);
        let end = Math.min(totalPages, start + max - 1);

        if (end - start < max - 1) {
            start = Math.max(1, end - max + 1);
        }

        if (start > 1) pages.push(1, "...");

        for (let i = start; i <= end; i++) pages.push(i);

        if (end < totalPages) pages.push("...", totalPages);

        return pages;
    };

    useEffect(() => {
        return () => setPagination(0, pagination.size);
    }, []);

    if (!showPagination) return null;

    return (
        <div
            className="flex justify-between items-center gap-2"
        >
            {/* Left */}
            <div>
                <div>{t("common:pagination.page", { currentPage: pagination.page + 1, totalPages })}</div>
                <div>{t("common:pagination.total", { totalElements })}</div>
            </div>
            {/* Middle */}
            <Pagination className="w-fit">
                <PaginationContent>
                    <PaginationItem>
                        <Button
                            variant="ghost"
                            className="w-9 h-9 p-2 rounded-lg"
                            disabled={pagination.page === 0}
                            onClick={() => setPagination(pagination.page - 1, pagination.size)}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                    </PaginationItem>
                    {getPages().map((page: number | string, index: number) => (
                        <PaginationItem key={index}>
                            {page === "..." ? (
                                <PaginationEllipsis />
                            ) : (
                                <PaginationLink 
                                    className="cursor-pointer"
                                    isActive={(Number(page) - 1) === pagination.page}
                                    onClick={() => setPagination(Number(page) - 1, pagination.size)}
                                >
                                    {page}
                                </PaginationLink>
                            )}
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <Button
                            variant="ghost"
                            className="w-9 h-9 p-2 rounded-lg"
                            disabled={pagination.page === (totalPages - 1)}
                            onClick={() => setPagination(pagination.page + 1, pagination.size)}
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
            {/* Right */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <div>{t("common:pagination.size")}</div>
                    <Select
                        value={pagination.size.toString()}
                        onValueChange={(value: string) => setPagination(pagination.page, Number(value))}
                    >
                        <SelectTrigger className="w-18">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                            className="bg-white"
                        >
                            {PAGE_SIZE_OPTIONS.map((item: number, index: number) => (
                                <SelectItem key={index} value={item.toString()}>{item}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex items-center gap-2">
                    <div>{t("common:pagination.jump")}</div>
                    <Input 
                        className="w-14"
                        type="number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        min={1}
                        max={totalPages}
                        value={jumpPage}
                        onChange={(e) => {
                            const value = e.target.value;

                            // cho phép rỗng (để xóa)
                            if (value === "") {
                                setJumpPage("");
                                return;
                            }

                            // chỉ cho số
                            if (/^[0-9]+$/.test(value)) {
                                setJumpPage(value);
                            }
                        }}
                        onKeyDown={(e) => {
                            const allowKeys = [
                                "Backspace",
                                "Delete",
                                "ArrowLeft",
                                "ArrowRight",
                                "Tab",
                            ];
                            // cho phép control keys
                            if (allowKeys.includes(e.key)) return;
                            // cho phép số
                            if (/^[0-9]$/.test(e.key)) return;
                            if (e.key === "Enter") {
                                if (Number(jumpPage) >= 1 && Number(jumpPage) <= totalPages) {
                                    setPagination(Number(jumpPage) - 1, pagination.size);
                                }
                                return;
                            }
                            e.preventDefault();
                        }}
                        onBlur={() => {
                            // nếu để trống → reset về currentPage
                            setJumpPage((pagination.page + 1).toString());
                            return;
                        }}
                    />
                </div>
            </div>
        </div>
    );
}