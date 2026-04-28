import { AreaDto } from "./area";

export type TeamDto = {
    teamId: number;
    name: string;
    shortName: string | null;
    tla: string | null;
    areaId: number;
    area?: AreaDto | null;
    logoUrl: string | null;
    address: string | null;
    website: string | null;
    founded: number | null;
    clubColors: string | null;
    venue: string | null;
    thirdPartyId: number | null;
    createdAt: Date | null;
    createdBy: string | null;
    updatedAt: Date | null;
    updatedBy: string | null;
}

export type TeamRequestDto = {
    name: string;
    shortName?: string;
    tla?: string;
    areaId: number;
    logoUrl?: string;
    address?: string;
    website?: string;
    founded?: number;
    clubColors?: string;
    venue?: string;
    thirdPartyId?: number;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
}

export type TeamUpdateManuallyRequestDto = {
    season: number;
}