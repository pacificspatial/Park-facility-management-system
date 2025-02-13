import React from "react"
import PropTypes from "prop-types";
import {AgGridReact} from "ag-grid-react";
import { ColumnDefs, DefaultColDef } from "./column"
import Box from "@mui/material/Box";
import LOCALE_JA from "../../../../../../resources/aggrid/locale.ja";


const ReportGroupTrackingListView = React.memo(({data}) => {

    return (
        <Box style={{width: "100%", height: "100%"}}>
            <AgGridReact
                localeText={LOCALE_JA}
                className={'ag-theme-balham'}
                columnDefs={ColumnDefs}
                rowData={data}
                defaultColDef={DefaultColDef}
            />
        </Box>
    )
})

ReportGroupTrackingListView.propTypes = {
    data: PropTypes.array.isRequired,
}

export default ReportGroupTrackingListView
