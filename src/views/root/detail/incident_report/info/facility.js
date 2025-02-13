import React from "react"
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import dayjs from "dayjs";

const styles = {
    root: {

    },
    dataBox: {
        display: 'flex',
        flexDirection: 'column',
    },
    itemBox: {
        display: "flex",
        flexDirection: "column",
    },
    titleBox: {
        display: "flex",
        alignItems: "center",
        fontSize: "12px",
        color: "#333",
        padding: "4px",
        borderCollapse: "collapse",
        width: "150px",
    },
    valueBox: {
        display: "flex",
        alignItems: "center",
        fontSize: "14px",
        padding: "4px 8px",
        minWidth: "160px",
        borderBottomStyle: "solid",
        borderBottomColor: "#cfcfcf",
        borderBottomWidth: "1px",
    },
}

const IncidentReportInfoFacilityView = React.memo(({firstData, lastData}) => {

    return (
        <Box style={styles.root}>
            {firstData && (
            <Box style={styles.dataBox}>
                <Box style={styles.itemBox}>
                    <Box style={styles.titleBox}>施設コード</Box>
                    <Box style={styles.valueBox}>{firstData.facility_code}</Box>
                </Box>
                <Box style={styles.itemBox}>
                    <Box style={styles.titleBox}>施設名</Box>
                    <Box style={styles.valueBox}>{firstData.facility_name}</Box>
                </Box>
                <Box style={styles.itemBox}>
                    <Box style={styles.titleBox}>施設タイプ</Box>
                    <Box style={styles.valueBox}>{firstData.facility_type}</Box>
                </Box>
                <Box style={styles.itemBox}>
                    <Box style={styles.titleBox}>登録日</Box>
                    <Box style={styles.valueBox}>{dayjs(firstData.measured_at).format("YYYY年MM月DD日(ddd) HH時mm分")}</Box>
                </Box>
                <Box style={styles.itemBox}>
                    <Box style={styles.titleBox}>最終更新日</Box>
                    <Box style={styles.valueBox}>{dayjs(lastData.measured_at).format("YYYY年MM月DD日(ddd) HH時mm分")}</Box>
                </Box>
            </Box>
                )}
            {!firstData && (
                <Typography>読込中...</Typography>
            )}
        </Box>
    )

})

IncidentReportInfoFacilityView.propTypes = {
    firstData: PropTypes.object,
    lastData: PropTypes.object,
}

export default IncidentReportInfoFacilityView
