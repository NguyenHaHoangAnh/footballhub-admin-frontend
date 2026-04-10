"use client";

import { AreaDto } from "@/app/types/area";
import { Column } from "@/components/CustomTable/types/table";
import { IMAGE_FALLBACK } from "@/lib/constant";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export function useColumns(): Column<AreaDto>[] {
    const { t } = useTranslation(["common", "private/area"]);
    return [
        { title: t("private/area:table.column.name"), key: "name" },
        { title: t("private/area:table.column.countryCode"), key: "countryCode" },
        { 
            title: t("private/area:table.column.flag"), 
            render: (_, record: AreaDto) => (
                <Image 
                    src={record.flagUrl || IMAGE_FALLBACK.flag}
                    alt={record.name}
                    width={24}
                    height={16}
                    className="w-6 h-4 object-cover"
                />
            ),
        },
        { title: t("private/area:table.column.parent"), key: "parentArea" },
        { 
            title: t("private/area:table.column.createdAt"), 
            key: "createdAt", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/area:table.column.createdBy"), key: "createdBy" },
        { 
            title: t("private/area:table.column.updatedAt"), 
            key: "updatedAt", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/area:table.column.updatedBy"), key: "updatedBy" },
    ];
}