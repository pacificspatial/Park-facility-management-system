import React, {useCallback, useContext, useEffect, useMemo, useState} from "react"
import {groupStyles} from "../index";
import Box from "@mui/material/Box";
import _ from "lodash";
import {ViewItem} from "../../../../data/state";
import {MainDataContext} from "../../../../App";
import FacilityView from "./facility"
import TreeView from "./tree"
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Cached as CachedIcon, ViewAgenda as ViewAgendaIcon} from "@mui/icons-material";
import GroupItemSelectorComponent from "../../components/groupItemSelector";
import useApiManager from "../../../../manager/api2";
import {ToggleButton, ToggleButtonGroup} from "@mui/lab";
import MapView from "./map"

const styles = {
    ...groupStyles,
}

export const ViewItems = [
    {title: "長寿命化計画", viewItem: ViewItem.Master},
    {title: "樹木リスト", viewItem: ViewItem.Tree},
]

export const ViewMode = {
    List: "list",
    Map: "map",
}

const ViewDirection = {
    Vertical: "vertical",
    Horizontal: "horizontal",
}

const MasterGroupView = (props) => {

    const { state, setViewItem } = useContext(MainDataContext)
    const { Get } = useApiManager()
    const [rowData, setRowData] = useState()
    const [viewMode, setViewMode] = useState([ViewMode.List])
    const [viewDirection, setViewDirection] = useState(ViewDirection.Horizontal)
    const [facility, setFacility] = useState()

    useEffect(() => {

        if(!_.find(ViewItem, (v) =>
            v.viewItem === state.viewItem
        )) {
            setViewItem(ViewItem.Master)
        }

    }, [state.viewGroup])

    useEffect(() => {
        load()
    }, [state.viewItem])

    const title = useMemo(() => {
        if (!state.viewItem) { return }
        return ViewItems.find(v => v.viewItem === state.viewItem)?.title
    }, [state.viewItem])

    const load = useCallback(() => {
        Get(`system/${state.viewItem}`)
            .then(setRowData)
            .catch(e => {
                console.log(e)
            })
    }, [state.viewItem])

    const onListMapClick = (e) => {
        setFacility(e)
    }

    return (
        <Box style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", position: "relative"}}>
            <Box style={styles.itemBox}>
                <Typography style={styles.title}>{title}</Typography>
                <Box style={{flexGrow: 1}}/>
                <>
                    {_.size(viewMode) > 1 && (
                        <ToggleButtonGroup style={{marginRight: "1rem"}} exclusive value={viewDirection} onChange={(e, v) => setViewDirection(v)} size="small">
                            <ToggleButton value={ViewDirection.Horizontal}><ViewAgendaIcon /></ToggleButton>
                            <ToggleButton value={ViewDirection.Vertical}><ViewAgendaIcon style={{transform: 'rotate(90deg)'}}  /></ToggleButton>
                        </ToggleButtonGroup>
                    )}
                    <ToggleButtonGroup value={viewMode} onChange={(_, values) => setViewMode(values)} size="small">
                        <ToggleButton value={ViewMode.List}>リスト</ToggleButton>
                        <ToggleButton value={ViewMode.Map}>地図</ToggleButton>
                    </ToggleButtonGroup>
                </>
                <IconButton onClick={() => load(true)}>
                    <CachedIcon />
                </IconButton>
                <GroupItemSelectorComponent items={ViewItems} onSelect={setViewItem} selected={state.viewItem} />
            </Box>
            <Box style={{display: "flex", flexDirection: viewDirection === ViewDirection.Vertical ? "row" : "column", flexGrow: 1}}>
                {viewMode.includes(ViewMode.List) && !rowData && <Box><Typography>読込中...</Typography></Box>}
                {viewMode.includes(ViewMode.List) && rowData && state.viewItem === ViewItem.Master && <FacilityView data={rowData} viewMode={viewMode} onMapClick={onListMapClick} />}
                {viewMode.includes(ViewMode.List) && rowData && state.viewItem === ViewItem.Tree && <TreeView data={rowData} />}
                {viewMode.includes(ViewMode.Map) && <MapView viewItem={state.viewItem} viewMode={viewMode} viewDirection={viewDirection} facility={facility} />}
            </Box>
        </Box>
    )

}

export default MasterGroupView
