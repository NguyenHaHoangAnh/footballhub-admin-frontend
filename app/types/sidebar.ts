export type ObjectType = "G" | "M" | "F";

export type IsRender = "0" | "1";

export type SideBar = {
    objectId: number;
    parentId: number;
    objectType: ObjectType;
    name: string;
    description: string | null;
    status: number;
    path: string;
    isRender: IsRender;
    icon: string | null;
    children?: SideBar[] | null;
};