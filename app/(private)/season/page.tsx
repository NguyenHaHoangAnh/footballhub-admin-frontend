"use client";

import { Button } from "@/components/ui/button";
import { findAll, updateManually } from "@/lib/api/season";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useColumns } from "./config";
import CustomTable, { useCustomTable } from "@/components/CustomTable";
import { getParams } from "@/lib/utils";
import { SeasonDto } from "@/app/types/season";
import { useMemo, useState } from "react";
import { Mode } from "@/app/types/modal";
import { toast } from "sonner";
import SeasonDialogCreate from "./season-dialog-create"
import SeasonDialogEdit from "./season-dialog-edit";
import SeasonDialogView from "./season-dialog-view"
import SeasonDialogDelete from "./season-dialog-delete";
import { AxiosError } from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Season() {
    const { t } = useTranslation(["common", "private/season"]);
    const queryClient = useQueryClient();
    const { filter, sort, pagination } = useCustomTable();
    const columns = useColumns();
    const [selectedEtt, setSelectedEtt] = useState<SeasonDto | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [mode, setMode] = useState<Mode>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>();
    const [season, setSeason] = useState<number>(2025);

    const { data } = useQuery({
        queryKey: ["findAllSeasons", filter, sort, pagination],
        queryFn: () => findAll({
            params: getParams(filter, { ...sort, "seasonId": { column: "seasonId", value: "desc" } }, pagination)
        }),
    });

    const updateManuallyApi = useMutation({
        mutationKey: ["updateAreaManually"],
        mutationFn: updateManually,
        onSuccess: (data) => {
            if (data?.data) {
                toast.success(t("private/season:message.updateManually.success", { value: data.data.length }), {
                    duration: 5000,
                    position: "top-center"
                });
            }
            queryClient.invalidateQueries({
                queryKey: ["findAllSeasons", filter, sort, pagination]
            });
            setIsSubmitting(false);
        },
        onError: (error) => {
            let message = t("private/season:message.updateManually.error");

            const axiosError = error as AxiosError<any>;
            if (axiosError?.response?.data?.resultMsg) {
                message = axiosError.response.data.resultMsg;
            }
            
            toast.error(message, {
                duration: 5000,
                position: "top-center",
            });
            setIsSubmitting(false);
        }
    });

    const getYearList = useMemo(() => {
        const yearList = [];
        const startYear = 2025;
        const endYear = 2023;
        for (let year = startYear; year >= endYear; year--) {
            yearList.push(year);
        }
        return yearList;
    }, []);

    const handleUpdateManually = async () => {
        setIsSubmitting(true);
        updateManuallyApi.mutate({
            payload: {
                season,
            }
        });
    }

    const onOpenModalChange = () => {
        if (openModal) {
            setSelectedEtt(null);
            setMode(null);
        }
        setOpenModal(!openModal);
    }

    const handleCreate = () => {
        setSelectedEtt(null);
        onOpenModalChange();
        setMode("create");
    }

    const handleView = (row: SeasonDto) => {
        setSelectedEtt(row);
        onOpenModalChange();
        setMode("view");
    }

    const handleEdit = (row: SeasonDto) => {
        setSelectedEtt(row);
        onOpenModalChange();
        setMode("edit");
    }

    const handleDelete = (row: SeasonDto) => {
        setSelectedEtt(row);
        onOpenModalChange();
        setMode("delete");
    }

    return (
        <div className="relative">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleCreate}
                        disabled={isSubmitting}
                    >
                        {(t("common:button.create"))}
                    </Button>
                    <Button
                        onClick={handleUpdateManually}
                        disabled={isSubmitting}
                    >
                        {t("common:button.updateManually")}
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <div>{t("private/season:seasonUpdate")}</div>
                    <Select
                        value={season.toString()}
                        onValueChange={(value: string) => {
                            if (!value) return;
                            setSeason(Number(value))
                        }}
                    >
                        <SelectTrigger
                            className="w-20"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                            className="w-20 bg-white"
                        >
                            {getYearList.map((year: number) => (
                                <SelectItem key={year} value={year.toString()}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <CustomTable 
                    columns={columns}
                    data={data?.data?.content}
                    totalElements={data?.data?.totalElements}
                    totalPages={data?.data?.totalPages}
                    controller={["C", "R", "U", "D"]}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            <SeasonDialogCreate
                selectedEtt={selectedEtt}
                open={openModal && (mode === "create")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <SeasonDialogView
                selectedEtt={selectedEtt}
                open={openModal && (mode === "view")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <SeasonDialogEdit 
                selectedEtt={selectedEtt}
                open={openModal && (mode === "edit")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <SeasonDialogDelete 
                selectedEtt={selectedEtt}
                open={openModal && (mode === "delete")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
        </div>
    );
}