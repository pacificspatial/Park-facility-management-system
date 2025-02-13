import React, {useCallback, useContext, useEffect, useMemo, useState} from "react"
import Box from "@mui/material/Box";
import {groupStyles, LoadingScreenView} from "../index";
import {MainDataContext} from "../../../../App";
import {ViewGroup, ViewItem} from "../../../../data/state";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Cached as CachedIcon} from "@mui/icons-material";
import GroupItemSelectorComponent from "../../components/groupItemSelector";
import {AgGridReact} from "ag-grid-react";
import DateSelectorComponent from "../../components/dateSelector";
import dayjs from "dayjs";
import useApiManager from "../../../../manager/api2";
import _ from "lodash";
import { defaultColDef, columnDefs } from "./column";
import LOCALE_JA from "../../../../resources/aggrid/locale.ja";

const styles = {
    ...groupStyles,
}

export const ViewItems = [
    {title: "メーター", viewItem: ViewItem.WaterMeter},
    {title: "水温", viewItem: ViewItem.WaterTemp},
    {title: "水質", viewItem: ViewItem.WaterQuality},
]

const RecordGroupView = (props) => {

    const [day, setDay] = useState()
    const [activeDates, setActiveDates] = useState()
    const [rowData, setRowData] = useState()
    const { state, setViewItem } = useContext(MainDataContext)
    const { Get } = useApiManager()

    const title = useMemo(() => {
        let item = ViewItems.find(v => v.viewItem === state.viewItem)
        return item?.title
    }, [state.viewItem])

    useEffect(() => {

        if(!_.find(ViewItem, (v) =>
            v.viewItem === state.viewItem
        )) {
            setViewItem(ViewItem.WaterMeter)
        }

    }, [state.viewGroup])


    useEffect(() => {
        load()
    }, [state.viewItem, day])

    useEffect(() => {
        loadDays()
    }, [state.viewItem])

    const load = useCallback(() => {
        loadDays()
        loadData()
    }, [state.viewItem, day])

    const loadData = useCallback(() => {
        setRowData(null)
        if(!state.viewItem || !day) { return }

        Get(`list/value2_daily/${state.viewItem}`, {
            day,
        })
            .then(setRowData)
            .catch(e => {
                console.log(e)
            })

    }, [state.viewItem, day])

    const loadDays = useCallback(_.debounce(() => {
        if (state.viewGroup !== ViewGroup.Record) { return }

        Get(`report/value2_days/${state.viewItem}`)
            //.then(rows => setActiveDates(rows.map(r => dayjs(r["day"]).format("YYYY-MM-DD"))))
            .then(rows => setActiveDates(rows.map(r => dayjs(r["day"]))))
    }, 100), [state.viewItem, state.viewGroup])


    if (_.isNil(activeDates)) {
        return <LoadingScreenView />
    }

    return (
        <Box style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", position: "relative"}}>
            <Box style={styles.itemBox}>
                <Typography style={styles.title}>{title}</Typography>
                {activeDates && (<DateSelectorComponent onSelectDate={setDay} selectedDate={day} activeDates={activeDates} />)}
                <Box style={{flexGrow: 1}}/>
                <IconButton onClick={() => load(true)}>
                    <CachedIcon />
                </IconButton>
                <GroupItemSelectorComponent items={ViewItems} onSelect={setViewItem} selected={state.viewItem} />
            </Box>
            {_.isEmpty(activeDates) && (
                <Box style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Typography>有効なデータがありません</Typography>
                </Box>

            )}
            {!_.isNil(rowData) && (<Box style={{flexGrow: 1}}>
                <AgGridReact
                    localeText={LOCALE_JA}
                    containerStyle={{height: "100%"}}
                    className={'ag-theme-balham'}
                    columnDefs={columnDefs}
                    defaultColDef={defaultColDef}
                    rowData={rowData}
                />
            </Box>)}
        </Box>
    )

}

export default RecordGroupView
