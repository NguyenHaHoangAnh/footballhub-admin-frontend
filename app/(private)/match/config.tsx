"use client";

import { MatchDto } from "@/app/types/match";
import { Column } from "@/components/CustomTable/types/table";
import { IMAGE_FALLBACK } from "@/lib/constant";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export function useColumns(): Column<MatchDto>[] {
    const { t } = useTranslation(["common", "private/match"]);
    return [
        { 
            title: t("private/match:table.column.area.name"), 
            key: "area.name",
            render: (_, record: MatchDto) => record.area?.name,
        },
        { 
            title: t("private/match:table.column.season.name"), 
            key: "season.name",
            render: (_, record: MatchDto) => record.season?.name,
        },
        { 
            title: t("private/match:table.column.competition.name"), 
            key: "competition.name",
            render: (_, record: MatchDto) => record.competition?.name,
        },
        { 
            title: t("private/match:table.column.startDate"), 
            key: "startDate", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/match:table.column.status"), key: "status" },
        { title: t("private/match:table.column.matchDay"), key: "matchDay" },
        { 
            title: t("private/match:table.column.homeTeam.name"), 
            key: "homeTeam.name",
            render: (_, record: MatchDto) => (
                <div className="flex items-center gap-2">
                    <Image 
                        src={record.homeTeam?.logoUrl || IMAGE_FALLBACK.logo}
                        alt={record.homeTeam?.name || ""}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-cover"
                    />
                    <div>{record.homeTeam?.name}</div>
                </div>
            ),
        },
        { 
            title: t("private/match:table.column.awayTeam.name"), 
            key: "awayTeam.name",
            render: (_, record: MatchDto) => (
                <div className="flex items-center gap-2">
                    <Image 
                        src={record.awayTeam?.logoUrl || IMAGE_FALLBACK.logo}
                        alt={record.awayTeam?.name || ""}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-cover"
                    />
                    <div>{record.awayTeam?.name}</div>
                </div>
            ),
        },
        { title: t("private/match:table.column.scoreHome"), key: "scoreHome" },
        { title: t("private/match:table.column.scoreAway"), key: "scoreAway" },
        { 
            title: t("private/match:table.column.winner.name"), 
            key: "winner.name",
            render: (_, record: MatchDto) => (
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
            title: t("private/match:table.column.createdAt"), 
            key: "createdAt", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/match:table.column.createdBy"), key: "createdBy" },
        { 
            title: t("private/match:table.column.updatedAt"), 
            key: "updatedAt", 
            type: "date", 
            render: (value: string) => formatDateTime(value),
        },
        { title: t("private/match:table.column.updatedBy"), key: "updatedBy" },
    ];
}