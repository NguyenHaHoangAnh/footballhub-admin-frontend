"use client";

import { Mode } from "@/app/types/modal";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { TeamDto, TeamRequestDto } from "@/app/types/team";
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
    selectedEtt: TeamDto | null;
    mode: Mode;
    onSubmit?: (value: TeamRequestDto) => void;
    onOpenChange: () => void;
}) {
    const { t } = useTranslation(["common", "private/team"]);

    const FormSchema = z.object({
        name: z
            .string()
            .trim()
            .min(1, t("private/team:message.form.notNull")),
        shortName: z
            .string()
            .trim()
            .optional(),
        tla: z
            .string()
            .trim()
            .optional(),
        areaId: z
            .number(),
        logoUrl: z
            .string()
            .trim()
            .optional(),
        address: z
            .string()
            .trim()
            .optional(),
        website: z
            .string()
            .trim()
            .optional(),
        founded: z
            .number()
            .optional(),
        clubColors: z
            .string()
            .trim()
            .optional(),
        venue: z
            .string()
            .trim()
            .optional(),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            shortName: "",
            tla: "",
            areaId: undefined,
            logoUrl: "",
            address: "",
            website: "",
            founded: undefined,
            clubColors: "",
            venue: "",
        }
    });

    const { data: teamData } = useQuery({
        queryKey: ["findTeam", selectedEtt?.teamId],
        enabled: !!selectedEtt?.teamId,
        queryFn: async () => {
            if (!selectedEtt?.teamId) return;
            return findById({ id: selectedEtt?.teamId });
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
        if (!teamData?.data || mode === "create") return;
        
        form.reset({
            name: teamData?.data?.name || "",
            shortName: teamData?.data?.shortName || "",
            tla: teamData?.data?.tla || "",
            areaId: teamData?.data?.areaId || undefined,
            logoUrl: teamData?.data?.logoUrl || "",
            address: teamData?.data?.address || "",
            website: teamData?.data?.website || "",
            founded: teamData?.data?.founded || undefined,
            clubColors: teamData?.data?.clubColors || "",
            venue: teamData?.data?.venue || "",
        });
    }, [teamData]);

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
                                    {t("private/team:table.column.name")}
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
                        name="shortName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/team:table.column.countryCode")}
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
                        name="tla"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/team:table.column.flag")}
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
                                    {t("private/team:table.column.parent")}
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