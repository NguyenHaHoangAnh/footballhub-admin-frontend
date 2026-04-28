"use client";

import { CompetitionDto, CompetitionRequestDto } from "@/app/types/competition";
import { Mode } from "@/app/types/modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CompetitionForm from "./competition-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "@/lib/api/competition";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCustomTable } from "@/components/CustomTable";
import { AxiosError } from "axios";

export default function CompetitionDialogCreate({
    selectedEtt,
    open,
    onOpenChange,
    mode,
}: {
    selectedEtt: CompetitionDto | null;
    open: boolean;
    onOpenChange: () => void;
    mode: Mode;
}) {
    const { t } = useTranslation(["private/competition"]);
    const queryClient = useQueryClient();
    const { filter, sort, pagination } = useCustomTable();
    
    const createApi = useMutation({
        mutationKey: ["createCompetition"],
        mutationFn: create,
        onSuccess: () => {
            toast.success(t("private/competition:message.create.success"), {
                duration: 5000,
                position: "top-center",
            });
            queryClient.invalidateQueries({
                queryKey: ["findAllCompetitions", filter, sort, pagination]
            });
            onOpenChange();
        },
        onError: (error) => {
            let message = t("private/competition:message.create.error");

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

    const handleSubmit = async (value: CompetitionRequestDto) => {
        console.log('[value]', value);
        createApi.mutate({
            payload: value,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/competition:dialog.create.title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <CompetitionForm 
                    selectedEtt={selectedEtt}
                    mode={mode}
                    onSubmit={handleSubmit}
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    )
}