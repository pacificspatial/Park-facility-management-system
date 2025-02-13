import React, {useContext, useEffect, useState} from "react"
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import PropTypes from "prop-types";
import {MainDataContext} from "../../App";
import {ViewGroup} from "../../data/state";
import {getAuth} from "firebase/auth"

const MenuGroup = {
    Incident: "incident", Record: "record", Report: "report", Master: "master",
}

const styles = {
    root: {
        display: "flex", width: "100%",
    },
    menuBox: {
        width: "100%",
    },
    viewGroupBox: {
        display: 'flex', flexDirection: 'row', height: '48px', marginLeft: '1.5rem', alignItems: 'center',
    },
    viewGroupButtonBox: {
        height: '100%', display: 'flex', alignItems: 'start', width: '120px',
    },
    menuGroupButton: {
        minWidth: '120px',
        marginTop: '10px',
        backgroundColor: '#d8d8d8',
        borderWidth: '1px 1px 0 1px',
        borderColor: '#000',
        borderStyle: 'solid',
        borderRadius: '8px 8px 0 0',
        height: '38px',
        overflowY: 'visible',
        position: "absolute",
        zIndex: 1,
    },
    menuGroupTitle: {
        color: "#00f",
        fontSize: "12px",
    },
    menuItemBox: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        borderWidth: '1px 1px 0px',
        borderColor: '#000',
        borderStyle: 'solid',
        backgroundColor: '#eee',
        alignItems: 'center',
        padding: '0 1rem',
        height: "60px",
    },
    menuItemButtonBox: {
        marginRight: "1.5rem",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
    },
    menuItemTitle: {}, logoutBox: {
        marginRight: "1rem",
        fontSize: "12px",
    },
}

const viewGroups = [
    {viewGroup: ViewGroup.Incident, title: "インシデント"},
    {viewGroup: ViewGroup.Record, title: "メーター記録"},
    {viewGroup: ViewGroup.Report, title: "報告書"},
    {viewGroup: ViewGroup.Master, title: "管理表"},
]

const RootHeaderView = (props) => {

    const {state, setViewGroup} = useContext(MainDataContext)
    const [openConfirmLogout, setOpenConfirmLogout] = useState(false)

    useEffect(() => {
        console.log(state.user)
    }, [])

    const onLogoutSubmit = () => {
        getAuth().signOut()
            .then()
            .catch(e => {
                console.log(e)
            })
            .finally(() => {
                setOpenConfirmLogout(false)
            })
    }


    return (<Box style={styles.root}>
        <Box style={styles.menuBox}>
            <Box style={styles.viewGroupBox}>
                {viewGroups.map(group => {
                    return (
                        <Box style={styles.viewGroupButtonBox} key={group.viewGroup}>
                            <Button
                                onClick={() => setViewGroup(group.viewGroup)}
                                style={{
                                    ...styles.menuGroupButton,
                                    ...(state.viewGroup === group.viewGroup ? {
                                        height: "39px",
                                        backgroundColor: "#eee",
                                    }: null)
                                }}
                            >
                                <Typography style={{
                                    ...styles.menuGroupTitle,
                                    ...(state.viewGroup === group.viewGroup ? {
                                        color: "black",
                                    }: null)
                                }}>{group.title}</Typography>
                            </Button>
                        </Box>
                    )
                })}
                <Box style={{flexGrow: 1}}/>
                {!state.user.role && (
                    <Box style={{marginRight: "1rem"}}>
                        <Button style={{background: '#9a9a25'}} variant="contained" onClick={() => window.location.href="/admin" }>管理ツール</Button>
                    </Box>
                )}
                <Box style={styles.logoutBox}>
                    <Button variant="outlined" color="inherit" onClick={() => setOpenConfirmLogout(true)}>ログアウト</Button>
                </Box>
            </Box>
        </Box>
        <Dialog open={openConfirmLogout}>
            <DialogTitle>ログアウトしますか</DialogTitle>
            <DialogContent>
                <DialogContentText>変更している未保存データは破棄されます</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onLogoutSubmit}>ログアウト</Button>
                <Button onClick={() => setOpenConfirmLogout(false)}>キャンセル</Button>
            </DialogActions>
        </Dialog>
    </Box>);

}

RootHeaderView.propTypes = {
    children: PropTypes.element,
}

export default RootHeaderView
