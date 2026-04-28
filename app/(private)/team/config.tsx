"use client";

import { TeamDto } from "@/app/types/team";
import { Column } from "@/components/CustomTable/types/table";
import { IMAGE_FALLBACK } from "@/lib/constant";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export function useColumns(): Column<TeamDto>[] {
    const { t } = useTranslation(["common", "private/team"]);
    return [
        { title: t("private/team:table.column.name"), key: "name" },
        { title: t("private/team:table.column.shortName"), key: "shortName" },
        { title: t("private/team:table.column.tla"), key: "tla" },
        { 
            title: t("private/team:table.column.area.name"), 
            key: "area.name",
            render: (_, record: TeamDto) => record.area?.name,
        },
        { 
            title: t("private/competition:table.column.logoUrl"), 
            render: (_, record: TeamDto) => (
                <Image 
                    src={record.logoUrl || IMAGE_FALLBACK.logo}
                    alt={record.name || ""}
                    width={24}
                    height={24}
                    className="w-6 h-6 object-cover"
                />
            ),
        },
        { title: t("private/team:table.column.address"), key: "address" },
        { title: t("private/team:table.column.website"), key: "website" },
        { title: t("private/team:table.column.founded"), key: "founded" },
        { title: t("private/team:table.column.clubColors"), key: "clubColors" },
        { title: t("private/team:table.column.venue"), key: "venue" },
        { 
            title: t("private/team:table.column.createdAt"), 
            key: "createdAt", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/team:table.column.createdBy"), key: "createdBy" },
        { 
            title: t("private/team:table.column.updatedAt"), 
            key: "updatedAt", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/team:table.column.updatedBy"), key: "updatedBy" },
    ];
}