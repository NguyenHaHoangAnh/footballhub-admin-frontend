"use client";

import { TeamDto, TeamRequestDto } from "@/app/types/team";
import { Mode } from "@/app/types/modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TeamForm from "./team-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from "@/lib/api/team";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useCustomTable } from "@/components/CustomTable";
import { AxiosError } from "axios";

export default function TeamDialogCreate({
    selectedEtt,
    open,
    onOpenChange,
    mode,
}: {
    selectedEtt: TeamDto | null;
    open: boolean;
    onOpenChange: () => void;
    mode: Mode;
}) {
    const { t } = useTranslation(["private/team"]);
    const queryClient = useQueryClient();
    const { filter, sort, pagination } = useCustomTable();
    
    const createApi = useMutation({
        mutationKey: ["createTeam"],
        mutationFn: create,
        onSuccess: () => {
            toast.success(t("private/team:message.create.success"), {
                duration: 5000,
                position: "top-center",
            });
            queryClient.invalidateQueries({
                queryKey: ["findAllTeams", filter, sort, pagination]
            });
            onOpenChange();
        },
        onError: (error) => {
            let message = t("private/team:message.create.error");

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

    const handleSubmit = async (value: TeamRequestDto) => {
        console.log('[value]', value);
        createApi.mutate({
            payload: value,
        });
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/team:dialog.create.title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <TeamForm 
                    selectedEtt={selectedEtt}
                    mode={mode}
                    onSubmit={handleSubmit}
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    )
}