"use client";

import { TeamDto } from "@/app/types/team";
import { Mode } from "@/app/types/modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TeamForm from "./team-form";
import { useTranslation } from "react-i18next";

export default function TeamDialogView({
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/team:dialog.view.title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <TeamForm 
                    selectedEtt={selectedEtt}
                    mode={mode}
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    )
}