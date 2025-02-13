import React, {useCallback, useContext} from "react"
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import {AgGridReact} from "ag-grid-react";
import {ColumnDefs as getColumnDefs} from "./column"
import {DefaultColDef, useTimeValue} from "../index";
import LOCALE_JA from "../../../../../../../resources/aggrid/locale.ja";
import _ from "lodash";
import dayjs from "dayjs";
import {MainDataContext} from "../../../../../../../App";
import PropTypes from "prop-types";

const styles = {
    root: {
        width: '100%',
        height: '300px',
    }
}

const ReportUserSummaryCheckView = ({data, day, onChange}) => {

    const { state } = useContext(MainDataContext)
    const {timeValueGetter, timeValueSetter} = useTimeValue({day})
    // const timeValueGetter = (params) => {
    //     if (!_.has(params.data, params.colDef.field)) {
    //         return null
    //     }
    //     const d = params.data[params.colDef.field]
    //     if (_.isNil(d)) { return null }
    //     return dayjs(d).format("HH:mm")
    // }
    //
    // const timeValueSetter = useCallback((params) => {
    //     console.log(params)
    //     let match
    //     if (match = params.newValue?.trim()?.match(/^[0-9]{1,2}:[0-9]{1,2}$/)) {
    //         params.data[params.colDef.field] = dayjs(`${day} ${match[0]}`).format()
    //         return true
    //     }
    //     if (match = params.newValue?.trim()?.match(/^([0-9]{2})([0-9]{2})$/)) {
    //         params.data[params.colDef.field] = dayjs(`${day} ${match[1]}:${match[2]}`).format()
    //         return true
    //     }
    //     return false
    // }, [day])

    const ColumnDefs = getColumnDefs({
        timeValueSetter,
        timeValueGetter,
    })

    return (
        <Box style={styles.root}>
            <AgGridReact
                localeText={LOCALE_JA}
                className={'ag-theme-balham'}
                columnDefs={ColumnDefs}
                rowData={data}
                defaultColDef={DefaultColDef}
                onCellEditingStopped={onChange}
                components={{
                    timeValueSetter,
                    timeValueGetter,
                }}
            />
        </Box>
    )
}

ReportUserSummaryCheckView.propTypes = {
    day: PropTypes.string.isRequired,
    data: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default ReportUserSummaryCheckView
