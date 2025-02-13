import PropTypes from "prop-types";
import React, {useEffect, useMemo, useRef, useState} from "react";
import useApiManager from "../../../../../manager/api2";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import _ from "lodash";
import StatusView from "./status"
import FacilityView from "./facility"
import ReportView from "./report"
import CommentView from "./comment"
import {Snackbar} from "@mui/material";

export const EVENT_REPORT_DETAIL_UPDATED = "report_detail_updated_event"

const IncidentReportInfoView = React.memo(({data, onChange, onError}) => {

    const [incidentStatuses, setIncidentStatuses] = useState()
    const incidentStatusesRef = useRef()
    const { Get } = useApiManager()
    const [sendSuccess, setSendSuccess] = useState(false)

    const firstData = useMemo(() => _.first(data), [data])
    const lastData = useMemo(() => _.last(data), [data])

    useEffect(() => {
        if (incidentStatusesRef.current) {
            setIncidentStatuses(incidentStatusesRef.current)
            return
        }
        Get("system/incident_status")
            .then(rows => {
                setIncidentStatuses(rows)
                incidentStatusesRef.current = rows
            })
            .catch(onError)
    }, [])

    const onCommentSend = () => {
        setSendSuccess(true)
        onChange()
        window.dispatchEvent(new CustomEvent(EVENT_REPORT_DETAIL_UPDATED))
    }

    return (
        <Box style={{width: "100%", height: "calc(100% - 40px)", position: "relative"}}>
            {!incidentStatuses && <Typography>読込中...</Typography>}
            {incidentStatuses && (
                <Box style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", gap: "8px"}}>
                    <StatusView statuses={incidentStatuses} data={lastData} onChange={onChange} />
                    <Box style={{flexGrow: '1',
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '8px',
                        position: 'relative',
                        overflow: 'hidden',
                    }}>
                        <FacilityView firstData={firstData} lastData={lastData} />
                        <Box style={{flexGrow: 1, display: "flex", flexDirection: "column", height: "100%", gap: "8px"}}>
                            <ReportView data={data} onChange={onChange} />
                            <CommentView statuses={incidentStatuses} data={data} onSend={onCommentSend} />
                        </Box>
                    </Box>
                </Box>
            )}
            <Snackbar
                open={sendSuccess}
                autoHideDuration={3000}
                onClose={() => setSendSuccess(false)}
                message="送信しました"
            />
        </Box>
    )
})

IncidentReportInfoView.propTypes = {
    data: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
}

export default IncidentReportInfoView
