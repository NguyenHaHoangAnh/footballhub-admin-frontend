"use client";

import { CompetitionDto } from "@/app/types/competition";
import { Mode } from "@/app/types/modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CompetitionForm from "./competition-form";
import { useTranslation } from "react-i18next";

export default function CompetitionDialogView({
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/competition:dialog.view.title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <CompetitionForm 
                    selectedEtt={selectedEtt}
                    mode={mode}
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    )
}