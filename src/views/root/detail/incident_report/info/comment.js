import React, {useCallback, useEffect, useMemo, useState} from "react"
import PropTypes from "prop-types";
import {
    Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl,
    FormControlLabel,
    ListItem,
    Radio,
    RadioGroup,
    Select,
    TextareaAutosize,
    TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import useApiManager from "../../../../../manager/api2";
import Typography from "@mui/material/Typography";
import _ from "lodash";

const IncidentReportInfoCommentView = React.memo(({data, statuses, onSend, onError}) => {

    const [value, setValue] = useState()
    const { Get, Put } = useApiManager()
    const [status, setStatus] = useState(parseInt(data.status))
    const [sendError, setSendError] = useState()
    const [loading, setLoading] = useState(false)
    const firstData = useMemo(() => _.first(data), [data])
    const isSendError = useMemo(() => !!sendError, [sendError])

    useEffect(() => {
        setValue(null)
    }, [data])

    const onClickSend = useCallback(() => {
        setLoading(true)
        Put(`report/incident2/${firstData.incident_uid}`, {
            report_text: value,
            status,
        }).then(onSend)
            .catch(setSendError)
            .finally(() => setLoading(false))
    }, [firstData, status, value])

    const onClickRadioHandle = useCallback((e) => {
        const newStatus = parseInt(e.target.value)
        setStatus(prevStatus => prevStatus === newStatus ? null : newStatus)
    }, [status])

    return (
        <Box>
            <TextField
                label="コメント"
                disabled={loading}
                value={value}
                onChange={e => setValue(e.target.value)}
                style={{width: "100%", height: "60px"}}
                InputProps={{
                    style: {
                        fontSize: "12px",
                    },
                }}
                InputLabelProps={{
                    style: {
                        fontSize: "12px",
                    }
                }}
            />
            <Box>
                <Box style={{display: "flex", flexDirecton: "row"}}>
                    <FormControl disabled={loading} size="small">
                        <RadioGroup
                            value={status}
                            style={{display: "flex", flexDirection: "row"}}
                        >
                            {statuses.filter(v => !_.isEmpty(v.description) && !v.admin_select_hidden).sort((v1, v2) => v1.sort - v2.sort).map(s => {
                                return <FormControlLabel value={s.incident_status_id} key={`status_type_${s.incident_status_id}`} control={<Radio size="small" onClick={onClickRadioHandle} />} label={<Typography fontSize={12}>{s.description}</Typography>} />
                            })}
                        </RadioGroup>
                    </FormControl>
                    <Box style={{flexGrow: 1}} />
                    <Button variant="contained" disabled={loading || !status} onClick={onClickSend}>送信</Button>
                </Box>
                {/*<Box style={{display: "flex", flexDirection: "row", gap: "8px", justifyContent: "end"}}>*/}
                {/*</Box>*/}
            </Box>
            <Dialog open={isSendError}>
                <DialogTitle>送信エラー</DialogTitle>
                <DialogContent>コメントの送信に失敗しました {sendError?.message}</DialogContent>
                <DialogActions>
                    <Button onClick={onClickSend}>再送信</Button>
                    <Button onClick={() => setSendError(null)}>キャンセル</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )

})

IncidentReportInfoCommentView.propTypes = {
    data: PropTypes.object,
    statuses: PropTypes.array.isRequired,
    onSend: PropTypes.func.isRequired,
}

export default IncidentReportInfoCommentView
