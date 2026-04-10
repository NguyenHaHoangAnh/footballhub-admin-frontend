import { SideBarDto } from "@/app/types/sidebar";

const ROOT_ID = 0;

export const getChildren = (itemMap: Map<number, SideBarDto>, parent: SideBarDto) => {
    if (parent.objectType !== "G") return null;

    const children: SideBarDto[] = [];
    itemMap.forEach((value: SideBarDto, key: number) => {
        if (value.parentId === parent.objectId) {
            children.push(value);
        }
    });

    return children.length > 0 ? children : null;
}

export const getSidebar = (data: SideBarDto[]) => {
    // Filter những item có isRender = 0
    const sidebar = data.filter((item) => item.isRender === "1");
    // Lấy item có parentId = ROOT_ID làm parent
    let parents: SideBarDto[] = sidebar.filter((item) => item.parentId === ROOT_ID);
    if (parents.length === 0) {
        // Nếu ko có parent thì tạo set chứa các objectId
        // Item nào có parentId ko nằm trong set thì chọn làm parent
        const objectIdSet = new Set(sidebar.map((item) => item.objectId));
        parents = sidebar.filter((item) => !objectIdSet.has(item.parentId));
    }

    // Tạo map chứa các item
    const itemMap = new Map<number, SideBarDto>(sidebar.map((item) => [item.objectId, item]));
    // Tạo sidebar
    parents = parents.map((item) => ({
        ...item,
        children: getChildren(itemMap, item),
    }));

    return parents;
}