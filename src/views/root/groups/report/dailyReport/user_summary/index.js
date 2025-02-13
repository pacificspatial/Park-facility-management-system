import React, {useCallback, useEffect, useMemo, useState} from "react"
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import OtherReportView from "./other"
import CheckReportView from "./check"
import WorkReportView from "./work"
import HeaderView from "./header"
import dayjs from "dayjs";
import _ from "lodash";
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@mui/material";
import useApiManager from "../../../../../../manager/api2";

const styles = {
    root: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "90%",
        minWidth: "600px",
        overflow: "auto",
        flexGrow: 1,
        margin: "8px",
    },
    headerBox: {
        display: 'flex',
        flexDirection: 'row',
        margin: '1rem',
        alignItems: "center",
    },
    headerItemBox: {
        display: "flex",
        flexDirection: "row",
        gap: "4px",
        marginRight: "1rem",
        alignItems: "center",
    }
}

export const DefaultColDef = {
    resizable: true,
}

const ReportGroupUserSummaryView = ({day, data, onChange}) => {

    const [editedWorkReport, setEditedWorkReport] = useState()
    const [editedCheckReport, setEditedCheckReport] = useState()
    const [editedOtherReport, setEditedOtherReport] = useState()
    const [isEdited, setIsEdited] = useState(false)
    const [openSaveConfirmDialog, setOpenSaveConfirmDialog] = useState(false)
    const [openResetConfirmDialog, setOpenResetConfirmDialog] = useState(false)
    const { Put } = useApiManager()

    useEffect(() => {
        resetSubmit()
    }, [data])

    const onChangeValue = useCallback(() => {
        console.log(editedWorkReport, editedCheckReport, editedOtherReport)
        setIsEdited(
            JSON.stringify(editedWorkReport) !== JSON.stringify(data.summary_data.work_report) ||
            JSON.stringify(editedCheckReport) !== JSON.stringify(data.summary_data.check_report) ||
            JSON.stringify(editedOtherReport) !== JSON.stringify(data.summary_data.other_report)
        )
    }, [editedWorkReport, editedOtherReport, editedCheckReport, data.summary_data])

    const onSaveChanged = () => {
        setOpenSaveConfirmDialog(true)
    }

    const onResetChanged = () => {
        setOpenResetConfirmDialog(true)
    }

    const saveSubmit = useCallback(() => {
        console.log(data)
        setOpenSaveConfirmDialog(false)
        Put(`report/daily_report/${data.daily_report_id}`, {
            summary_data: {
                ...data.summary_data,
                work_report: editedWorkReport,
                check_report: editedCheckReport,
                other_report: editedOtherReport,
            },
        }).then(() => {
            onChange()
        }).catch(e => {

        })

    }, [data, editedWorkReport, editedCheckReport, editedOtherReport])

    const resetSubmit = useCallback(() => {
        setEditedWorkReport(JSON.parse(JSON.stringify(data.summary_data.work_report)))
        setEditedCheckReport(JSON.parse(JSON.stringify(data.summary_data.check_report)))
        setEditedOtherReport(JSON.parse(JSON.stringify(data.summary_data.other_report)))
        setOpenResetConfirmDialog(false)
    }, [data.summary_data])

    return (
        <Box style={styles.root} className="user_summary_index">
            <HeaderView day={day} data={data} onChange={onChangeValue} isEdited={isEdited} onSave={onSaveChanged} onReset={onResetChanged} />
            <OtherReportView day={day} data={editedOtherReport} onChange={onChangeValue} />
            <WorkReportView day={day} data={editedWorkReport} onChange={onChangeValue} />
            <CheckReportView day={day} data={editedCheckReport} onChange={onChangeValue} />
            <Dialog open={openSaveConfirmDialog}>
                <DialogTitle>変更を保存しますか</DialogTitle>
                <DialogContent>
                    <DialogContentText>変更を保存します。再読み込みするまではこの変更は元に戻せません</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{fontWeight: "bold", color: "blue"}} onClick={saveSubmit}>保存</Button>
                    <Button onClick={() => setOpenSaveConfirmDialog(false)}>キャンセル</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openResetConfirmDialog}>
                <DialogTitle>変更を破棄しますか</DialogTitle>
                <DialogContent>
                    <DialogContentText>保存せずに変更を破棄しますか<br />この操作は元に戻せません</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button style={{fontWeight: "bold", color: "red"}} onClick={resetSubmit}>変更を破棄する</Button>
                    <Button onClick={() => setOpenResetConfirmDialog(false)}>キャンセル</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )

}

ReportGroupUserSummaryView.propTypes = {
    day: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default ReportGroupUserSummaryView

export const useTimeValue = ({day}) => {

    const timeValueGetter = useCallback((params) => {
        if (!_.has(params.data, params.colDef.field)) {
            return null
        }
        const d = params.data[params.colDef.field]
        if (_.isNil(d)) { return null }
        return dayjs(d).format("HH:mm")
    }, [day])

    const timeValueSetter = useCallback((params) => {
        if (params.newValue === "") {
            params.data[params.colDef.field] = null
            return true
        }
        let match
        if (match = params.newValue?.trim()?.match(/^[0-9]{1,2}:[0-9]{1,2}$/)) {
            params.data[params.colDef.field] = dayjs(`${day} ${match[0]}`).format()
            return true
        }
        if (match = params.newValue?.trim()?.match(/^([0-9]{2})([0-9]{2})$/)) {
            params.data[params.colDef.field] = dayjs(`${day} ${match[1]}:${match[2]}`).format()
            return true
        }
        return false
    }, [day])

    return {
        timeValueGetter,
        timeValueSetter,
    }

}
useTimeValue.propTypes = {
    day: PropTypes.string.isRequired
}
