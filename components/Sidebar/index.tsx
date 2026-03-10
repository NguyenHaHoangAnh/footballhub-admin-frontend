"use client";

import { SideBar } from "@/app/types/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { sidebar } from "./config";
import { getSidebar } from "./helper";
import Link from "next/link";

export default function Sidebar() {
    const renderItem = (item: SideBar) => {
        if (!item.children) {
            return (
                <ChildItem item={item} />
            );
        }

        return (
            <Collapsible key={item.objectId}>
                <CollapsibleTrigger asChild>
                    <div>{item.name}</div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <div>
                        {item.children.map((child) => renderItem(child))}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        );
    }

    return (
        <div>
            {sidebar && getSidebar(sidebar).map((item) => renderItem(item))}
        </div>
    );
}

function ChildItem({
    item
}: {
    item: SideBar
}) {
    return (
        <Link
            href={item.path}
        >
            <div>{item.name}</div>
        </Link>
    );
}