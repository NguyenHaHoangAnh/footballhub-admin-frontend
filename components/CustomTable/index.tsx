"use client";

import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Column, ControllerValue } from "@/components/CustomTable/types/table";
import CustomFilter from "./custom-filter";
import CustomPagination from "./custom-pagination";
import { useStore } from "./store";
import CustomSort from "./custom-sort";
import { PackageOpen } from "lucide-react";
import CustomController from "../CustomController";
import CustomGlobalFilter from "./custom-global-filter";

export default function CustomTable<T extends Record<string, any>>({
    columns,
    data,
    globalFields,
    showIndex = true,
    showPagination = true,
    totalElements,
    totalPages,
    controller,
    onCreate,
    onView,
    onEdit,
    onDelete,
}: {
    columns: Column<T>[];
    data: T[] | undefined;
    globalFields?: string[];
    showIndex?: boolean;
    showPagination?: boolean;
    totalElements: number | undefined;
    totalPages?: number | undefined;
    controller?: ControllerValue[];
    onCreate?: () => void;
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}) {
    const { t } = useTranslation(["common"]);
    const {
        pagination,
    } = useStore();

    return (
        <div className="overflow-x-auto space-y-2">
            {globalFields && (
                <CustomGlobalFilter 
                    fields={globalFields}
                />
            )}
            <Table>
                <TableHeader>
                    <TableRow>
                        {showIndex && <TableHead className="text-center">{t("common:no")}</TableHead>}
                        {columns.map((column: Column<T>, index: number) => (
                            <TableHead 
                                key={index}
                            >
                                <div
                                    className="flex justify-between items-center gap-2 text-left"
                                >
                                    {column.title}
                                    {column.key && (
                                        <div
                                            className="flex items-center gap-1"
                                        >
                                            <CustomFilter 
                                                field={column.key.toString()}
                                                type={column.type || (typeof data?.[0]?.[column.key] === "number" ? "number" : "string")}
                                            />
                                            <CustomSort 
                                                field={column.key.toString()}
                                            />
                                        </div>
                                    )}
                                </div>
                            </TableHead>
                        ))}
                        {controller && controller.length > 0 && (
                            <TableHead className="sticky right-0 text-center bg-white">
                                {t("common:action")}
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data && data.map((item: T, index: number) => (
                        <TableRow 
                            key={index}
                            className="border-0"
                        >
                            {showIndex && 
                                (pagination.page != null && pagination.page != undefined) && 
                                (pagination.size != null && pagination.size != undefined) && 
                                <TableCell className="text-center">{pagination.page * pagination.size + index + 1}</TableCell>
                            }
                            {columns.map((column: Column<T>, colIndex: number) => {
                                const value = column.key ? item[column.key] : undefined;
                                return (
                                    <TableCell 
                                        key={colIndex}
                                        className="text-left"
                                    >
                                        {column.render
                                            ? column.render(value, item)
                                            : value
                                        }
                                    </TableCell>
                                );
                            })}
                            {controller && controller.length > 0 && (
                                <TableCell className="sticky right-0 bg-white">
                                    <CustomController 
                                        controller={controller}
                                        selectedEtt={item}
                                        onCreate={onCreate}
                                        onView={onView}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <CustomPagination 
                totalElements={totalElements || 0}
                totalPages={totalPages || 0}
                showPagination={showPagination}
            />
        </div>
    );
}

export function useCustomTable() {
    const {
        filter,
        sort,
        pagination,
    } = useStore();

    return ({
        filter,
        pagination,
        sort,
    });
}