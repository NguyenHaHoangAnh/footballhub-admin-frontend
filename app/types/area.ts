export type AreaDto = {
    areaId: number;
    name: string;
    countryCode: string;
    flagUrl: string | null;
    parentAreaId: number | null;
    parentArea: string | null;
    thirdPartyId: number | null;
    createdAt: string | null;
    createdBy: string | null;
    updatedAt: string | null;
    updatedBy: string | null;
}

export type AreaRequestDto = {
    name: string;
    countryCode: string;
    flagUrl?: string | null;
    parentAreaId?: number | null;
    parentArea?: string | null;
}