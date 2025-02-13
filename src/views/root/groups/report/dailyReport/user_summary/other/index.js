import React, {useCallback, useRef} from "react"
import Box from "@mui/material/Box";
import {AgGridReact} from "ag-grid-react";
import {ColumnDef} from "./column";
import PropTypes from "prop-types";
import LOCALE_JA from "../../../../../../../resources/aggrid/locale.ja";
import {useTimeValue} from "../index";

const styles = {
    root: {
        width: '100%',
        height: '155px',
    }
}

const ReportUserSummaryOtherView = ({day, data, onChange}) => {

    const apiRef = useRef()

    const {timeValueGetter, timeValueSetter} = useTimeValue({day})

    const onGridReady = (params) => {
        apiRef.current = params.api
    }

    return (
        <Box style={styles.root}>
            <AgGridReact
                onGridReady={onGridReady}
                localeText={LOCALE_JA}
                className={'ag-theme-balham'}
                columnDefs={ColumnDef}
                rowData={data}
                onCellEditingStopped={onChange}
                components={{
                    timeValueSetter,
                    timeValueGetter,
                }}
            />
        </Box>
    )
}

ReportUserSummaryOtherView.propTypes = {
    day: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default ReportUserSummaryOtherView
