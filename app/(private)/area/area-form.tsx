"use client";

import { Mode } from "@/app/types/modal";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import { AreaDto, AreaRequestDto } from "@/app/types/area";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { findById, findParentAreas } from "@/lib/api/area";

export default function AreaForm({
    selectedEtt,
    mode,
    onSubmit,
    onOpenChange,
}: {
    selectedEtt: AreaDto | null;
    mode: Mode;
    onSubmit?: (value: AreaRequestDto) => void;
    onOpenChange: () => void;
}) {
    const { t } = useTranslation(["common", "private/area"]);

    const FormSchema = z.object({
        name: z
            .string()
            .trim()
            .min(1, t("private/area:message.form.notNull")),
        countryCode: z
            .string()
            .trim()
            .min(1, t("private/area:message.form.notNull")),
        flagUrl: z
            .string()
            .trim()
            .optional(),
        parentAreaId: z
            .number()
            .optional(),
        parentArea: z
            .string()
            .trim()
            .optional(),
    });

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        mode: "onChange",
        defaultValues: {
            name: "",
            countryCode: "",
            flagUrl: "",
            parentAreaId: undefined,
            parentArea: "",
        }
    });

    const { data: areaData } = useQuery({
        queryKey: ["findArea", selectedEtt?.areaId],
        enabled: !!selectedEtt?.areaId,
        queryFn: async () => {
            if (!selectedEtt?.areaId) return;
            return findById({ id: selectedEtt.areaId });
        },
    });

    const { data: parentAreaData } = useQuery({
        queryKey: ["findParentAreas"],
        queryFn: findParentAreas,
    });

    const parentAreaSelect = useMemo(() => {
        if (!parentAreaData?.data) return null;
        const parentArea: { [key: string]: string } = {};
        parentAreaData.data.forEach((area: AreaDto) => {
            parentArea[area.areaId.toString()] = area.name;
        });
        return parentArea;
    }, [parentAreaData]);

    useEffect(() => {
        if (!areaData?.data || mode === "create") return;
        
        form.reset({
            name: areaData?.data?.name || "",
            countryCode: areaData?.data?.countryCode || "",
            flagUrl: areaData?.data?.flagUrl || "",
            parentAreaId: areaData?.data?.parentAreaId || undefined,
            parentArea: areaData?.data?.parentArea || "",
        });
    }, [areaData]);

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
                                    {t("private/area:table.column.name")}
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
                        name="countryCode"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/area:table.column.countryCode")}
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
                        name="flagUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/area:table.column.flag")}
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
                        name="parentAreaId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/area:table.column.parent")}
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        key={field.value}
                                        disabled={mode === "view"}
                                        value={field.value?.toString() || ""}
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