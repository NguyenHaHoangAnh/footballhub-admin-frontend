"use client";

import { Eye, Pen, Trash2 } from "lucide-react";
import { Button } from "../ui/button";

type ControllerValue = "C" | "R" | "U" | "D";

export default function CustomController<T>({
    className,
    controller,
    selectedEtt,
    onCreate,
    onView,
    onEdit,
    onDelete,
}: {
    className?: string;
    controller: ControllerValue[];
    selectedEtt: T;
    onCreate?: () => void;
    onView?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
}) {
    return (
        <>
            {controller.includes("R") && (
                <Button
                    className="p-3 w-5 h-5 rounded-full"
                    onClick={() => onView?.(selectedEtt)}
                >
                    <Eye className="w-4 h-4" />
                </Button>
            )}
            {controller.includes("U") && (
                <Button
                    className="p-3 w-5 h-5 rounded-full"
                    onClick={() => onEdit?.(selectedEtt)}
                >
                    <Pen className="w-4 h-4" />
                </Button>
            )}
            {controller.includes("D") && (
                <Button
                    className="p-3 w-5 h-5 rounded-full"
                    onClick={() => onDelete?.(selectedEtt)}
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            )}
        </>
    )
}