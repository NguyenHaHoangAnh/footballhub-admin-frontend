"use client";

import { Button } from "@/components/ui/button";
import { findAll, updateManually } from "@/lib/api/competition";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useColumns } from "./config";
import CustomTable, { useCustomTable } from "@/components/CustomTable";
import { getParams } from "@/lib/utils";
import { CompetitionDto } from "@/app/types/competition";
import { useMemo, useState } from "react";
import { Mode } from "@/app/types/modal";
import { toast } from "sonner";
import CompetitionDialogCreate from "./competition-dialog-create"
import CompetitionDialogEdit from "./competition-dialog-edit";
import CompetitionDialogView from "./competition-dialog-view"
import CompetitionDialogDelete from "./competition-dialog-delete";
import { AxiosError } from "axios";

export default function Competition() {
    const { t } = useTranslation(["common", "private/season"]);
    const queryClient = useQueryClient();
    const { filter, sort, pagination } = useCustomTable();
    const columns = useColumns();
    const [selectedEtt, setSelectedEtt] = useState<CompetitionDto | null>(null);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [mode, setMode] = useState<Mode>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>();

    const { data } = useQuery({
        queryKey: ["findAllCompetitions", filter, sort, pagination],
        queryFn: () => findAll({
            params: getParams(filter, sort, pagination)
        }),
    });

    const updateManuallyApi = useMutation({
        mutationKey: ["updateCompetitionManually"],
        mutationFn: updateManually,
        onSuccess: (data) => {
            if (data?.data) {
                toast.success(t("private/season:message.updateManually.success", { value: data.data.length }), {
                    duration: 5000,
                    position: "top-center"
                });
            }
            queryClient.invalidateQueries({
                queryKey: ["findAllCompetitions", filter, sort, pagination]
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

    const handleUpdateManually = async () => {
        setIsSubmitting(true);
        updateManuallyApi.mutate();
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

    const handleView = (row: CompetitionDto) => {
        setSelectedEtt(row);
        onOpenModalChange();
        setMode("view");
    }

    const handleEdit = (row: CompetitionDto) => {
        setSelectedEtt(row);
        onOpenModalChange();
        setMode("edit");
    }

    const handleDelete = (row: CompetitionDto) => {
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

            <CompetitionDialogCreate
                selectedEtt={selectedEtt}
                open={openModal && (mode === "create")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <CompetitionDialogView
                selectedEtt={selectedEtt}
                open={openModal && (mode === "view")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <CompetitionDialogEdit 
                selectedEtt={selectedEtt}
                open={openModal && (mode === "edit")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <CompetitionDialogDelete 
                selectedEtt={selectedEtt}
                open={openModal && (mode === "delete")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
        </div>
    );
}