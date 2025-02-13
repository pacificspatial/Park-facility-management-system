import React, {useContext, useEffect, useState} from "react";
import useApiManager from "../../../../manager/api2";
import _ from "lodash";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import {MainDataContext} from "../../../../App";

const weekDay = ["日", "月", "火", "水", "木", "金", "土"]

const IncidentLatestDetailView = (props) => {

    const { state } = useContext(MainDataContext)
    const { Get } = useApiManager()

    const [data, setData] = useState()
    const [error, setError] = useState(false)
    const [issueData, setIssueData] = useState()

    useEffect(() => {
        Get(`report/incident2_history/${state.detail.incident_uid}`)
            .then(res => {
                if (_.isEmpty(res)) {
                    return setError(true)
                }
                setIssueData(res[0])
                setData(res)
            })
            .catch(e => {
                console.log(e)
                setError(true)
            })
    }, [state.detail])

    return (
        <Box>
            <Box>
                <Box>施設</Box>
                <Box>{issueData.facility_code} ${issueData.facility_name}</Box>
                <Box>発生日時</Box>
                <Box>{dayjs(issueData.measuerd_at).format("YYYY年MM月DD日 HH時mm分")}({weekDay[dayjs(issueData.measured_at).day()]})</Box>
                <Box>報告者</Box>
                <Box></Box>
            </Box>
        </Box>
    )

}

IncidentLatestDetailView.propTypes = {

}

export default IncidentLatestDetailView
