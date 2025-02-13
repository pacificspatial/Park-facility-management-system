import React, {useContext, useEffect, useState} from "react"
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {AgGridReact} from "ag-grid-react";
import useColumnDefs from "./column";
import APIManager from "../../../../../manager/api"
import useApiManager from "../../../../../manager/api2";
import {groupStyles} from "../../index";
import {MainDataContext} from "../../../../../App";
import DateSelectorComponent from "../../../components/dateSelector";
import GroupItemSelectorComponent from "../../../components/groupItemSelector";
import {ViewItem} from "../../../../../data/state";
import PendingView from "../pending";
import dayjs from "dayjs";
import {ViewItems} from "../index";
import {EVENT_REPORT_DETAIL_UPDATED} from "../../../detail/incident_report/info";
import IconButton from "@mui/material/IconButton";
import {Cached as CachedIcon} from "@mui/icons-material";
import LOCALE_JA from "../../../../../resources/aggrid/locale.ja";

const styles = {
    ...groupStyles,
    root: {
        flexGrow: 1,
    }
}

const IncidentItemPendingView = (props) => {

    const [rowData, setRowData] = useState()
    const { state, setDetail, setViewItem } = useContext(MainDataContext)
    const { Get } = useApiManager()


    const { columnDefs, defaultColDef } = useColumnDefs({
        onViewMapClicked: (lngLat) => {

        },
        onDetailClicked: (data) => {
            setDetail(data)
        },
    })

    const load = (clear = true) => {
        setRowData(null)
        Get("list/incident2_pending")
            .then(setRowData)
            .catch(e => {
                console.log(e)
                setRowData(null)
            })
    }


    useEffect(() => {
//        window.addEventListener(EVENT_REPORT_DETAIL_UPDATED, load)
        load()
    }, [])

    return (
        <Box style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>
            <Box style={styles.itemBox}>
                <Typography style={styles.title}>インシデント未解決一覧</Typography>
                <Box style={{flexGrow: 1}}/>
                <IconButton onClick={() => load(true)}>
                    <CachedIcon />
                </IconButton>
                <GroupItemSelectorComponent items={ViewItems} onSelect={setViewItem} selected={state.viewItem} />
            </Box>
            <Box style={{flexGrow: 1}}>
                <AgGridReact
                    localeText={LOCALE_JA}
                    containerStyle={{height: "100%"}}
                    className={'ag-theme-balham'}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowData={rowData}
                />
            </Box>
        </Box>
    )
}

IncidentItemPendingView.propTypes = {
    showMap: PropTypes.bool,
}

export default IncidentItemPendingView
