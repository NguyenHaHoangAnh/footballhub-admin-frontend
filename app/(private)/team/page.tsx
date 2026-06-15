"use client";

import { Button } from "@/components/ui/button";
import { findAll, updateManually } from "@/lib/api/team";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useColumns } from "./config";
import CustomTable, { useCustomTable } from "@/components/CustomTable";
import { getParams } from "@/lib/utils";
import { TeamDto } from "@/app/types/team";
import { useMemo, useState } from "react";
import { Mode } from "@/app/types/modal";
import { toast } from "sonner";
import TeamDialogCreate from "./team-dialog-create"
import TeamDialogEdit from "./team-dialog-edit";
import TeamDialogView from "./team-dialog-view"
import TeamDialogDelete from "./team-dialog-delete";
import { AxiosError } from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Team() {
    const { t } = useTranslation(["common", "private/team"]);
    const queryClient = useQueryClient();
    const { filter, sort, pagination } = useCustomTable();
    const columns = useColumns();
    const [selectedEtt, setSelectedEtt] = useState<TeamDto | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [mode, setMode] = useState<Mode>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>();
    const [season, setSeason] = useState<number>(2025);

    const { data } = useQuery({
        queryKey: ["findAllTeams", filter, sort, pagination],
        queryFn: () => findAll({
            params: getParams(filter, sort, pagination)
        }),
    });

    const updateManuallyApi = useMutation({
        mutationKey: ["updateTeamManually"],
        mutationFn: updateManually,
        onSuccess: (data) => {
            if (data?.data) {
                toast.success(t("private/team:message.updateManually.success", { value: data.data.length }), {
                    duration: 5000,
                    position: "top-center"
                });
            }
            queryClient.invalidateQueries({
                queryKey: ["findAllTeams", filter, sort, pagination]
            });
            setIsSubmitting(false);
        },
        onError: (error) => {
            let message = t("private/team:message.updateManually.error");

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

    const handleView = (row: TeamDto) => {
        setSelectedEtt(row);
        onOpenModalChange();
        setMode("view");
    }

    const handleEdit = (row: TeamDto) => {
        setSelectedEtt(row);
        onOpenModalChange();
        setMode("edit");
    }

    const handleDelete = (row: TeamDto) => {
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
                    <div>{t("private/team:teamUpdate")}</div>
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

            <TeamDialogCreate
                selectedEtt={selectedEtt}
                open={openModal && (mode === "create")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <TeamDialogView
                selectedEtt={selectedEtt}
                open={openModal && (mode === "view")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <TeamDialogEdit 
                selectedEtt={selectedEtt}
                open={openModal && (mode === "edit")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <TeamDialogDelete 
                selectedEtt={selectedEtt}
                open={openModal && (mode === "delete")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
        </div>
    );
}