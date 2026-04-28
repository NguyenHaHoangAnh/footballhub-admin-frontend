"use client";

import { SeasonDto, SeasonRequestDto } from "@/app/types/season";
import { Mode } from "@/app/types/modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SeasonForm from "./season-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "@/lib/api/area";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCustomTable } from "@/components/CustomTable";
import { AxiosError } from "axios";

export default function SeasonDialogCreate({
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
    
    const createApi = useMutation({
        mutationKey: ["createArea"],
        mutationFn: create,
        onSuccess: () => {
            toast.success(t("private/season:message.create.success"), {
                duration: 5000,
                position: "top-center",
            });
            queryClient.invalidateQueries({
                queryKey: ["findAllAreas", filter, sort, pagination]
            });
            onOpenChange();
        },
        onError: (error) => {
            let message = t("private/season:message.create.error");

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
        console.log('[value]', value);
        // createApi.mutate({
        //     payload: value,
        // });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/season:dialog.create.title")}</DialogTitle>
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