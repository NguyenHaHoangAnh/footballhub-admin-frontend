"use client";

import { SeasonDto } from "@/app/types/season";
import { Column } from "@/components/CustomTable/types/table";
import { IMAGE_FALLBACK } from "@/lib/constant";
import { formatDate, formatDateTime } from "@/lib/utils";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export function useColumns(): Column<SeasonDto>[] {
    const { t } = useTranslation(["common", "private/season"]);
    return [
        { title: t("private/season:table.column.year"), key: "year" },
        { title: t("private/season:table.column.name"), key: "name" },
        { 
            title: t("private/season:table.column.competition.name"), 
            key: "competition.name",
            render: (_, record: SeasonDto) => record?.competition?.name,
        },
        { 
            title: t("private/season:table.column.startDate"), 
            key: "startDate", 
            type: "date", 
            render: (value: string) => formatDate(value),
        },
        { 
            title: t("private/season:table.column.endDate"), 
            key: "endDate", 
            type: "date", 
            render: (value: string) => formatDate(value),
        },
        { title: t("private/season:table.column.currentMatchDay"), key: "currentMatchDay" },
        { 
            title: t("private/season:table.column.winner.name"), 
            key: "winner.name",
            render: (_, record: SeasonDto) => (
                <div className="flex items-center gap-2">
                    <Image 
                        src={record.winner?.logoUrl || IMAGE_FALLBACK.logo}
                        alt={record.winner?.name || ""}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-cover"
                    />
                    <div>{record.winner?.name}</div>
                </div>
            ),
        },
        { 
            title: t("private/season:table.column.createdAt"), 
            key: "createdAt", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/season:table.column.createdBy"), key: "createdBy" },
        { 
            title: t("private/season:table.column.updatedAt"), 
            key: "updatedAt", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/season:table.column.updatedBy"), key: "updatedBy" },
    ];
}