import { SeasonRequestDto, SeasonUpdateManuallyRequestDto } from "@/app/types/season";
import axiosInstanceManage from "../axios-instance-manage";

export async function updateManually({
    payload
}: {
    payload: SeasonUpdateManuallyRequestDto;
}) {
    try {
        const response = await axiosInstanceManage.post("/seasons/updateManually", payload);

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
        const response = await axiosInstanceManage.get(`/seasons?${params}`);

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
        const response = await axiosInstanceManage.get(`/seasons/${id}`);

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
        const response = await axiosInstanceManage.get(`/seasons/competition/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function findParentAreas() {
    try {
        const response = await axiosInstanceManage.get("/seasons/parentAreas");

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
        const response = await axiosInstanceManage.post("/seasons", payload);

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
        const response = await axiosInstanceManage.put(`/seasons/${id}`, payload);

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
        const response = await axiosInstanceManage.delete(`/seasons/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}