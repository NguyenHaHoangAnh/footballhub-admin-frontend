import { CompetitionRequestDto } from "@/app/types/competition";
import axiosInstanceManage from "../axios-instance-manage";

export async function updateManually() {
    try {
        const response = await axiosInstanceManage.post("/competitions/updateManually");

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
        const response = await axiosInstanceManage.get(`/competitions?${params}`);

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
        const response = await axiosInstanceManage.get(`/competitions/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function create({
    payload,
}: {
    payload: CompetitionRequestDto;
}) {
    try {
        const response = await axiosInstanceManage.post("/competitions", payload);

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
    payload: CompetitionRequestDto;
}) {
    try {
        const response = await axiosInstanceManage.put(`/competitions/${id}`, payload);

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
        const response = await axiosInstanceManage.delete(`/competitions/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}