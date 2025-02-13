import React, {useCallback, useContext, useEffect, useMemo, useState} from "react"
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DateSelectorComponent from "../../../components/dateSelector";
import IconButton from "@mui/material/IconButton";
import { Cached as CachedIcon } from "@mui/icons-material"
import {groupStyles} from "../../index";
import GroupItemSelectorComponent from "../../../components/groupItemSelector";
import {ViewItems} from "../index";
import {Button, ButtonGroup, CircularProgress, ListItem, MenuItem, Select} from "@mui/material";
import _ from "lodash";
import {MainDataContext} from "../../../../../App";
import useApiManager from "../../../../../manager/api2";
import dayjs from "dayjs";
import ListView from "./list"
import MapView from "./map"
import {ToggleButton, ToggleButtonGroup} from "@mui/lab";

const styles = {
    ...groupStyles
}

const ViewMode = {
    List: "list",
    Map: "map",
    Both: "both",
}

const DataStatus = {
    SelectDataLoading: "select_data_loading",
    WaitForSelected: "wait_for_selected",
    ActiveDateNotFound: "active_date_not_found",
    DataReady: "data_ready",
}

const ReportGroupTrackingView = (props) => {

    const { state, setViewItem } = useContext(MainDataContext)
    const [day, setDay] = useState()
    const [userActiveDates, setUserActiveDates] = useState()
    const [selectedUserId, setSelectedUserId] = useState()
    const [activeDates, setActiveDates] = useState()
    const [rowData, setRowData] = useState()
    const [viewMode, setViewMode] = useState(ViewMode.List)
    const [dataStatus, setDataStatus] = useState(DataStatus.SelectDataLoading)
    const [users, setUsers] = useState()
    const { Get } = useApiManager()

    useEffect(() => {
        Get("report/tracking_days")
            .then(rows => {
                let val = {}
                rows.forEach(row => {
                    let uv = val[row['user_id']] ?? {dates:[], name: row['user_name']}
                    uv.dates.push(dayjs(row['day']))
                    val[row['user_id']] = uv
                })
                console.log("[Tracking]", "user active days", val)
                setUserActiveDates(val)
                if (_.isEmpty(val)) {
                    setDataStatus(DataStatus.ActiveDateNotFound)
                } else {
                    setDataStatus(DataStatus.WaitForSelected)
                }
            })
    }, [])

    useEffect(() => {
        if (!userActiveDates || !selectedUserId) {
            return
        }
        let val = Object.entries(userActiveDates).find(([userId, _]) =>
            parseInt(userId) === parseInt(selectedUserId)
        )
        if (!val) { return }
        setActiveDates(val[1].dates)
    }, [userActiveDates, selectedUserId])

    useEffect(() => {
        if (day && selectedUserId) {
            setRowData(null)
            setDataStatus(DataStatus.DataReady)
            load()
        }
    }, [day, selectedUserId])

    useEffect(() => {
        if (!userActiveDates) {
            setUsers(null)
            return
        }
        console.log("[Tracking]", "new user active dates", userActiveDates)
        let val = Object.entries(userActiveDates).map(([key, value]) => {
            return { user_id: key, user_name: value.name}
        })
        setUsers(val)
        // if (!selectedUserId) {
        //     setSelectedUserId(_.first(val)?.user_id)
        // }
    }, [userActiveDates])

    //
    // const users = useMemo(() => {
    //     if (!userActiveDates) { return null }
    //     let val = Object.entries(userActiveDates).map(([key, value]) => {
    //         return {user_id: key, user_name: value.user_name}
    //     })
    // }, [userActiveDates, selectedUserId])

    const load = useCallback(() => {
        setRowData(null)
        if (!day || !selectedUserId) {
            return
        }
        Get("report/user_tracking", {
            user_id: selectedUserId,
            day,
        })
            .then(setRowData)
            .catch(e => {
                console.log(e)
            })
    }, [day, selectedUserId])

    const onViewModeChange = (e) => {
        setViewMode(e.target.value)
    }

    const title  = "行動履歴"

    return (
        <Box style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", position: "relative"}}>
            <Box style={styles.itemBox}>
                <Typography style={styles.title}>{title}</Typography>
                <Select
                    label="検査員選択"
                    size="small"
                    value={selectedUserId}
                    style={{
                        width: "140px",
                        marginRight: "1rem",
                        height: "40px",
                    }}
                    onChange={e => setSelectedUserId(e.target.value)}
                >
                    {users?.map(u => {
                        return (
                            <MenuItem key={u.user_id} value={u.user_id}>{u.user_name}</MenuItem>
                        )
                    })}
                </Select>
                {activeDates && (<DateSelectorComponent onSelectDate={setDay} selectedDate={day} activeDates={activeDates} />)}
                <Box style={{flexGrow: 1}}/>
                <IconButton onClick={() => load(true)}>
                    <CachedIcon />
                </IconButton>
                {rowData && (<Box style={{marginRight: "1rem"}}>
                    <ToggleButtonGroup value={viewMode} size="small" onChange={onViewModeChange}>
                        <ToggleButton value={ViewMode.List}>リスト</ToggleButton>
                        <ToggleButton value={ViewMode.Map}>地図</ToggleButton>
                    </ToggleButtonGroup>
                </Box>)}
                <GroupItemSelectorComponent items={ViewItems} onSelect={setViewItem} selected={state.viewItem} />
            </Box>
            {dataStatus === DataStatus.WaitForSelected && (
                <Box style={styles.fullCenterBox}>
                    {!day && !selectedUserId && <Typography>選択してください</Typography>}
                    {day && !selectedUserId && <Typography>ユーザを選択してください</Typography>}
                    {!day && selectedUserId && <Typography></Typography>}
                </Box>
            )}
            {dataStatus === DataStatus.SelectDataLoading && (
                <Box style={styles.fullCenterBox}>
                    <Typography>読込中</Typography>
                </Box>
            )}
            {dataStatus === DataStatus.ActiveDateNotFound && (
                <Box style={styles.fullCenterBox}>
                    <Typography>この日付のデータはありません</Typography>
                </Box>
            )}
            {dataStatus === DataStatus.DataReady && !rowData && (
                <Box styole={styles.fullCenterBox}>
                    <Typography>読込中</Typography>
                </Box>
            )}
            {dataStatus === DataStatus.DataReady && rowData && (
                <Box style={{flexGrow: 1}}>
                    {viewMode !== ViewMode.Map && <ListView data={rowData} />}
                    {viewMode !== ViewMode.List && <MapView data={rowData} />}
                </Box>
            )}
        </Box>

    )
}

export default ReportGroupTrackingView
