import React, {useCallback, useEffect, useState} from "react";
import Box from "@mui/material/Box";
import {Button} from "@mui/material";
import {ArrowBack as ArrowBackIcon, Autorenew as AutorenewIcon} from "@mui/icons-material";
import {ToggleButton, ToggleButtonGroup} from "@mui/lab";
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-balham.css"
import AdminListView from "./admin"
import PatrolListView from "./patrol"
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";

const ViewType = {
    Admin: "admin",
    Patrol: "patrol",
}

const styles = {
    root: {
        padding: 0,
        margin: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
    },
    titleBox: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    header: {
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        alignItems: "center",
        padding: "8px 0",
        background: "#eee",
    },
}

const AdminUserView = ({onBack}) => {

    const [viewType, setViewType] = useState(ViewType.Patrol)

    return (
        <Box style={styles.root}>
            <Box style={{flexGrow: 1, position: "relative", display: "flex", flexDirection: "column"}}>
                <Box style={styles.titleBox}>
                    <IconButton onClick={onBack}><ArrowBackIcon /></IconButton>
                    <Typography variant="h6">管理ツール・ユーザ管理</Typography>
                    <Box />
                </Box>
                <Box style={styles.header}>
                    <Typography>ユーザ種別：</Typography>
                    <ToggleButtonGroup exclusive value={viewType} size="small" onChange={(e, value) => setViewType(value)}>
                        <ToggleButton value={ViewType.Admin}>管理者</ToggleButton>
                        <ToggleButton value={ViewType.Patrol}>検視員</ToggleButton>
                    </ToggleButtonGroup>
                </Box>
                {viewType === ViewType.Admin && <AdminListView />}
                {viewType === ViewType.Patrol && <PatrolListView />}
            </Box>
        </Box>
    )

}

AdminUserView.propTypes = {
    onBack: PropTypes.func,
}

export default AdminUserView
