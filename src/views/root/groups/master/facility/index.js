import React, {useCallback, useEffect, useMemo, useRef, useState} from "react"
import Box from "@mui/material/Box";
import {AgGridReact} from "ag-grid-react";
import "ag-grid-enterprise"
import { ColumnDefs, DefaultColDef} from "./column"
import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import {Place as PlaceIcon} from "@mui/icons-material";
import MapView from "./map"
import _ from "lodash";
import LOCALE_JA from "../../../../../resources/aggrid/locale.ja";
import FilterView from "../tree/filter";
import FooterView from "../footer"

const styles = {

}

const LocalStorageKeyColumnDefs = "_column_def_facility_master"
const LocalStorageKeyColumnState = "_column_state_facility_master"

const MasterGroupFacilityView = ({data, viewMode, onMapClick}) => {

    const [lngLat, setLngLat] = useState()
    const [selectMapData, setSelectMapData] = useState()
    const apiRef = useRef()
    const columnApiRef = useRef()
    const [filterModel, setFilterModel] = useState()
    const [total, setTotal] = useState(data.length)
    const [count, setCount] = useState(data.length)

    useEffect(() => {
        console.log("[SelectMapData]", selectMapData, viewMode, onMapClick)
        if (_.size(viewMode) > 1) {
            onMapClick(selectMapData)
        }
    }, [selectMapData, viewMode, onMapClick])

    const onGridReady = (params) => {
        apiRef.current = params.api
        columnApiRef.current = params.columnApi
        if (localStorage.getItem(LocalStorageKeyColumnState)) {
            try {
                const columnState = JSON.parse(localStorage.getItem(LocalStorageKeyColumnState))
                params.columnApi.applyColumnState({state: columnState, applyOrder: true})
            } catch(e) {}
        }
    }

    const rendererMapIcon = useCallback((params) => {
        return (
            <>
                {params.data.latitude && params.data.longitude && <IconButton
                    onClick={() => setSelectMapData(params.data)}
                    size="small">
                    <PlaceIcon size="small" />
                </IconButton>}
            </>
        )
    }, [viewMode])

    const onColumnStateChanged = _.debounce(() => {
        console.log("[List]", "change column state ", apiRef.current, apiRef.current.getColumnState, columnApiRef.current.getColumnState)
        // const colDefs = apiRef.current.getGridOption("columnDefs").map(d => {
        //     if (d.filterParams?._type) {
        //         d.filterParams = d.filterParams._type
        //     }
        //     return d
        // })
//        localStorage.setItem(LocalStorageKeyColumnDefs, JSON.stringify(colDefs))
        localStorage.setItem(LocalStorageKeyColumnState, JSON.stringify(columnApiRef.current.getColumnState()))
    }, 1000)

    const onFilterChanged = _.debounce(() => {
        console.log("[List]", "change filter model", apiRef.current.getFilterModel())
        setFilterModel(apiRef.current.getFilterModel())
    }, 1000)

    const onResetColumnState = () => {
        columnApiRef.current.resetColumnState()
    }

    const onRemoveFilter = useCallback((filter, colDef) => {
        let model = {...filterModel}
        delete model[colDef.field]
        setFilterModel(model)
        apiRef.current.setFilterModel(model)
    }, [filterModel])

    const onExportExcel = () => {
        apiRef.current.exportDataAsExcel()
    }

    const onFilterModified = _.debounce(() => {
        setCount(apiRef.current.getDisplayedRowCount())
    }, 100)

    return (
        <Box style={{flexGrow: 1, display: "flex", flexDirection: "column"}}>
            <FilterView
                columnDefs={ColumnDefs}
                filterModel={filterModel}
                onResetColumnState={onResetColumnState}
                onRemoveFilter={onRemoveFilter}
                onExportExcel={onExportExcel}
            />
            <Box style={{flexGrow: 1}}>
                <AgGridReact
                    localeText={LOCALE_JA}
                    className={'ag-theme-balham'}
                    columnDefs={ColumnDefs}
                    defaultColDef={DefaultColDef}
                    onGridReady={onGridReady}
                    onFilterModified={onFilterModified}
                    onSortChanged={onColumnStateChanged}
                    onColumnResized={onColumnStateChanged}
                    onColumnVisible={onColumnStateChanged}
                    onColumnMoved={onColumnStateChanged}
                    onFilterChanged={onFilterChanged}
                    rowData={data}
                    components={{
                        rendererMapIcon,
                    }}
                    sideBar={{
                        toolPanels: [
                            {
                                id: "columns",
                                labelDefault: "列選択",
                                labelKey: "columns",
                                iconKey: "columns",
                                toolPanel: "agColumnsToolPanel",
                                toolPanelParams: {
                                    suppressRowGroups: true,
                                    suppressValues: true,
                                    suppressPivots: true,
                                    suppressPivotMode: true,
                                    suppressColumnFilter: true,
                                    suppressColumnSelectAll: true,
                                    suppressColumnExpandAll: true,
                                },
                            },
                        ],
                    }}
                />
            </Box>
            <FooterView count={count} total={total} />
            {_.size(viewMode) === 1 && selectMapData && <MapView data={selectMapData} onClose={() => setSelectMapData(null)} />}
        </Box>
    )
}

MasterGroupFacilityView.propTypes = {
    data: PropTypes.array.isRequired,
    viewMode: PropTypes.array,
    onMapClick: PropTypes.func.isRequired,
}

export default MasterGroupFacilityView
