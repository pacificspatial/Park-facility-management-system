import React, {useContext, useEffect, useState} from "react"
import Box from "@mui/material/Box";
import IncidentView from "./incident"
import PendingView from "./pending"
import {groupStyles} from "../index";
import {MainDataContext} from "../../../../App";
import {ViewGroup, ViewItem} from "../../../../data/state";

const styles = {
    ...groupStyles,
}

export const ViewItems = [
    {title: "未解決一覧", viewItem: ViewItem.Pending},
    {title: "日次報告", viewItem: ViewItem.Incident, groupDefault: true,}
]

const IncidentGroupView = (props) => {

    const { state, setViewItem  } = useContext(MainDataContext)
    const [showMap, setShowMap] = useState(false)

    useEffect(() => {
        if (state.viewGroup !== ViewGroup.Incident) { return }
        if (!ViewItems.find(v => v.viewItem === state.viewItem)) {
            setViewItem(ViewItem.Incident)
        }

    }, [state.viewGroup, state.viewItem])

    return (
        <Box style={styles.root}>
            {state.viewItem === ViewItem.Pending && <PendingView showMap={showMap} />}
            {state.viewItem === ViewItem.Incident && <IncidentView showMap={showMap} />}
        </Box>
    )

}

export default IncidentGroupView
