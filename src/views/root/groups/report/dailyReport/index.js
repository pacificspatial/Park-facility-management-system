import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {MainDataContext} from "../../../../../App";
import useApiManager from "../../../../../manager/api2";
import UseReportExport from "./export";
import dayjs from "dayjs";
import {groupStyles} from "../../index";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import DateSelectorComponent from "../../../components/dateSelector";
import IconButton from "@mui/material/IconButton";
import {Cached as CachedIcon, CheckBoxOutlined as CheckBoxOutlinedIcon , CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon} from "@mui/icons-material";
import {
    Button,
    Checkbox,
    CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";
import GroupItemSelectorComponent from "../../../components/groupItemSelector";
import _ from "lodash";
import {ViewItems} from "../index";
import UserSummaryView from "./user_summary"

const styles = {
    ...groupStyles,
    userSummaryBox: {
        flexGrow: '1',
        position: 'relative',
        height: 'calc(-120px + 100vh)',
        overflowY: 'scroll',
        overflowX: 'auto',
        width: 'calc(100vw - 250px)',
    },
    userListBox: {
        height: 'calc(100vh - 120px)',
        overflowY: 'scroll',
        width: '220px',
    }
}

const ReportGroupDailyReportView = (props) => {

    const [day, setDay] = useState()
    const [activeDates, setActiveDates] = useState()
    const { state, setViewItem } = useContext(MainDataContext)
    const { Get } = useApiManager()
    const [loading, setLoading] = useState()
    const [summaryData, setSummaryData] = useState()
    const [selectedUserId, setSelectedUserId] = useState()
    const [openReloadConfirmDialog, setOpenReloadConfirmDialog] = useState(false)
    const title = "作業日報"
    const { exportExcel } = UseReportExport()


    useEffect(() => {

        Get("report/login_days")
            .then(rows=> {
                //setActiveDates(rows.map(row => dayjs(row["day"]).format("YYYY-MM-DD")).sort())
                setActiveDates(rows.map(r => dayjs(r["day"])))
            })

    }, [])

    useEffect(() => {
        load(false)
    }, [day])

    const load = useCallback((clear) => {
        if(!day) { return }
        setSummaryData(null)
        Get(`report/daily_report/${day}`, {
            clear,
        })
            .then(setSummaryData)
            .catch(e => {
                console.log(e)
            })
    }, [day])

    const userSummaryData = useMemo(() => {
        if (!selectedUserId || !summaryData) { return null }
        return summaryData.find(d => d.user.user_id === selectedUserId)
    }, [selectedUserId, summaryData])

    const onChange = useCallback(() => {
        load(false)
    }, [day])

    const onExportExcel = useCallback(() => {
        exportExcel(summaryData, day)
            .then(() => {
                console.log("hello")
            })
            .catch(e => {
                console.log(e)
            })
    }, [day, summaryData])

    const onReload = () => {
        setOpenReloadConfirmDialog(true)
    }

    const onReloadSubmit = () => {
        setOpenReloadConfirmDialog(false)
        load(true)
    }

    return (
        <Box style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", position: "relative"}}>
            <Box style={styles.itemBox}>
                <Typography style={styles.title}>{title}</Typography>
                {activeDates && (<DateSelectorComponent onSelectDate={setDay} selectedDate={day} activeDates={activeDates} />)}
                <Box style={{flexGrow: 1}}/>
                <Button style={{margin: "0 8px"}} variant="contained" onClick={onReload}>
                    日次報告作成
                </Button>
                <Button style={{margin: "0 8px"}} variant="contained" onClick={onExportExcel}>Excelダウンロード</Button>
                <GroupItemSelectorComponent items={ViewItems} onSelect={setViewItem} selected={state.viewItem} />
            </Box>
            {_.isEmpty(activeDates) && (
                <Box style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <Typography>有効なデータがありません</Typography>
                </Box>

            )}
            {!_.isEmpty(activeDates) && (
                <>
                    {!summaryData && (
                        <Box>
                            読込中...
                            <CircularProgress />
                        </Box>
                    )}
                    {summaryData && (
                        <Box style={{display: 'flex',
                            flexDirection: 'row',
                            flexGrow: '1'}}>
                            <Box style={styles.userListBox}>
                                <List>
                                    {summaryData?.map(d => {
                                        return (d?.user) ?
                                            (
                                                <ListItem>
                                                    <ListItemButton disabled={!d.summary_data} onClick={() => setSelectedUserId(d.user.user_id)}>
                                                        {selectedUserId && d.user.user_id === selectedUserId && (
                                                            <CheckBoxOutlinedIcon />
                                                        )}
                                                        {(!selectedUserId || selectedUserId !== d.user.user_id) && (
                                                            <CheckBoxOutlineBlankIcon />
                                                        )}
                                                        <ListItemText>{d.user?.user_name}</ListItemText>
                                                    </ListItemButton>
                                                </ListItem>
                                            )
                                            : null
                                    })}
                                </List>
                            </Box>
                            <Box style={styles.userSummaryBox} className="user_summary_data">
                                {!userSummaryData && <Box><Typography>ユーザを選択してください</Typography></Box>}
                                {userSummaryData && <UserSummaryView day={day} data={userSummaryData} onChange={onChange} />}
                            </Box>
                        </Box>
                    )}
                </>
            )}
            <Dialog open={openReloadConfirmDialog}>
                <DialogTitle>変更をクリアして再読み込み</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        再読み込みは「日報」情報をDBから構築します。<br />
                        保存された日報の変更は破棄され、全リロードされます。<br />
                        （通常、終業時に1回のみ実行してくださいZ)
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{fontWeight: "bold", color: "red"}} onClick={onReloadSubmit}>再読み込み実行</Button>
                    <Button onClick={() => setOpenReloadConfirmDialog(false)} >キャンセル</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default ReportGroupDailyReportView
