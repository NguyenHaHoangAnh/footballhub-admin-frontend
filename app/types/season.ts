import { CompetitionDto } from "./competition";
import { TeamDto } from "./team";

export type SeasonDto = {
    seasonId: number;
    name: string | null;
    competitionId: number;
    competition?: CompetitionDto | null;
    year: number | null;
    startDate: Date | null;
    endDate: Date | null;
    currentMatchDay: number | null;
    winnerId: number | null;
    winner?: TeamDto | null;
    thirdPartyId: number | null;
    createdAt: Date | null;
    createdBy: string | null;
    updatedAt: Date | null;
    updatedBy: string | null;
}

export type SeasonRequestDto = {
    name?: string;
    year?: number;
    competitionId: number;
    startDate?: Date;
    endDate?: Date;
    currentMatchDay?: number;
    winnerId?: number;
    thirdPartyId?: number;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
}

export type SeasonUpdateManuallyRequestDto = {
    season: number;
}