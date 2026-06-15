"use client";

import { SideBarDto } from "@/app/types/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useSidebar } from "./config";
import { getSidebar } from "./helper";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const sidebar = useSidebar();
    
    return (
        <div
            className="fixed px-4 py-2 w-64 h-full bg-white"
        >
            {sidebar && getSidebar(sidebar).map((item) => renderItem(item))}
        </div>
    );
}

function renderItem(item: SideBarDto, isChild = false) {
    if (!item.children) {
        return (
            <ChildItem key={item.objectId} item={item} isChild={isChild} />
        );
    } else {
        return (
            <ParentItem key={item.objectId} item={item} />
        );
    }
}

function ParentItem({
    item
}: {
    item: SideBarDto;
}) {
    const [open, setOpen] = useState<boolean>(true);
    const pathName = usePathname();
    const active = useMemo(() => item.children?.find((item) => item.path === pathName) ? true : false, [item, pathName]);

    const openChange = () => {
        setOpen(!open);
    }

    return (
        <Collapsible key={item.objectId} open={open} onOpenChange={openChange}>
            <CollapsibleTrigger asChild>
                <div
                    className="flex justify-between items-center px-4 py-2 w-full hover:bg-gray-200 rounded-md cursor-pointer"
                >
                    <div
                        className={`${active && "text-primary"}`}
                    >
                        {item.name}
                    </div>
                    <ChevronRight 
                        className={`w-4 h-4 transition-all duration-300 ${open && "rotate-90"}`}
                    />
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent
                className={`transition-all overflow-hidden ${open ? "animate-collapsible-slide-down" : "animate-collapsible-slide-up"}`}
            >
                {item?.children && item.children.map((child) => renderItem(child, true))}
            </CollapsibleContent>
        </Collapsible>
    );
}

function ChildItem({
    item,
    isChild = false
}: {
    item: SideBarDto,
    isChild?: boolean;
}) {
    const pathName = usePathname();
    const active = useMemo(() => item.path === pathName, [item, pathName]);

    return (
        <Link
            href={item.path}
            className={`flex px-4 py-2 ${isChild && "pl-8"} w-full hover:bg-gray-200 ${active && "text-primary"} rounded-md`}
        >
            {item.name}
        </Link>
    );
}