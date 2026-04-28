"use client";

import { Mode } from "@/app/types/modal";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { CompetitionDto, CompetitionRequestDto } from "@/app/types/competition";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { findAll as findAllAreas } from "@/lib/api/area";
import { findAll as findAllSeasons } from "@/lib/api/season";
import { findById } from "@/lib/api/competition";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import { CommandInput } from "cmdk";
import { AreaDto } from "@/app/types/area";
import { getParams } from "@/lib/utils";
import { debounce } from "@/lib/debounce";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { COMPETITION_TYPES } from "@/lib/constant";
import { SeasonDto } from "@/app/types/season";

export default function CompetitionForm({
    selectedEtt,
    mode,
    onSubmit,
    onOpenChange,
}: {
    selectedEtt: CompetitionDto | null;
    mode: Mode;
    onSubmit?: (value: CompetitionRequestDto) => void;
    onOpenChange: () => void;
}) {
    const { t } = useTranslation(["common", "private/competition"]);
    const [areaSearch, setAreaSearch] = useState<string>("");
    const areaSearchDebounce = useDebounce(areaSearch, 500);
    const [areaOpen, setAreaOpen] = useState<boolean>(false);

    const FormSchema = z.object({
        areaId: z
            .number(),
        name: z
            .string()
            .trim()
            .min(1, t("private/competition:message.form.notNull")),
        code: z
            .string()
            .trim()
            .min(1, t("private/competition:message.form.notNull")),
        type: z
            .string()
            .trim()
            .min(1, t("private/competition:message.form.notNull")),
        logoUrl: z
            .string()
            .trim()
            .optional(),
        currentSeasonId: z
            .number()
            .min(1, t("private/competition:message.form.notNull"))
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            areaId: undefined,
            name: "",
            code: "",
            type: "",
            logoUrl: "",
            currentSeasonId: undefined,
        }
    });

    const { data: competitionData } = useQuery({
        queryKey: ["findCompetition", selectedEtt?.competitionId],
        enabled: !!selectedEtt?.competitionId,
        queryFn: async () => {
            if (!selectedEtt?.competitionId) return;
            return findById({ id: selectedEtt?.competitionId });
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

    const { data: seasonData } = useQuery({
        queryKey: ["findAllSeason"],
        queryFn: async () => findAllSeasons({
            params: "",
        })
    })
    
    useEffect(() => {
        if (!competitionData?.data || mode === "create") return;
        
        form.reset({
            areaId: competitionData?.data?.areaId || undefined,
            name: competitionData?.data?.name || "",
            code: competitionData?.data?.code || "",
            type: competitionData?.data?.type || "",
            logoUrl: competitionData?.data?.logoUrl || "",
            currentSeasonId: competitionData?.data?.currentSeasonId || undefined,
        });
    }, [competitionData]);
    
    const areaSelect = useMemo(() => {
        if (!areaData?.data?.content) return null;
        const areas: { [key: string]: string } = {};
        areaData.data.content.forEach((area: AreaDto) => {
            areas[area.areaId.toString()] = area.name;
        });
        return areas;
    }, [areaData?.data?.content]);

    const seasonSelect = useMemo(() => {
        if (!seasonData?.data?.content) return null;
        const seasons: { [key: string]: string } = {};
        seasonData.data.content.forEach((season: SeasonDto) => {
            seasons[season.seasonId.toString()] = season.name || "";
        })
        return seasons;
    }, [seasonData?.data?.content]);

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
                                    {t("private/competition:table.column.area.name")}
                                </FormLabel>
                                <FormControl>
                                    <Popover open={areaOpen} onOpenChange={() => setAreaOpen(!areaOpen)}>
                                        <PopoverTrigger disabled={mode === "view"} asChild>
                                            <Input 
                                                className="text-left"
                                                type="text"
                                                value={areaSelect?.[field.value] || competitionData?.data?.areaName || ""}
                                            />
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="bg-white"
                                        >
                                            <Command className="space-y-2">
                                                <Input 
                                                    placeholder={t("private/competition:placeholder.search")} 
                                                    value={areaSearch}
                                                    onChange={(e) => setAreaSearch(e.target.value)}
                                                />
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/competition:table.column.name")}
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
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <FormField 
                        control={form.control}
                        name="code"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/competition:table.column.code")}
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
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/competition:table.column.type")}
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        disabled={mode === "view"}
                                        value={field.value}
                                        onValueChange={(value: string) => {
                                            if (mode === "view") return;
                                            field.onChange(value)
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value={COMPETITION_TYPES.LEAGUE}>
                                                {COMPETITION_TYPES.LEAGUE}
                                            </SelectItem>
                                            <SelectItem value={COMPETITION_TYPES.CUP}>
                                                {COMPETITION_TYPES.CUP}
                                            </SelectItem>
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
                        name="logoUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/competition:table.column.logoUrl")}
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
                        name="currentSeasonId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/competition:table.column.currentSeasonId")}
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        value={field.value?.toString()}
                                        disabled={mode === "view"}
                                        onValueChange={(value: string) => {
                                            if (mode === "view") return;
                                            field.onChange(Number(value));
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="bg-white"
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