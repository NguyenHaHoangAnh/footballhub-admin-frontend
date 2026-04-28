"use client";

import { CompetitionDto } from "@/app/types/competition";
import { Column } from "@/components/CustomTable/types/table";
import { IMAGE_FALLBACK } from "@/lib/constant";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export function useColumns(): Column<CompetitionDto>[] {
    const { t } = useTranslation(["common", "private/competition"]);
    return [
        { 
            title: t("private/competition:table.column.area.name"), 
            key: "area.name",
            render: (_, record: CompetitionDto) => record.area?.name,
        },
        { title: t("private/competition:table.column.name"), key: "name" },
        { title: t("private/competition:table.column.code"), key: "code" },
        { title: t("private/competition:table.column.type"), key: "type" },
        { 
            title: t("private/competition:table.column.logoUrl"), 
            render: (_, record: CompetitionDto) => (
                <Image 
                    src={record.logoUrl || IMAGE_FALLBACK.logo}
                    alt={record.name || ""}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-cover"
                />
            ),
        },
        // { title: t("private/competition:table.column.currentSeasonId"), key: "currentSeasonId" },
        { 
            title: t("private/competition:table.column.createdAt"), 
            key: "createdAt", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/competition:table.column.createdBy"), key: "createdBy" },
        { 
            title: t("private/competition:table.column.updatedAt"), 
            key: "updatedAt", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/competition:table.column.updatedBy"), key: "updatedBy" },
    ];
}