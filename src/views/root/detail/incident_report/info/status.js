import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import PropTypes from "prop-types";
import {ToggleButtonGroup, ToggleButton} from "@mui/material"
import Box from "@mui/material/Box";
import useApiManager from "../../../../../manager/api2";
import Typography from "@mui/material/Typography";
import {EVENT_REPORT_DETAIL_UPDATED} from "./index";

const styles = {
    root: {
        display: "flex",
        justifyContent: "end",
    }
}

const statusText = [
    {key: "checked", text: "確認済"},
    {key: "requested", text: "対応要請"},
    {key: "done", text: "対応完了"},
]


const IncidentReportInfoStatusView = ({data, statuses, onChange}) => {
    const { Get, Put } = useApiManager()


    return (
        <Box style={styles.root}>
            {data?.status && (
                <ToggleButtonGroup size="small" value={data.status} disabled={true}>
                    {statusText.map(v => {
                        return <ToggleButton value={v.key} key={v.key}>{v.text}</ToggleButton>
                    })}
                </ToggleButtonGroup>
            )}
            {!data?.status && (
                <Box>読込中...</Box>
            )}
        </Box>
    )
}

IncidentReportInfoStatusView.propTypes = {
    data: PropTypes.object,
    statuses: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default IncidentReportInfoStatusView
