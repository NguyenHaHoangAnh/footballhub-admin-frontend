"use client";

import { StandingResponseDto } from "@/app/types/standing";
import { Column } from "@/components/CustomTable/types/table";
import { IMAGE_FALLBACK, RESULT_STATUS } from "@/lib/constant";
import { formatDateTime } from "@/lib/utils";
import { Check, Minus, X } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";

export function useColumns(): Column<StandingResponseDto>[] {
    const { t } = useTranslation(["common", "private/standing"]);
    return [
        { 
            title: t("private/standing:table.column.teamName"), 
            render: (_, record: StandingResponseDto) => (
                <div className="flex items-center gap-2">
                    <Image 
                        src={record?.teamLogoUrl || IMAGE_FALLBACK.logo}
                        alt={record?.teamName || ""}
                        width={24}
                        height={24}
                        className="w-6 h-6 object-cover"
                    />
                    <div>{record?.teamName}</div>
                </div>
            ),
        },
        { 
            title: t("private/standing:table.column.playedGames"),
            render: (_, record: StandingResponseDto) => (
                <div>{record?.playedGames || 0}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.won"),
            render: (_, record: StandingResponseDto) => (
                <div>{record?.won || 0}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.draw"),
            render: (_, record: StandingResponseDto) => (
                <div>{record?.draw || 0}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.lost"),
            render: (_, record: StandingResponseDto) => (
                <div>{record?.lost || 0}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.goalsFor"),
            render: (_, record: StandingResponseDto) => (
                <div>{record?.goalsFor || 0}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.goalsAgainst"),
            render: (_, record: StandingResponseDto) => (
                <div>{record?.goalsAgainst || 0}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.goalsDifference"),
            render: (_, record: StandingResponseDto) => (
                <div>{record?.goalsDifference || 0}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.points"),
            render: (_, record: StandingResponseDto) => (
                <div>{record?.points || 0}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.form"),
            render: (_, record: StandingResponseDto) => (
                <div className="flex items-center gap-2">{Array.from({ length: 5 }, (_, index: number) => {
                    if (!record?.form) return;
                    const forms = record?.form.split(",");

                    return (
                        <div className={`flex justify-center items-center w-4 h-4 p-0.5 rounded-full text-white
                            ${forms[index] === RESULT_STATUS.WON
                                ? "bg-green-500 ring-green-500"
                                : forms[index] === RESULT_STATUS.DRAW
                                    ? "bg-gray-500 ring-gray-500"
                                    : forms[index] === RESULT_STATUS.LOST 
                                        ? "bg-red-500 ring-red-500"
                                        : ""
                            }
                            ${index === (forms.length - 1) ? "ring-2 ring-offset-2 ring-offset-white" : ""}
                        `}   >
                            {forms[index] === RESULT_STATUS.WON
                                ? <Check />
                                : forms[index] === RESULT_STATUS.DRAW
                                    ? <Minus />
                                    : forms[index] === RESULT_STATUS.LOST
                                        ? <X />
                                        : null
                            }
                        </div>
                    );
                })}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.createdAt"), 
            type: "date", 
            render: (_, record: StandingResponseDto) => (
                <div>{formatDateTime(record?.createdAt?.toString())}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.createdBy"),
            render: (_, record: StandingResponseDto) => (
                <div>{record?.createdBy}</div>
            )
        },
        { 
            title: t("private/standing:table.column.updatedAt"), 
            type: "date", 
            render: (_, record: StandingResponseDto) => (
                <div>{formatDateTime(record?.updatedAt?.toString())}</div>
            ),
        },
        { 
            title: t("private/standing:table.column.updatedBy"),
            render: (_, record: StandingResponseDto) => (
                <div>{record?.updatedBy}</div>
            )
        },
    ];
}