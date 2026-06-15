import { AreaDto } from "./area";
import { CompetitionDto } from "./competition";
import { SeasonDto } from "./season";
import { TeamDto } from "./team";

export type MatchDto = {
    matchId: number;
    areaId: number;
    area?: AreaDto | null;
    competitionId: number;
    competition?: CompetitionDto | null;
    seasonId: number;
    season?: SeasonDto | null;
    startDate: Date | null;
    status: string | null;
    matchDay: number | null;
    homeTeamId: number | null;
    homeTeam?: TeamDto | null;
    awayTeamId: number | null;
    awayTeam?: TeamDto | null;
    scoreHome: number | null;
    scoreAway: number | null;
    winnerId: number | null;
    winner?: TeamDto | null;
    thirdPartyId: number | null;
    createdAt: Date | null;
    createdBy: string | null;
    updatedAt: Date | null;
    updatedBy: string | null;
}

export type MatchRequestDto = {
    areaId: number;
    competitionId: number;
    seasonId: number;
    startDate?: Date;
    status?: string;
    matchDay?: number;
    homeTeamId: number;
    awayTeamId: number;
    scoreHome?: number;
    scoreAway?: number;
    winnerId?: number;
    thirdPartyId?: number;
    createdAt?: Date;
    createdBy?: string;
    updatedAt?: Date;
    updatedBy?: string;
}

export type MatchUpdateManuallyRequestDto = {
    competitionId: number;
    seasonId: number;
    matchDay: number;
}