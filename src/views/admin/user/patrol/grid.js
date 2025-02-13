import React from "react";
import {AgGridReact} from "ag-grid-react";
import PropTypes from "prop-types";
import ColumnDefs from "./column"
import LOCALE_JA from "../../../../resources/aggrid/locale.ja";

const AdminUserAdminGridView = React.memo(({rowData, onEdit, onDelete}) => {

    const columnDefs = ColumnDefs({
        onEdit,
        onDelete
    })

    return (
        <AgGridReact
            rowData={rowData}
            localeText={LOCALE_JA}
            className={'ag-theme-balham'}
            columnDefs={columnDefs}
            defaultColDef={{
                floatingFilter: true,
                resizable: true,
            }}
        />
    )

})

AdminUserAdminGridView.propTypes = {
    rowData: PropTypes.array,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
}

export default AdminUserAdminGridView
