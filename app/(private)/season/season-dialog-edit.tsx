"use client";

import { SeasonDto, SeasonRequestDto } from "@/app/types/season";
import { Mode } from "@/app/types/modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SeasonForm from "./season-form";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { update } from "@/lib/api/season";
import { toast } from "sonner";
import { useCustomTable } from "@/components/CustomTable";
import { AxiosError } from "axios";

export default function SeasonDialogEdit({
    selectedEtt,
    open,
    onOpenChange,
    mode,
}: {
    selectedEtt: SeasonDto | null;
    open: boolean;
    onOpenChange: () => void;
    mode: Mode;
}) {
    const { t } = useTranslation(["private/season"]);
    const queryClient = useQueryClient();
    const { filter, sort, pagination } = useCustomTable();

    const updateApi = useMutation({
        mutationKey: ["updateSeason"],
        mutationFn: (data: {id: number, payload: SeasonRequestDto}) => update(data),
        onSuccess: () => {
            toast.success(t("private/season:message.edit.success"), {
                duration: 5000,
                position: "top-center",
            });
            queryClient.invalidateQueries({
                queryKey: ["findAllSeasons", filter, sort, pagination]
            });
            queryClient.invalidateQueries({
                queryKey: ["findSeason", selectedEtt?.seasonId]
            });
            onOpenChange();
        },
        onError: (error) => {
            let message = t("private/season:message.edit.error");

            const axiosError = error as AxiosError<any>;
            if (axiosError?.response?.data?.resultMsg) {
                message = axiosError.response.data.resultMsg;
            }
            
            toast.error(message, {
                duration: 5000,
                position: "top-center",
            });
        }
    });

    const handleSubmit = async (value: SeasonRequestDto) => {
        if (!selectedEtt) return;
        console.log('[value]', value);
        updateApi.mutate({
            id: selectedEtt.seasonId, 
            payload: value}
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/season:dialog.edit.title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <SeasonForm 
                    selectedEtt={selectedEtt}
                    mode={mode}
                    onSubmit={handleSubmit}
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    )
}