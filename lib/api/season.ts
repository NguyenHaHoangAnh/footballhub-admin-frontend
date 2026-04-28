import { SeasonRequestDto, SeasonUpdateManuallyRequestDto } from "@/app/types/season";
import axiosInstanceBase from "../axios-instance-base";

export async function updateManually({
    payload
}: {
    payload: SeasonUpdateManuallyRequestDto;
}) {
    try {
        const response = await axiosInstanceBase.post("/seasons/updateManually", payload);

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
        const response = await axiosInstanceBase.get(`/seasons?${params}`);

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
        const response = await axiosInstanceBase.get(`/seasons/${id}`);

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
        const response = await axiosInstanceBase.get(`/seasons/competition/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function findParentAreas() {
    try {
        const response = await axiosInstanceBase.get("/seasons/parentAreas");

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function create({
    payload,
}: {
    payload: SeasonRequestDto;
}) {
    try {
        const response = await axiosInstanceBase.post("/seasons", payload);

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
    payload: SeasonRequestDto;
}) {
    try {
        const response = await axiosInstanceBase.put(`/seasons/${id}`, payload);

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
        const response = await axiosInstanceBase.delete(`/seasons/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}