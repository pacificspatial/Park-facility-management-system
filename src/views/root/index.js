import React, {useContext, useEffect, useMemo, useState} from "react"
import {Box, CircularProgress, Drawer, Typography} from "@mui/material"
import HeaderView from "./header"
import { getAuth, onAuthStateChanged } from "firebase/auth"
import LoginView from "./login";
import IncidentGroupView from "./groups/incident"
import RecordGroupView from "./groups/record"
import ReportGroupView from "./groups/report"
import MasterGroupView from "./groups/master"
import IncidentReportDetailView from "./detail/incident_report";
import useApiManager from "../../manager/api2";
import {ViewGroup} from "../../data/state";
import {MainDataContext} from "../../App";

const styles = {
    root: {
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    loading: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '8px',
        margin: '0',
        padding: '0',
        background: '#eee',
    },
    content: {
        flexGrow: 1,
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
    }
}

const RootView = (props) => {

    const { state , setUser, setDetail} = useContext(MainDataContext)
    const drawerWidth = 360
    const [initializing, setInitializing] = useState(true)
    const auth = useMemo(() => getAuth(), [])
    const [headerContent, setHeaderContent] = useState()
    const [showMapView, setShowMapView] = useState(false)
    const { PostFirst } = useApiManager()

    useEffect(() => {

        onAuthStateChanged(getAuth(), fbUser => {
            console.log("[FBUser]", "login", fbUser)
            if (!fbUser) {
                setUser(null)
                setInitializing(false)
            } else {
                PostFirst("auth/fb_user", fbUser)
                    .then(res => {
                        console.log(res)
                        setUser(res)
                        setInitializing(false)
                    })
                    .catch(e => {
                        console.log(e)
                    })
            }
        })

    }, [])

    useEffect(() => {
        console.log("[Root]", "update detail", state.detail)
    }, [state.detail])

    return (
        <>
            {initializing && (
                <Box style={styles.loading}>
                    <Typography fontSize={12}>読込中...</Typography>
                    <CircularProgress style={{color: "#c8a58e"}} />
                </Box>
            )}
            {!initializing && !state.user && <LoginView />}
            {!initializing && state.user && (<Box style={{width: "100%", height: "100%", display: "flex", flexDirection: "row"}}>
                <Box sx={styles.root}>
                    <HeaderView>
                        {headerContent}
                    </HeaderView>
                    <Box style={styles.content}>
                        {state.viewGroup === ViewGroup.Incident && <IncidentGroupView />}
                        {state.viewGroup === ViewGroup.Record && <RecordGroupView />}
                        {state.viewGroup === ViewGroup.Report && <ReportGroupView />}
                        {state.viewGroup === ViewGroup.Master && <MasterGroupView />}
                    </Box>
                </Box>
            </Box>)}
            {state.detail?.type === "incident_report" && (
                <IncidentReportDetailView incidentUid={state.detail.value} onClose={() => setDetail(null)} />
            )}
        </>
    )
}

export default RootView
