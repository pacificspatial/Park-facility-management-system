import React, {useCallback, useContext, useEffect, useMemo, useState} from "react"
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import {AgGridReact} from "ag-grid-react";
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
import {
    Cached as CachedIcon,
    Close as CloseIcon,
    OpenInNew as OpenInNewIcon,
    Place as PlaceIcon,
    PhotoLibrary as PhotoLibraryIcon,
} from "@mui/icons-material";
import _ from "lodash";
import {Button} from "@mui/material";
import {rendererStyles} from "../../../components/agGrid/renderer";
import useColumnDefs from "./column";
import LOCALE_JA from "../../../../../resources/aggrid/locale.ja";


const styles = {
    ...groupStyles,
    ...rendererStyles,
    root: {
        flexGrow: 1,
    }
}



const IncidentItemIncidentView = (props) => {

    const [rowData, setRowData] = useState()
    const [isLoading, setIsLoading] = useState()
    const { state, setDetail, setViewItem } = useContext(MainDataContext)
    const { Get } = useApiManager()
    const [activeDates, setActiveDates] = useState()
    const [day, setDay] = useState()

    const { columnDefs, defaultColDef } = useColumnDefs({
        onViewMapClicked: (lngLat) => {

        },
        onDetailClicked: (data) => {
            setDetail(data)
        },
    })


    const loadDays = () => {
        Get("report/incident2_days", {
            status: 1
        }).then(rows => {
            let days = rows.map(row => dayjs(row["day"]).format("YYYY-MM-DD"))
            setActiveDates(rows.map(r => dayjs(r["day"])))
        }).catch(e => {
            console.log(e)
        })
    }

    const loadList = useCallback(() => {
        if (!day) { return }
        Get("list/incident2_daily", {
            day,
        })
            .then(res =>
                setRowData([...res])
            )
            .catch(e => {
                console.log(e)
                setRowData(null)
            })
    }, [day])

    const loadAll = (clear = false) => {
        if (clear) {
            setRowData(null)
        }
        loadDays()
        loadList()
    }

    useEffect(() => {
        loadDays()
    }, [])

    //
    // useEffect(() => {
    //     window.addEventListener(EVENT_REPORT_DETAIL_UPDATED, loadAll)
    //
    //     loadDays()
    //
    //     return () => {
    //         window.removeEventListener(EVENT_REPORT_DETAIL_UPDATED, loadAll)
    //     }
    // }, [])


    useEffect(() => {
        loadList()
    }, [day])

    // useEffect(() => {
    //     if (_.isEmpty(rowData)) {
    //         setTimeout(() => loadList(), 1000)
    //     }
    // }, [state.detail, rowData])

    return (
        <Box style={{display: "flex", flexDirection: "column", width: "100%", height: "100%"}}>
            <Box style={styles.itemBox}>
                <Typography style={styles.title}>インシデント日次報告</Typography>
                {activeDates && (<DateSelectorComponent onSelectDate={setDay} selectedDate={day} activeDates={activeDates} />)}
                <Box style={{flexGrow: 1}}/>
                <IconButton onClick={() => loadAll(true)}>
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

IncidentItemIncidentView.propTypes = {
    showMap: PropTypes.bool,
}

export default IncidentItemIncidentView
