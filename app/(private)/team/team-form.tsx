"use client";

import { Mode } from "@/app/types/modal";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo, useState } from "react";
import { TeamDto, TeamRequestDto } from "@/app/types/team";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { findParentAreas } from "@/lib/api/area";
import { findById } from "@/lib/api/team";
import { findAll as findAllAreas } from "@/lib/api/area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandItem, CommandList } from "@/components/ui/command";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { getParams } from "@/lib/utils";
import { AreaDto } from "@/app/types/area";

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
    const [areaSearch, setAreaSearch] = useState<string>("");
    const areaSearchDebounce = useDebounce(areaSearch, 500);
    const [areaOpen, setAreaOpen] = useState<boolean>(false);

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
            .number()
            .min(1, t("private/team:message.form.notNull")),
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

    const areaSelect = useMemo(() => {
        if (!areaData?.data?.content) return null;
        const areas: { [key: string]: string } = {};
        areaData.data.content.forEach((area: AreaDto) => {
            areas[area.areaId.toString()] = area.name;
        });
        return areas;
    }, [areaData?.data?.content]);

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
                                        disabled={mode === "view"}
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
                                    {t("private/team:table.column.shortName")}
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
                        name="tla"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/team:table.column.tla")}
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
                                                value={areaSelect?.[field.value] || teamData?.data?.areaName || ""}
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
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <FormField 
                        control={form.control}
                        name="logoUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/team:table.column.logoUrl")}
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
                        name="address"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/team:table.column.address")}
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
                        name="website"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/team:table.column.website")}
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
                        name="founded"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/team:table.column.founded")}
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
                        name="clubColors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/team:table.column.clubColors")}
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
                        name="venue"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("private/team:table.column.venue")}
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