import React, {useState} from "react";
import {Box, Button, Link} from "@mui/material"
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {ArrowBack as ArrowBackIcon, ArrowLeft as ArrowLeftIcon} from "@mui/icons-material";
import UserView from "./user"
import HeaderView from "./header"
import {ArrowRightIcon} from "@mui/x-date-pickers";

const ViewMode = {
    User: "user",
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
    menuContent: {
        flexGrow: '1',
        padding: '8px',
        background: '#eee'
    },
    menuButton: {
        fontSize: "16px",
        color: "#fd6262",
    }
}

const AdminView = () => {

    const [viewMode, setViewMode] = useState()

    const onBack = () => {
        setViewMode(null)
    }

    if (viewMode === ViewMode.User) {
        return (
            <UserView onBack={onBack} />
        )
    }

    return (
        <Box style={styles.root}>
            <Box style={styles.titleBox}>
                <IconButton onClick={() => window.location.href="/"}><ArrowBackIcon /></IconButton>
                <Typography variant="h6">管理ツールメニュー</Typography>
                <Box />
            </Box>
            <Box style={styles.menuContent}>
                <Box>
                    <Button style={styles.menuButton} onClick={() => setViewMode(ViewMode.User)}>ユーザ管理<ArrowRightIcon /></Button>
                </Box>
            </Box>
        </Box>
    )

}

export default AdminView
