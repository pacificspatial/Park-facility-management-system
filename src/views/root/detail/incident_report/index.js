import React, {useCallback, useEffect, useMemo, useState} from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import Box from "@mui/material/Box";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Modal,
} from "@mui/material";
import useApiManager from "../../../../manager/api2";
import {ToggleButton, ToggleButtonGroup} from "@mui/lab";
import {MoonLoader} from "react-spinners";
import InfoView, {EVENT_REPORT_DETAIL_UPDATED} from "./info"
import MapView from "./map"
import IconButton from "@mui/material/IconButton";
import {Close as CloseIcon} from "@mui/icons-material";

const ViewMode = {
    Info: "info",
    Map: "map",
}

const IncidentReportDetailView = React.memo(({incidentUid, onClose}) => {

    const [historyData, setHistoryData] = useState()
    const [incidentStatuses, setIncidentStatuses] = useState()
    const [loading, setLoading] = useState(false)
    const [loadError, setLoadError] = useState(false)
    const [viewMode, setViewMode] = useState(ViewMode.Info)
    const [openModal, setOpenModal] = useState(true)

    const {Get, Put} = useApiManager()

    useEffect(() => {
        Get("system/incident_status")
            .then(setIncidentStatuses)
    }, [])

    const load = useCallback((useLoading = true) => {
        setLoadError(null)
        if (useLoading) {
            setLoading(true)
        }

        Get(`report/incident2_history/${incidentUid}`, {
            check: true,
        })
            .then(d => {
                setHistoryData(d)
                window.dispatchEvent(new CustomEvent(EVENT_REPORT_DETAIL_UPDATED))
            })
            .catch(setLoadError)
            .finally(() => {
                if (useLoading) {
                    setLoading(false)
                }
            })

    }, [incidentUid])

    useEffect(() => {
        load()
    }, [incidentUid])


    const lngLat = useMemo(() => {
        if (_.isEmpty(historyData)) { return null }
        const data = [...historyData].reverse().find(v => v.longitude && v.latitude)
        if (!data) { return null }
        return {lng: data.longitude, lat: data.latitude}
    }, [historyData])

    const onChangeData = useCallback(() => {
        load(false)
    }, [incidentUid])

    return (
        <Modal
            open={true}
            onClose={onClose}
            closeAfterTransition
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <>
            {loading && (
                <Box>
                    <MoonLoader />
                </Box>
            )}
            {!loading && (
                <Box style={{
                    backgroundColor: "white",
                    width: "50%",
                    height: "80%",
                    padding: "8px",
                    borderRadius: "16px",
                    boxShadow: "1px 1px 8px #000",
                }}>
                    <Box style={{
                        display: "flex",
                        justifyContent: "space-between",
                    }}>
                        {lngLat && (
                            <Box style={{
                                marginRight: "1rem",
                            }}>
                                <ToggleButtonGroup size="small" value={viewMode} onChange={e => setViewMode(e.target.value)}>
                                    <ToggleButton value={ViewMode.Info}>詳細</ToggleButton>
                                    <ToggleButton value={ViewMode.Map}>地図</ToggleButton>
                                </ToggleButtonGroup>
                            </Box>
                        )}
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {viewMode === ViewMode.Info && <InfoView data={historyData} onChange={onChangeData} onError={setLoadError} />}
                    {viewMode === ViewMode.Map && <MapView lngLat={lngLat} />}
                </Box>
            )}
            <Dialog open={loadError}>
                <DialogTitle>ロードエラー</DialogTitle>
                <DialogContent>読み込みに失敗しました {loadError?.message}</DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>閉じる</Button>
                </DialogActions>
            </Dialog>
            </>
        </Modal>
    )
})

IncidentReportDetailView.propTypes = {
    incidentUid: PropTypes.string,
    onClose: PropTypes.func.isRequired,
}

export default IncidentReportDetailView




