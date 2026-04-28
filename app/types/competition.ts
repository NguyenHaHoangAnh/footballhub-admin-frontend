import { AreaDto } from "./area";

export type CompetitionDto = {
    competitionId: number;
    areaId: number;
    area?: AreaDto | null;
    name: string;
    code: string;
    type: string;
    logoUrl: string | null;
    currentSeasonId: string | null;
    thirdPartyId: string | null;
    createdAt: Date | null;
    createdBy: string | null;
    updatedAt: Date | null;
    updatedBy: string | null;
}

export type CompetitionRequestDto = {
    areaId: number;
    name: string;
    code: string;
    type: string;
    logoUrl?: string;
    currentSeasonId: number;
}

export type CompetitionResponseDto = {
    competitionId: number;
    areaId: number | null;
    areaName: string | null;
    name: string | null;
    code: string | null;
    type: string | null;
    logoUrl: string | null;
    currentSeasonId: number | null;
    currentSeasonName: string | null;
}