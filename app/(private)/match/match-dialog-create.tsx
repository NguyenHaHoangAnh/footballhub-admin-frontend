"use client";

import { MatchDto, MatchRequestDto } from "@/app/types/match";
import { Mode } from "@/app/types/modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MatchForm from "./match-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "@/lib/api/match";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCustomTable } from "@/components/CustomTable";
import { AxiosError } from "axios";

export default function MatchDialogCreate({
    selectedEtt,
    open,
    onOpenChange,
    mode,
}: {
    selectedEtt: MatchDto | null;
    open: boolean;
    onOpenChange: () => void;
    mode: Mode;
}) {
    const { t } = useTranslation(["private/match"]);
    const queryClient = useQueryClient();
    const { filter, sort, pagination } = useCustomTable();
    
    const createApi = useMutation({
        mutationKey: ["createMatch"],
        mutationFn: create,
        onSuccess: () => {
            toast.success(t("private/match:message.create.success"), {
                duration: 5000,
                position: "top-center",
            });
            queryClient.invalidateQueries({
                queryKey: ["findAllMatches", filter, sort, pagination]
            });
            onOpenChange();
        },
        onError: (error) => {
            let message = t("private/match:message.create.error");

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

    const handleSubmit = async (value: MatchRequestDto) => {
        console.log('[value]', value);
        createApi.mutate({
            payload: value,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/match:dialog.create.title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <MatchForm 
                    selectedEtt={selectedEtt}
                    mode={mode}
                    onSubmit={handleSubmit}
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    )
}