"use client";

import { AreaDto } from "@/app/types/area";
import { Mode } from "@/app/types/modal";
import { useCustomTable } from "@/components/CustomTable";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { del } from "@/lib/api/area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function AreaDialogDelete({
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
    const { t } = useTranslation(["common", "private/area"]);
    const queryClient = useQueryClient();
    const { filter, sort, pagination } = useCustomTable();

    const deleteApi = useMutation({
        mutationKey: ["deleteArea"],
        mutationFn: (data: { id: number }) => del(data),
        onSuccess: () => {
            toast.success(t("private/area:message.delete.success"), {
                duration: 5000,
                position: "top-center",
            });
            queryClient.invalidateQueries({
                queryKey: ["findAllAreas", filter, sort, pagination]
            });
            onOpenChange();
        },
        onError: (error) => {
            let message = t("private/area:message.delete.error");

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

    const handleSubmit = async () => {
        if (!selectedEtt) return;
        deleteApi.mutate({
            id: selectedEtt.areaId,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/area:dialog.delete.title")}</DialogTitle>
                    <DialogDescription>
                        {t("private/area:dialog.delete.description", { 
                            name: selectedEtt?.name || "" 
                        })}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant="ghost"                        >
                            {t("common:button.cancel")}
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        onClick={handleSubmit}
                    >
                        {t("common:button.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}