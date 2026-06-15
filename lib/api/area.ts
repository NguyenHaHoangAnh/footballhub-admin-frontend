import { AreaRequestDto } from "@/app/types/area";
import axiosInstanceManage from "../axios-instance-manage";

export async function updateManually() {
    try {
        const response = await axiosInstanceManage.post("/areas/updateManually");

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
        const response = await axiosInstanceManage.get(`/areas?${params}`);

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
        const response = await axiosInstanceManage.get(`/areas/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function findParentAreas() {
    try {
        const response = await axiosInstanceManage.get("/areas/parentAreas");

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function create({
    payload,
}: {
    payload: AreaRequestDto;
}) {
    try {
        const response = await axiosInstanceManage.post("/areas", payload);

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
    payload: AreaRequestDto;
}) {
    try {
        const response = await axiosInstanceManage.put(`/areas/${id}`, payload);

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
        const response = await axiosInstanceManage.delete(`/areas/${id}`);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}