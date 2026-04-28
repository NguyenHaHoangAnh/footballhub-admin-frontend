"use client";

import { Mode } from "@/app/types/modal";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { MatchDto, MatchRequestDto } from "@/app/types/match";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { findParentAreas } from "@/lib/api/area";
import { findById } from "@/lib/api/team";

export default function AreaForm({
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

    const FormSchema = z.object({
        areaId: z
            .number()
            .min(1, t("private/match:message.form.notNull")),
        competitionId: z
            .number()
            .min(1, t("private/match:message.form.notNull")),
        seasonId: z
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
            .min(1, t("private/match:message.form.notNull")),
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
        queryKey: ["findTeam", selectedEtt?.matchId],
        enabled: !!selectedEtt?.matchId,
        queryFn: async () => {
            if (!selectedEtt?.matchId) return;
            return findById({ id: selectedEtt?.matchId });
        },
    });

    // const { data } = useQuery({
    //     queryKey: ["findParentAreas"],
    //     queryFn: findParentAreas,
    // });

    // const parentAreaSelect = useMemo(() => {
    //     if (!parentAreaData?.data) return null;
    //     const parentArea: { [key: string]: string } = {};
    //     parentAreaData.data.forEach((area: AreaDto) => {
    //         parentArea[area.areaId.toString()] = area.name;
    //     });
    //     return parentArea;
    // }, [parentAreaData]);

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
                                    {t("private/match:table.column.name")}
                                    <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        value={field.value}
                                        onChange={field.onChange}
                                        readOnly={mode === "view"}
                                    />
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
                                    {t("private/match:table.column.countryCode")}
                                    <span className="text-red-600">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        value={field.value}
                                        onChange={field.onChange}
                                        readOnly={mode === "view"}
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
                        name="seasonId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/match:table.column.flag")}
                                </FormLabel>
                                <FormControl>
                                    <Input 
                                        value={field.value}
                                        onChange={field.onChange}
                                        readOnly={mode === "view"}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField 
                        control={form.control}
                        name="areaId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/match:table.column.parent")}
                                </FormLabel>
                                <FormControl>
                                    {/* <Select
                                        key={field.value}
                                        value={field.value?.toString()}
                                        onValueChange={(value: string) => {
                                            if (mode === "view") return;
                                            field.onChange(Number(value));
                                            form.setValue("parentArea", parentAreaSelect ? parentAreaSelect[value] : "");
                                        }}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="bg-white"
                                        >
                                            {parentAreaSelect && Object.keys(parentAreaSelect).map((key: string, index: number) => (
                                                <SelectItem value={key} key={index}>
                                                    {parentAreaSelect[key]}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select> */}
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