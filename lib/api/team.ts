import { TeamRequestDto, TeamUpdateManuallyRequestDto } from "@/app/types/team";
import axiosInstanceManage from "../axios-instance-manage";

export async function updateManually({
    payload
}: {
    payload: TeamUpdateManuallyRequestDto;
}) {
    try {
        const response = await axiosInstanceManage.post("/teams/updateManually", payload);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function findAll({
    params
}: {
    params: string;
}) {
    try {
        const response = await axiosInstanceManage.get(`/teams?${params}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function findById({
    id,
}: {
    id: number;
}) {
    try {
        const response = await axiosInstanceManage.get(`/teams/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function findByCompetitionId({
    id,
}: {
    id: number;
}) {
    try {
        const response = await axiosInstanceManage.get(`/teams/competition/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function create({
    payload,
}: {
    payload: TeamRequestDto;
}) {
    try {
        const response = await axiosInstanceManage.post("/teams", payload);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function update({
    id,
    payload,
}: {
    id: number;
    payload: TeamRequestDto;
}) {
    try {
        const response = await axiosInstanceManage.put(`/teams/${id}`, payload);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function del({
    id,
}: {
    id: number;
}) {
    try {
        const response = await axiosInstanceManage.delete(`/teams/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}