"use client";

import { SeasonDto } from "@/app/types/season";
import { Mode } from "@/app/types/modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SeasonForm from "./season-form";
import { useTranslation } from "react-i18next";

export default function SeasonDialogView({
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

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/season:dialog.view.title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <SeasonForm 
                    selectedEtt={selectedEtt}
                    mode={mode}
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    )
}