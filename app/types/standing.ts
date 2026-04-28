export type StandingDto = {
    standingId: number;
    areaId: number;
    competitionId: number;
    seasonId: number;
    teamId: number;
    playedGames: number | null;
    form: string | null;
    won: number | null;
    draw: number | null;
    lost: number | null;
    points: number | null;
    goalsFor: number | null;
    goalsAgainst: number | null;
    goalsDifference: number | null;
    createdAt: Date | null;
    createdBy: string | null;
    updatedAt: Date | null;
    updatedBy: string | null;
}

export type StandingUpdateManuallyRequestDto = {
    competitionId: number;
    seasonId: number;
}

export type StandingResponseDto = {
    standingId: number;
    areaId: number;
    competitionId: number;
    seasonId: number;
    teamId: number;
    position: number;
    teamName: string | null;
    teamLogoUrl: string | null;
    playedGames: number | null;
    form: string | null;
    won: number | null;
    draw: number | null;
    lost: number | null;
    points: number | null;
    goalsFor: number | null;
    goalsAgainst: number | null;
    goalsDifference: number | null;
    createdAt: Date | null;
    createdBy: string | null;
    updatedAt: Date | null;
    updatedBy: string | null;
}