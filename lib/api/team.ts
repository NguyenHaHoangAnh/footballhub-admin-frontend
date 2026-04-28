import { TeamRequestDto, TeamUpdateManuallyRequestDto } from "@/app/types/team";
import axiosInstanceBase from "../axios-instance-base";

export async function updateManually({
    payload
}: {
    payload: TeamUpdateManuallyRequestDto;
}) {
    try {
        const response = await axiosInstanceBase.post("/teams/updateManually", payload);

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
        const response = await axiosInstanceBase.get(`/teams?${params}`);

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
        const response = await axiosInstanceBase.get(`/teams/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function findParentAreas() {
    try {
        const response = await axiosInstanceBase.get("/teams/parentAreas");

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
        const response = await axiosInstanceBase.post("/teams", payload);

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
        const response = await axiosInstanceBase.put(`/teams/${id}`, payload);

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
        const response = await axiosInstanceBase.delete(`/teams/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}