"use client";

import { Mode } from "@/app/types/modal";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { SeasonDto, SeasonRequestDto } from "@/app/types/season";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { findAll as findAllCompetitions } from "@/lib/api/competition";
import { findById } from "@/lib/api/season";
import { formatDate, getParams } from "@/lib/utils";
import { CompetitionDto } from "@/app/types/competition";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { findByCompetitionId } from "@/lib/api/team";
import { TeamDto } from "@/app/types/team";

export default function SeasonForm({
    selectedEtt,
    mode,
    onSubmit,
    onOpenChange,
}: {
    selectedEtt: SeasonDto | null;
    mode: Mode;
    onSubmit?: (value: SeasonRequestDto) => void;
    onOpenChange: () => void;
}) {
    const { t } = useTranslation(["common", "private/season"]);
    const [openCalendar, setOpenCalendar] = useState<{ startDate: boolean, endDate: boolean }>({
        startDate: false,
        endDate: false,
    });

    const FormSchema = z.object({
        name: z
            .string()
            .trim()
            .optional(),
        year: z
            .number()
            .optional(),
        competitionId: z
            .number()
            .min(1, t("private/season:message.form.notNull")),
        startDate: z
            .date()
            .optional(),
        endDate: z
            .date()
            .optional(),
        currentMatchDay: z
            .number()
            .optional(),
        winnerId: z
            .number()
            .optional(),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            year: undefined,
            competitionId: undefined,
            startDate: undefined,
            endDate: undefined,
            currentMatchDay: undefined,
            winnerId: undefined,
        }
    });

    const { data: seasonData } = useQuery({
        queryKey: ["findSeason", selectedEtt?.seasonId],
        enabled: !!selectedEtt?.seasonId,
        queryFn: async () => {
            if (!selectedEtt?.seasonId) return;
            return findById({ id: selectedEtt?.seasonId });
        },
    });

    const { data: competitionData } = useQuery({
        queryKey: ["findAllCompetitions"],
        queryFn: () => findAllCompetitions({
            params: getParams({}, {}, { page: 0, size: 999999 }),
        }),
    });

    const competitionSelect = useMemo(() => {
        if (!competitionData?.data?.content) return null;
        const competitions: { [key: string]: string } = {};
        competitionData.data.content.forEach((competition: CompetitionDto) => {
            competitions[competition.competitionId.toString()] = competition.name;
        });
        return competitions;
    }, [competitionData]);

    const { data: teamData } = useQuery({
        queryKey: ["findAllTeams", form?.getValues("competitionId")],
        queryFn: () => {
            if (!form?.getValues("competitionId")) return;
            return findByCompetitionId({ id: form.getValues("competitionId") });
        },
        enabled: !!form?.getValues("competitionId"),
    });

    const teamSelect = useMemo(() => {
        if (!teamData?.data) return null;
        const teams: { [key: string]: string } = {};
        teamData.data.forEach((team: TeamDto) => {
            teams[team.teamId.toString()] = team.name;
        });
        return teams;
    }, [teamData]);

    useEffect(() => {
        if (!seasonData?.data || mode === "create") return;
        
        form.reset({
            name: seasonData?.data?.name || "",
            year: seasonData?.data?.year || undefined,
            competitionId: seasonData?.data?.competitionId || undefined,
            startDate: seasonData?.data?.startDate ? new Date(seasonData?.data?.startDate) : new Date(),
            endDate: seasonData?.data?.endDate ? new Date(seasonData?.data?.endDate) : new Date(),
            currentMatchDay: seasonData?.data?.currentMatchDay || undefined,
            winnerId: seasonData?.data?.winnerId || undefined,
        });
    }, [seasonData]);

    return (
        <Form {...form}>
            <form 
                className="space-y-2"
                onSubmit={onSubmit
                    ? form.handleSubmit(onSubmit)
                    : (e) => e.preventDefault()
                }
            >
                <div className="grid grid-cols-2 gap-2">
                    <FormField 
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/season:table.column.name")}
                                    <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        value={field.value}
                                        onChange={field.onChange}
                                        disabled={mode === "view"}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/season:table.column.year")}
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={field.value?.toString() || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // cho phép rỗng (để xóa)
                                            if (value === "") {
                                                field.onChange(undefined);
                                                return;
                                            }

                                            // chỉ cho số
                                            if (/^[0-9]+$/.test(value)) {
                                                field.onChange(Number(value));
                                            }
                                        }}
                                        disabled={mode === "view"}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <FormField 
                        control={form.control}
                        name="competitionId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/season:table.column.competition.name")}
                                    <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        disabled={mode === "view"}
                                        value={field.value?.toString() || ""}
                                        onValueChange={(value: string) => {
                                            if (mode === "view") return;
                                            field.onChange(Number(value));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="max-h-50 bg-white overflow-y-auto"
                                        >
                                            {competitionSelect && Object.keys(competitionSelect).map((key: string, index: number) => (
                                                <SelectItem value={key} key={index}>
                                                    {competitionSelect[key]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/season:table.column.startDate")}
                                </FormLabel>
                                <FormControl>
                                    <div
                                        className="relative"
                                    >
                                        <Popover open={openCalendar.startDate} onOpenChange={(value: boolean) => setOpenCalendar((prev) => ({ ...prev, startDate: value }))}>
                                            <PopoverTrigger asChild disabled={mode === "view"}>
                                                <Input 
                                                    readOnly
                                                    value={formatDate(field.value?.toString())}
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
                                                    selected={field.value}
                                                    month={field.value}
                                                    onSelect={(selectedDate) => {
                                                        field.onChange(selectedDate);
                                                        setOpenCalendar((prev) => ({ ...prev, startDate: false }));
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <FormField 
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/season:table.column.endDate")}
                                </FormLabel>
                                <FormControl>
                                    <div
                                        className="relative"
                                    >
                                        <Popover open={openCalendar.endDate} onOpenChange={(value: boolean) => setOpenCalendar((prev) => ({ ...prev, endDate: value }))}>
                                            <PopoverTrigger asChild disabled={mode === "view"}>
                                                <Input 
                                                    readOnly
                                                    value={formatDate(field.value?.toString())}
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
                                                    selected={field.value}
                                                    month={field.value}
                                                    onSelect={(selectedDate) => {
                                                        field.onChange(selectedDate);
                                                        setOpenCalendar((prev) => ({ ...prev, endDate: false }));
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="currentMatchDay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/season:table.column.currentMatchDay")}
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        type="number"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        value={field.value?.toString() || ""}
                                        onChange={(e) => {
                                            const value = e.target.value;

                                            // cho phép rỗng (để xóa)
                                            if (value === "") {
                                                field.onChange(undefined);
                                                return;
                                            }

                                            // chỉ cho số
                                            if (/^[0-9]+$/.test(value)) {
                                                field.onChange(Number(value));
                                            }
                                        }}
                                        disabled={mode === "view"}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <FormField 
                        control={form.control}
                        name="winnerId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/season:table.column.winner.name")}
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        disabled={mode === "view" || !teamSelect}
                                        value={field.value?.toString() || ""}
                                        onValueChange={(value: string) => {
                                            if (mode === "view") return;
                                            field.onChange(Number(value));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="max-h-50 bg-white overflow-y-auto"
                                        >
                                            {teamSelect && Object.keys(teamSelect).map((key: string, index: number) => (
                                                <SelectItem value={key} key={index}>
                                                    {teamSelect[key]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                
                <div className="flex justify-end items-center gap-2">
                    <Button
                        variant="ghost"
                        className="w-24"
                        type="button"
                        onClick={onOpenChange}
                    >
                        {t("common:button.cancel")}
                    </Button>
                    {mode !== "view" && (
                        <Button
                            className="w-24"
                            type="submit"
                        >
                            {t("common:button.save")}
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    )
}