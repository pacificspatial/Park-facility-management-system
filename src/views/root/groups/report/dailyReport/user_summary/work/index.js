import React from "react"
import Box from "@mui/material/Box";
import {AgGridReact} from "ag-grid-react";
import getColumnDefs from "./column";
import {DefaultColDef, useTimeValue} from "../index";
import LOCALE_JA from "../../../../../../../resources/aggrid/locale.ja";
import PropTypes from "prop-types";

const styles = {
    root: {
        width: '100%',
        height: '300px',
    }
}

const ReportUserSummaryWorkView = ({day, data, onChange}) => {

    const {timeValueSetter, timeValueGetter} = useTimeValue({day})

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
                onCellEditingStopped={onChange}
                defaultColDef={DefaultColDef}
                components={{
                    timeValueGetter,
                    timeValueSetter,
                }}
            />
        </Box>
    )
}

ReportUserSummaryWorkView.propTypes = {
    day: PropTypes.string.isRequired,
    data: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired,
}

export default ReportUserSummaryWorkView
