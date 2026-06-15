"use client";

import { Mode } from "@/app/types/modal";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { MatchDto, MatchRequestDto } from "@/app/types/match";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { findById } from "@/lib/api/match";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import { findAll as findAllAreas } from "@/lib/api/area";
import { findAll as findAllSeasons } from "@/lib/api/season";
import { findAll as findAllCompetitions } from "@/lib/api/competition";
import { findByCompetitionId as findAllTeamsByCompetitionId } from "@/lib/api/team";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { formatDate, getParams } from "@/lib/utils";
import { AreaDto } from "@/app/types/area";
import { SeasonDto } from "@/app/types/season";
import { CompetitionDto } from "@/app/types/competition";
import { Calendar } from "@/components/ui/calendar";
import { MATCH_STATUS } from "@/lib/constant";
import { TeamDto } from "@/app/types/team";

export default function ({
    selectedEtt,
    mode,
    onSubmit,
    onOpenChange,
}: {
    selectedEtt: MatchDto | null;
    mode: Mode;
    onSubmit?: (value: MatchRequestDto) => void;
    onOpenChange: () => void;
}) {
    const { t } = useTranslation(["common", "private/match"]);
    const [areaSearch, setAreaSearch] = useState<string>("");
    const areaSearchDebounce = useDebounce(areaSearch, 500);
    const [areaOpen, setAreaOpen] = useState<boolean>(false);
    const [openCalendar, setOpenCalendar] = useState<{ startDate: boolean, endDate: boolean }>({
        startDate: false,
        endDate: false,
    });

    const FormSchema = z.object({
        areaId: z
            .number()
            .min(1, t("private/match:message.form.notNull")),
        seasonId: z
            .number()
            .min(1, t("private/match:message.form.notNull")),
        competitionId: z
            .number()
            .min(1, t("private/match:message.form.notNull")),
        startDate: z
            .any()
            .optional(),
        status: z
            .string()
            .trim()
            .optional(),
        matchDay: z
            .number()
            .optional(),
        homeTeamId: z
            .number()
            .min(1, t("private/match:message.form.notNull")),
        awayTeamId: z
            .number()
            .min(1, t("private/match:message.form.notNull")),
        scoreHome: z
            .number()
            .optional(),
        scoreAway: z
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
            areaId: undefined,
            competitionId: undefined,
            seasonId: undefined,
            startDate: "",
            status: "",
            matchDay: undefined,
            homeTeamId: undefined,
            awayTeamId: undefined,
            scoreHome: undefined,
            scoreAway: undefined,
            winnerId: undefined,
        }
    });

    const { data: matchData } = useQuery({
        queryKey: ["findMatch", selectedEtt?.matchId],
        enabled: !!selectedEtt?.matchId,
        queryFn: async () => {
            if (!selectedEtt?.matchId) return;
            return findById({ id: selectedEtt?.matchId });
        },
    });

    const { data: areaData } = useQuery({
        queryKey: ["findAllAreas", areaSearchDebounce],
        enabled: !!areaSearchDebounce,
        queryFn: async () => findAllAreas({
            params: getParams(
                { "name": { field: "name", compare: "contains", type: "string", value: areaSearchDebounce } }, 
                {}, 
                { page: 0, size: 999999 }
            ),
        }),
    });

    const { data: competitionData } = useQuery({
        queryKey: ["findAllCompetitions", form?.getValues("areaId")],
        enabled: !!form?.getValues("areaId"),
        queryFn: async () => {
            if (!form?.getValues("areaId")) return;
            return findAllCompetitions({
                params: getParams(
                    { "areaId": { field: "areaId", compare: "equals", type: "number", value: form?.getValues("areaId") } },
                    {},
                    { page: 0, size: 999999 }
                ),
            });
        }
    });

    const { data: seasonData } = useQuery({
        queryKey: ["findAllSeasons", form?.getValues("competitionId")],
        enabled: !!form?.getValues("competitionId"),
        queryFn: async () => {
            if (!form?.getValues("competitionId")) return;
            return findAllSeasons({
                params: getParams(
                    { "competitionId": { field: "competitionId", compare: "equals", type: "number", value: form?.getValues("competitionId") } },
                    {},
                    { page: 0, size: 999999 }
                ),
            });
        }
    });

    const { data: teamData } = useQuery({
        queryKey: ["findAllTeams"],
        enabled: !!form?.getValues("competitionId"),
        queryFn: async () => {
            if (!form?.getValues("competitionId")) return;
            return findAllTeamsByCompetitionId({
                id: form?.getValues("competitionId"),
            })
        }
    })

    const areaSelect = useMemo(() => {
        if (!areaData?.data?.content) return null;
        const areas: { [key: string]: string } = {};
        areaData.data.content.forEach((area: AreaDto) => {
            areas[area.areaId.toString()] = area.name;
        });
        return areas;
    }, [areaData?.data?.content]);
    
    const competitionSelect = useMemo(() => {
        if (!competitionData?.data?.content) return null;
        const competitions: { [key: string]: string } = {};
        competitionData.data.content.forEach((competition: CompetitionDto) => {
            competitions[competition.competitionId.toString()] = competition.name;
        });
        return competitions;
    }, [competitionData?.data?.content]);

    const seasonSelect = useMemo(() => {
        if (!seasonData?.data?.content) return null;
        const seasons: { [key: string]: string } = {};
        seasonData.data.content.forEach((season: SeasonDto) => {
            seasons[season.seasonId.toString()] = season.name || "";
        });
        return seasons;
    }, [seasonData?.data?.content]);

    const teamSelect = useMemo(() => {
        if (!teamData?.data) return null;
        const teams: { [key: string]: string } = {};
        teamData.data.forEach((team: TeamDto) => {
            teams[team.teamId.toString()] = team.name;
        });
        return teams;
    }, [teamData?.data]);

    const winnerSelect = useMemo(() => {
        if (!teamData?.data || !form.getValues("homeTeamId") || !form.getValues("awayTeamId")) return null;
        const teams: { [key: string]: string } = {
            "null": t("private/match:result.draw"),
        };
        teamData.data.forEach((team: TeamDto) => {
            if (team.teamId === form.getValues("homeTeamId") || team.teamId === form.getValues("awayTeamId")) {
                teams[team.teamId.toString()] = team.name
            }
        });
        return teams;
    }, [teamData?.data, form.getValues("homeTeamId"), form.getValues("awayTeamId")]);

    useEffect(() => {
        if (!matchData?.data || mode === "create") return;
        
        form.reset({
            areaId: matchData?.data?.areaId || undefined,
            competitionId: matchData?.data?.competitionId || undefined,
            seasonId: matchData?.data?.seasonId || undefined,
            startDate: matchData?.data?.startDate || "",
            status: matchData?.data?.status || "",
            matchDay: matchData?.data?.matchDay || undefined,
            homeTeamId: matchData?.data?.homeTeamId || undefined,
            awayTeamId: matchData?.data?.awayTeamId || undefined,
            scoreHome: matchData?.data?.scoreHome || undefined,
            scoreAway: matchData?.data?.scoreAway || undefined,
            winnerId: matchData?.data?.winnerId || undefined,
        });
    }, [matchData]);

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
                        name="areaId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/team:table.column.area.name")}
                                    <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Popover open={areaOpen} onOpenChange={() => setAreaOpen(!areaOpen)}>
                                        <PopoverTrigger disabled={mode === "view"} asChild>
                                            <Input 
                                                className="text-left"
                                                type="text"
                                                readOnly
                                                value={areaSelect?.[field.value] || matchData?.data?.areaName || ""}
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="bg-white"
                                        >
                                            <Command className="gap-2">
                                                <div className="m-px">
                                                    <Input 
                                                        placeholder={t("private/competition:placeholder.search")} 
                                                        value={areaSearch}
                                                        onChange={(e) => setAreaSearch(e.target.value)}
                                                    />
                                                </div>
                                                <CommandList>
                                                    <CommandEmpty>
                                                        {t("private/competition:message.form.empty")}
                                                    </CommandEmpty>
                                                    {!!areaSearch && areaSelect && Object.keys(areaSelect).map((id: string) => (
                                                        <CommandItem
                                                            key={id}
                                                            value={id}
                                                            onSelect={() => {
                                                                field.onChange(Number(id));
                                                                setAreaOpen(false);
                                                                form.setValue("competitionId", 0);
                                                                form.setValue("seasonId", 0);
                                                            }}
                                                        >
                                                            {areaSelect[id]}
                                                        </CommandItem>
                                                    ))}
                                                </CommandList>
                                            </Command>
                                        </PopoverContent>
                                    </Popover>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="competitionId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/match:table.column.competition.name")}
                                    <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        value={field.value?.toString() || ""}
                                        disabled={mode === "view" || !competitionSelect}
                                        onValueChange={(value: string) => {
                                            if (mode === "view" || !value) return;
                                            field.onChange(Number(value));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="bg-white"
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
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <FormField 
                        control={form.control}
                        name="seasonId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/match:table.column.season.name")}
                                    <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        value={field.value?.toString() || ""}
                                        disabled={mode === "view" || !seasonSelect}
                                        onValueChange={(value: string) => {
                                            if (mode === "view" || !value) return;
                                            field.onChange(Number(value));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="max-h-50 overflow-y-auto bg-white"
                                        >
                                            {seasonSelect && Object.keys(seasonSelect).map((key: string, index: number) => (
                                                <SelectItem value={key} key={index}>
                                                    {seasonSelect[key]}
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
                                    {t("private/match:table.column.startDate")}
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
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/match:table.column.status")}
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        value={field.value}
                                        disabled={mode === "view"}
                                        onValueChange={(value: string) => {
                                            if (mode === "view" || !value) return;
                                            field.onChange(value);
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="max-h-50 overflow-y-auto bg-white"
                                        >
                                            {Object.entries(MATCH_STATUS).map(([key, value]: [string, string]) => (
                                                <SelectItem key={key} value={value}>
                                                    {t(`private/match:status.${key.toLowerCase()}`)}
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
                        name="matchDay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/match:table.column.matchDay")}
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
                        name="homeTeamId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/match:table.column.homeTeam.name")}
                                    <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        value={field.value?.toString() || ""}
                                        disabled={mode === "view" || !teamSelect}
                                        onValueChange={(value: string) => {
                                            if (mode === "view" || !value) return;
                                            field.onChange(Number(value));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="max-h-50 overflow-y-auto bg-white"
                                        >
                                            {teamSelect && Object.keys(teamSelect).map((key: string, index: number) => (
                                                <SelectItem 
                                                    value={key} 
                                                    key={index} 
                                                    disabled={!!Number(key) && (Number(key) === form.getValues("awayTeamId"))}
                                                >
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
                    <FormField 
                        control={form.control}
                        name="awayTeamId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/match:table.column.awayTeam.name")}
                                    <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        value={field.value?.toString() || ""}
                                        disabled={mode === "view" || !teamSelect}
                                        onValueChange={(value: string) => {
                                            if (mode === "view" || !value) return;
                                            field.onChange(Number(value));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="max-h-50 overflow-y-auto bg-white"
                                        >
                                            {teamSelect && Object.keys(teamSelect).map((key: string, index: number) => (
                                                <SelectItem 
                                                    value={key} 
                                                    key={index} 
                                                    disabled={!!Number(key) && (Number(key) === form.getValues("homeTeamId"))}
                                                >
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
                <div className="grid grid-cols-2 gap-2">
                    <FormField 
                        control={form.control}
                        name="scoreHome"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/match:table.column.scoreHome")}
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
                    <FormField 
                        control={form.control}
                        name="scoreAway"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/match:table.column.scoreAway")}
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
                                    {t("private/match:table.column.winner.name")}
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        value={field.value?.toString() || "null"}
                                        disabled={mode === "view" || !form.getValues("homeTeamId") || !form.getValues("awayTeamId")}
                                        onValueChange={(value: string) => {
                                            if (mode === "view" || !value) return;
                                            field.onChange(value === "null" ? undefined : Number(value));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="max-h-50 overflow-y-auto bg-white"
                                        >
                                            {winnerSelect && Object.keys(winnerSelect).map((key: string, index: number) => (
                                                <SelectItem 
                                                    value={key} 
                                                    key={index} 
                                                >
                                                    {winnerSelect[key]}
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