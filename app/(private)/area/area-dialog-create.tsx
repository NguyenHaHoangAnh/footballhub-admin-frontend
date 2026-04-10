"use client";

import { AreaDto, AreaRequestDto } from "@/app/types/area";
import { Mode } from "@/app/types/modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AreaForm from "./area-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "@/lib/api/area";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCustomTable } from "@/components/CustomTable";
import { AxiosError } from "axios";

export default function AreaDialogCreate({
    selectedEtt,
    open,
    onOpenChange,
    mode,
}: {
    selectedEtt: AreaDto | null;
    open: boolean;
    onOpenChange: () => void;
    mode: Mode;
}) {
    const { t } = useTranslation(["private/area"]);
    const queryClient = useQueryClient();
    const { filter, sort, pagination } = useCustomTable();
    
    const createApi = useMutation({
        mutationKey: ["createArea"],
        mutationFn: create,
        onSuccess: () => {
            toast.success(t("private/area:message.create.success"), {
                duration: 5000,
                position: "top-center",
            });
            queryClient.invalidateQueries({
                queryKey: ["findAllAreas", filter, sort, pagination]
            });
            onOpenChange();
        },
        onError: (error) => {
            let message = t("private/area:message.create.error");

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

    const handleSubmit = async (value: AreaRequestDto) => {
        console.log('[value]', value);
        createApi.mutate({
            payload: value,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/area:dialog.create.title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <AreaForm 
                    selectedEtt={selectedEtt}
                    mode={mode}
                    onSubmit={handleSubmit}
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    )
}