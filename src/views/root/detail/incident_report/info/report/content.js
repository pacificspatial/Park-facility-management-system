import React, {useMemo} from "react"
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import dayjs from "dayjs";
import {Divider} from "@mui/material";
import Typography from "@mui/material/Typography";
import SoundView from "./sound"
import _ from "lodash";

const sameLevel = (d1, d2) => {
    if (!d1?.isValid() || !d2?.isValid()) { return null }

    for(let l of ["minutes", "hour", "day", "week", "month", "year"]) {
//        console.log("[SameLevel]", d1.format("YYYYMMDD"), d2.format("YYYYMMDD"), l, d1.isSame(d2, l))
        if (d1.isSame(d2, l)) {
            return l
        }
    }

    return null
}

const styles = {
    root: {

    },
    dateDivider: {
        fontSize: "14px",
    },
    caption: {
        fontSize: "12px",
        color: "#999",
    },
    value: {
        fontSize: '12px',
        borderBottom: '1px solid rgb(170, 170, 170)',
        borderTopColor: 'rgb(170, 170, 170)',
        borderRightColor: 'rgb(170, 170, 170)',
        borderLeftColor: 'rgb(170, 170, 170)',
        marginBottom: '0.5rem',
        marginLeft: '0.3rem',
        background: '#eee',
        marginTop: '0.3rem',
        padding: '4px'
    },
    photoBox: {
        display: "flex",
        flexDirection: "row",
        gap: "8px",
    },
    photo: {
        maxHeight: "200px",
        cursor: "pointer",
    },
    status: {
        display: "flex",
        justifyContent: "end",
        fontSize: "12px",
        color: "#3a3a3a",
    },
    dateBox: {
        display: "flex",
        justifyContent: "end",
    },
    date: {
        fontSize: "12px",
    }
}

const IncidentReportInfoReportContentView = React.memo(({data, status, prev}) => {

    const dayText = useMemo(() => {
        if (!data) { return null }
//        console.log(data.measured_at, prev?.measured_at)
        const c = dayjs(data.measured_at)
        const p = prev?.measured_at ? dayjs(prev?.measured_at) : null
        const l = sameLevel(c, p)
        const nl = sameLevel(c, dayjs())
//        console.log("DayText", "same", l, nl)
        switch(l) {
            case "minutes":
            case "hour":
            case "day":
                return null
            // case "week":
            // case "month":
            //     return c.format("M月D日(ddd)")
            // case "year":
            //     return c.format("M月D日(ddd)")
            default:
                break
        }
        switch(nl) {
            case "minutes":
            case "hour":
            case "day":
                return "今日"
            case "week":
                if(c.diff(dayjs(), "day") === 1) {
                    return "昨日"
                }
                if (c.diff(dayjs(), "day") === 2) {
                    return "一昨日"
                }
                return c.format("M月D日(ddd)")
            case "month":
            case "year":
                return c.format("M月D日(ddd)")
            default:
                return c.format("YYYY年M月D日(ddd)")
        }
    }, [data])

    const timeText = useMemo(() => dayjs(data.measured_at).format("HH:mm"), [data])

    const onClickPhoto = (photo) => {
        window.open(`${process.env.REACT_APP_MEDIA_ENDPOINT}${photo.org_url}`)
    }

    return (
        <Box>
            <Divider
                style={styles.dateDivider}
                textAlign="center"
            >{dayText}</Divider>
            <Box>
                <Box style={{display: "flex", flexDirection: "row", gap: "8px", margin: "0.5rem 0"}}>
                    <Box style={styles.dateBox}>
                        <Typography style={styles.date}>{timeText}</Typography>
                    </Box>
                    <Box style={styles.status}>{data.status_description}</Box>
                </Box>
                {!_.isEmpty(data.report_textvoice) && (
                    <Box>
                        <Box style={styles.caption}>状況又はコメント</Box>
                        <Box style={styles.value}>{data.report_textvoice.text} <SoundView path={data.report_textvoice.url} /></Box>
                    </Box>
                )}
                {!_.isEmpty(data.repair_textvoice) && (
                    <Box>
                        <Box style={styles.caption}>処置</Box>
                        <Box style={styles.value}>{data.repair_textvoice.text} <SoundView path={data.repair_textvoice.url} /></Box>
                    </Box>
                )}
                <Box style={{display: "flex", flexDirection: "row", gap: "8px"}}>
                {data.photos?.map(photo => (
                    <Box
                        style={styles.photoBox}
                        key={photo.photo_uid}
                    >
                        <img onClick={() => onClickPhoto(photo)} style={styles.photo} alt="none" src={`${process.env.REACT_APP_MEDIA_ENDPOINT}${photo.thumb_url}`} />
                    </Box>
                ))}
                </Box>
            </Box>
        </Box>
    )

})

IncidentReportInfoReportContentView.propTypes = {
    data: PropTypes.object.isRequired,
    status: PropTypes.object,
    prev: PropTypes.object,
}

export default IncidentReportInfoReportContentView
