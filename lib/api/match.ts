import { MatchRequestDto, MatchUpdateManuallyRequestDto } from "@/app/types/match";
import axiosInstanceBase from "../axios-instance-base";

export async function updateManually({
    payload
}: {
    payload: MatchUpdateManuallyRequestDto;
}) {
    try {
        const response = await axiosInstanceBase.post("/matches/updateManually", payload);

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
        const response = await axiosInstanceBase.get(`/matches?${params}`);

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
        const response = await axiosInstanceBase.get(`/matches/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function findParentAreas() {
    try {
        const response = await axiosInstanceBase.get("/matches/parentAreas");

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function create({
    payload,
}: {
    payload: MatchRequestDto;
}) {
    try {
        const response = await axiosInstanceBase.post("/matches", payload);

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
    payload: MatchRequestDto;
}) {
    try {
        const response = await axiosInstanceBase.put(`/matches/${id}`, payload);

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
        const response = await axiosInstanceBase.delete(`/matches/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}