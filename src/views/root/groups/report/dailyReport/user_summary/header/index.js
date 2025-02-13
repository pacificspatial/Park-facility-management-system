import React, {useMemo} from "react"
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";
import {Button, Checkbox} from "@mui/material";
import useApiManager from "../../../../../../../manager/api2";

const styles = {
    root: {
//        margin: '1rem',
    },
    headerBox: {
        display: "flex",
        flexDirection: "row",
        gap: "4px",
        marginRight: "1rem",
        alignItems: "center",
    },
    contentBox: {
        display: "flex",
        flexDirection: "row",
        gap: "16px",
        alignItems: "center",
    },
    itemBox: {
        display: "flex",
        flexDirection: "row",
        gap: "4px",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        color: "#808080",
        whiteSpace: "nowrap",
    },
    value: {
        fontSize: "18px",
        whiteSpace: "nowrap",
    }
}

const ReportUserSummaryHeaderView = ({day, data, onChange, isEdited, onSave, onReset}) => {

    const {Put} = useApiManager()

    const openTime = useMemo(() => {
        if (!data?.summary_data?.work_time) { return "未登録"}
        let d = dayjs(data.summary_data.work_time.open_time)
        if (d.isValid()) {
            return d.format("HH時mm分")
        }
        return "不明"
    }, [data])

    const closeTime = useMemo(() => {
        if (!data?.summary_data?.work_time) { return "未登録" }
        let d = dayjs(data.summary_data.work_time.close_time)
        if (d.isValid()) {
            return d.format("HH時mm分")
        }
        return "不明"
    })

    const onAdminApproved = () => {
        Put("report/daily_report_approved", {
            daily_report_id: data.daily_report_id,
        }).then(onChange)
            .catch(e => {
                console.log(e)
            })
    }

    return (
        <Box style={styles.root}>
            <Box style={styles.headerBox}>
                <Typography variant="h6" style={{whiteSpace: "nowrap"}}>{data.user.user_name}さんの{dayjs(data.day).format("YYYY年M月D日(ddd)")}の日次報告</Typography>
            </Box>
            <Box style={styles.contentBox}>
                <Box style={styles.itemBox}>
                    <Typography style={styles.title}>天候</Typography>
                    <Typography style={styles.value}>{data.user.weather ?? "未登録"}</Typography>
                </Box>
                <Box style={styles.itemBox}>
                    <Typography style={styles.title}>体調</Typography>
                    <Typography style={styles.value}>{data.user.health ? "良好": "不調"}</Typography>
                </Box>
                <Box style={styles.itemBox}>
                    <Typography style={styles.title}>作業開始</Typography>
                    <Typography style={styles.value}>{openTime}</Typography>
                </Box>
                <Box style={styles.itemBox}>
                    <Typography style={styles.title}>作業終了</Typography>
                    <Typography style={styles.value}>{closeTime}</Typography>
                </Box>
                <Box style={styles.itemBox}>
                    <Typography style={styles.title}>マネージャー確認</Typography>
                    <Checkbox size="small" checked={data.approve} onClick={onAdminApproved} />
                </Box>
                <Box style={styles.itemBox}>
                    <Button variant="outlined" onClick={onSave} disabled={!isEdited} style={{whiteSpace: "nowrap"}}>変更を保存</Button>
                </Box>
                <Box style={styles.itemBox}>
                    <Button variant="outlined" onClick={onReset} disabled={!isEdited} style={{whiteSpace: "nowrap"}}>変更を破棄</Button>
                </Box>
            </Box>
        </Box>
    )
}

ReportUserSummaryHeaderView.propTypes = {
    day: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onReset: PropTypes.func.isRequired,
    isEdited: PropTypes.bool,
}

export default ReportUserSummaryHeaderView
