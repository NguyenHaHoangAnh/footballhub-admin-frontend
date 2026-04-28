"use client";

import { MatchDto } from "@/app/types/match";
import { Mode } from "@/app/types/modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import AreaForm from "./area-form";
import { useTranslation } from "react-i18next";

export default function AreaDialogView({
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
    const { t } = useTranslation(["private/area"]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("private/area:dialog.view.title")}</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <AreaForm 
                    selectedEtt={selectedEtt}
                    mode={mode}
                    onOpenChange={onOpenChange}
                />
            </DialogContent>
        </Dialog>
    )
}