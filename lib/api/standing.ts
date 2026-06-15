import { StandingUpdateManuallyRequestDto } from "@/app/types/standing";
import axiosInstanceManage from "../axios-instance-manage";

export async function updateManually({
    payload
}: {
    payload: StandingUpdateManuallyRequestDto;
}) {
    try {
        const response = await axiosInstanceManage.post("/standings/updateManually", payload);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

export async function findByCompetitionIdAndSeasonId({
    payload
}: {
    payload: StandingUpdateManuallyRequestDto;
}) {
    try {
        const response = await axiosInstanceManage.post("/standings", payload);

        return Promise.resolve(response.data);
    } catch (error) {
        return Promise.reject(error);
    }
}

// export async function findAll({
//     params
// }: {
//     params: string;
// }) {
//     try {
//         const response = await axiosInstanceManage.get(`/standings?${params}`);

//         return Promise.resolve(response.data);
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }

// export async function findById({
//     id,
// }: {
//     id: number;
// }) {
//     try {
//         const response = await axiosInstanceManage.get(`/standings/${id}`);

//         return Promise.resolve(response.data);
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }

// export async function findParentAreas() {
//     try {
//         const response = await axiosInstanceManage.get("/standings/parentAreas");

//         return Promise.resolve(response.data);
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }

// export async function create({
//     payload,
// }: {
//     payload: StandingRequestDto;
// }) {
//     try {
//         const response = await axiosInstanceManage.post("/standings", payload);

//         return Promise.resolve(response.data);
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }

// export async function update({
//     id,
//     payload,
// }: {
//     id: number;
//     payload: StandingRequestDto;
// }) {
//     try {
//         const response = await axiosInstanceManage.put(`/standings/${id}`, payload);

//         return Promise.resolve(response.data);
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }

// export async function del({
//     id,
// }: {
//     id: number;
// }) {
//     try {
//         const response = await axiosInstanceManage.delete(`/standings/${id}`);

//         return Promise.resolve(response.data);
//     } catch (error) {
//         return Promise.reject(error);
//     }
// }