"use client";

import { Button } from "@/components/ui/button";
import { findByCompetitionIdAndSeasonId, updateManually } from "@/lib/api/standing";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useColumns } from "./config";
import CustomTable, { useCustomTable } from "@/components/CustomTable";
import { getParams } from "@/lib/utils";
import { MatchDto } from "@/app/types/match";
import { useEffect, useMemo, useState } from "react";
import { Mode } from "@/app/types/modal";
import { toast } from "sonner";
// import AreaDialogCreate from "./area-dialog-create"
// import AreaDialogEdit from "./area-dialog-edit";
// import AreaDialogView from "./area-dialog-view"
// import AreaDialogDelete from "./area-dialog-delete";
import { AxiosError } from "axios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { findAll as findAllCompetitions } from "@/lib/api/competition";
import { findByCompetitionId } from "@/lib/api/season";
import { CompetitionDto } from "@/app/types/competition";
import { SeasonDto } from "@/app/types/season";

export default function Match() {
    const { t } = useTranslation(["common", "private/match"]);
    const queryClient = useQueryClient();
    // const { filter, sort, pagination } = useCustomTable();
    const columns = useColumns();
    // const [selectedEtt, setSelectedEtt] = useState<MatchDto | null>(null);
    // const [openModal, setOpenModal] = useState<boolean>(false);
    // const [mode, setMode] = useState<Mode>(null);
    const [isSubmitting, setIsSubmitting] = useState<boolean>();
    const [competitionId, setCompetitionId] = useState<number | null>(null);
    const [seasonId, setSeasonId] = useState<number | null>(null);

    const { data } = useQuery({
        queryKey: ["findStanding", competitionId, seasonId],
        enabled: !!competitionId && !!seasonId,
        queryFn: () => {
            if (!competitionId || !seasonId) return;
            return findByCompetitionIdAndSeasonId({
                payload: {
                    competitionId,
                    seasonId,
                }
            });
        }
    });

    const { data: competitionData } = useQuery({
        queryKey: ["findAllCompetitions"],
        queryFn: () => findAllCompetitions({ params: "" }),
    });

    const { data: seasonData } = useQuery({
        queryKey: ["findAllSeasons", competitionId],
        queryFn: () => {
            if (!competitionId) return;
            return findByCompetitionId({ id: competitionId });
        },
        enabled: !!competitionId,
    });

    const getCompetitionList = useMemo(() => {
        if (!competitionData?.data?.content) return null;
        const competitions: any = {};
        competitionData.data.content.forEach((item: CompetitionDto) => {
            competitions[item.competitionId] = {
                title: item.name,
                code: item.code,
            };
        });
        return competitions;
        // return competitionData.data.content.map((item: CompetitionDto) => ({
        //     value: item.competitionId,
        //     title: item.name,
        //     code: item.code,
        // }));
    }, [competitionData]);

    const getSeasonList = useMemo(() => {
        if (!seasonData?.data) return null;
        const seasons: any = {};
        seasonData.data.forEach((item: SeasonDto) => {
            seasons[item.seasonId] = {
                title: item.name,
            };
        });
        return seasons;
        // return seasonData.data.content.map((item: SeasonDto) => ({
        //     value: item.seasonId,
        //     title: `${item.name} - ${item.competitionName}`,
        // }));
    }, [seasonData]);

    useEffect(() => {
        if (!getCompetitionList) return;
        const firstCompetitionId = Number(Object.keys(getCompetitionList)[0]);
        setCompetitionId(firstCompetitionId);
    }, [getCompetitionList]);

    useEffect(()=> {
        if (!getSeasonList) return;
        setSeasonId(Number(Object.keys(getSeasonList)[0]));
    }, [getSeasonList]);

    const updateManuallyApi = useMutation({
        mutationKey: ["updateMatchManually"],
        mutationFn: updateManually,
        onSuccess: (data) => {
            if (data?.data) {
                toast.success(t("private/match:message.updateManually.success", { value: data.data.length }), {
                    duration: 5000,
                    position: "top-center"
                });
            }
            queryClient.invalidateQueries({
                queryKey: ["findStanding", competitionId, seasonId]
            });
            setIsSubmitting(false);
        },
        onError: (error) => {
            let message = t("private/match:message.updateManually.error");

            const axiosError = error as AxiosError<any>;
            if (axiosError?.response?.data?.resultMsg) {
                message = axiosError.response.data.resultMsg;
            }
            
            toast.error(message, {
                duration: 5000,
                position: "top-center",
            });
            setIsSubmitting(false);
        }
    });

    const handleUpdateManually = async () => {
        if (!competitionId || !seasonId) return;
        setIsSubmitting(true);
        updateManuallyApi.mutate({
            payload: {
                competitionId,
                seasonId,
            }
        });
    }

    // const onOpenModalChange = () => {
    //     if (openModal) {
    //         setSelectedEtt(null);
    //         setMode(null);
    //     }
    //     setOpenModal(!openModal);
    // }

    // const handleCreate = () => {
    //     setSelectedEtt(null);
    //     onOpenModalChange();
    //     setMode("create");
    // }

    // const handleView = (row: MatchDto) => {
    //     setSelectedEtt(row);
    //     onOpenModalChange();
    //     setMode("view");
    // }

    // const handleEdit = (row: MatchDto) => {
    //     setSelectedEtt(row);
    //     onOpenModalChange();
    //     setMode("edit");
    // }

    // const handleDelete = (row: MatchDto) => {
    //     setSelectedEtt(row);
    //     onOpenModalChange();
    //     setMode("delete");
    // }

    return (
        <div className="relative">
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    {/* <Button
                        onClick={handleCreate}
                        disabled={isSubmitting}
                    >
                        {(t("common:button.create"))}
                    </Button> */}
                    <Button
                        onClick={handleUpdateManually}
                        disabled={isSubmitting}
                    >
                        {t("common:button.updateManually")}
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <div>{t("private/match:matchUpdate")}</div>
                    <Select
                        value={competitionId?.toString()}
                        onValueChange={(value: string) => {
                            if (!value) return;
                            setCompetitionId(Number(value));
                            setSeasonId(null); // reset in order to not call api w/ new competition and old season
                        }}
                    >
                        <SelectTrigger
                            className="w-50"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                            className="w-50 max-h-50 bg-white overflow-y-auto"
                        >
                            {getCompetitionList && Object.keys(getCompetitionList).map((key: string) => (
                                <SelectItem key={key} value={key}>
                                    {getCompetitionList[key].title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={seasonId?.toString()}
                        onValueChange={(value: string) => {
                            if (!value) return;
                            setSeasonId(Number(value));
                        }}
                    >
                        <SelectTrigger
                            className="w-50"
                        >
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                            className="w-50 max-h-50 bg-white overflow-y-auto"
                        >
                            {getSeasonList && Object.keys(getSeasonList).map((key: string) => (
                                <SelectItem key={key} value={key}>
                                    {getSeasonList[key].title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <CustomTable 
                    columns={columns}
                    data={data?.data}
                    totalElements={data?.data?.length}
                    showPagination={false}
                    // totalPages={data?.data?.totalPages}
                    // controller={["C", "R", "U", "D"]}
                    // onView={handleView}
                    // onEdit={handleEdit}
                    // onDelete={handleDelete}
                />
            </div>

            {/* <AreaDialogCreate
                selectedEtt={selectedEtt}
                open={openModal && (mode === "create")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <AreaDialogView
                selectedEtt={selectedEtt}
                open={openModal && (mode === "view")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <AreaDialogEdit 
                selectedEtt={selectedEtt}
                open={openModal && (mode === "edit")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            />
            <AreaDialogDelete 
                selectedEtt={selectedEtt}
                open={openModal && (mode === "delete")}
                onOpenChange={onOpenModalChange}
                mode={mode}
            /> */}
        </div>
    );
}