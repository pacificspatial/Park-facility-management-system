import React, {useContext, useEffect, useState} from "react";
import {MainDataContext} from "../../../../App";
import useApiManager from "../../../../manager/api2";
import Box from "@mui/material/Box";
import _ from "lodash";
import {groupStyles} from "../index";
import {ViewItem} from "../../../../data/state";
import DailyReportView from "./dailyReport"
import TrackingReportView from"./tracking"

const styles = {
    ...groupStyles,
}

export const ViewItems = [
    {title: "作業日報", viewItem: ViewItem.Report},
    {title: "行動履歴", viewItem: ViewItem.Tracking},
]

const ReportGroupView = () => {

    const { state, setViewItem } = useContext(MainDataContext)

    useEffect(() => {

        if(!_.find(ViewItem, (v) =>
            v.viewItem === state.viewItem
        )) {
            setViewItem(ViewItem.Report)
        }

    }, [state.viewGroup])

    return (
        <Box style={{flexGrow: 1}}>
            {state.viewItem === ViewItem.Report && <DailyReportView />}
            {state.viewItem === ViewItem.Tracking && <TrackingReportView />}
        </Box>
    )


}

export default ReportGroupView
