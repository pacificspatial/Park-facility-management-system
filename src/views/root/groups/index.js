import React from "react"
import Typography from "@mui/material/Typography";
import {CircularProgress} from "@mui/material";
import Box from "@mui/material/Box";


export const groupStyles = {
    root: {
        flexGrow: 1,
        position: "relative",
        display: "flex",
        flexDirection: "column"
    },
    fullCenterBox: {
        display: "flex",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        marginRight: "1rem",
        fontWeight: "bold",
    },
    itemBox: {
        display: 'flex',
        flexDirection: 'row',
        borderWidth: '1px 1px 0px',
        borderColor: '#000',
        borderStyle: 'solid',
        backgroundColor: '#eee',
        borderRightStyle: "none",
        alignItems: 'center',
        padding: '0 1rem',
        height: "60px",
    },
    loading: {
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: "100%",
    }
}

export const LoadingScreenView = (props) => {
    return (
        <Box style={groupStyles.loading}>
            <Typography>読込中</Typography>
            <CircularProgress style={{color: "#eef"}} />
        </Box>
    )
}
