import {Button} from "@mui/material";
import PropTypes from "prop-types";
import _ from "lodash"

const AdminUserAdminGridColumnDefs = ({onChangePassword, onEdit, onDelete}) => {


    return [
        {
            headerName: "ID",
            field: "user_id",
            sortable: true,
            filter: true,
        },

        {
            headerName: "名前",
            field: "user_name",
            sortable: true,
            filter: true,
        },
        {
            headerName: "タイプ",
            field: "user_type",
            valueGetter: (params) => {
                return params.data.user_type === 99 ? "管理者" : "巡視員"
            },
            sortable: true,
            filter: true,
        },
        {
            headerName: "ソート",
            field: "sort",
            sortable: true,
            filter: true,
        },
        {
            headerName: "設定",
            width: 260,
            cellRenderer: (params) => {
                return (
                    <>
                        <Button size="small" onClick={() => onEdit(params)}>編集</Button>
                        <Button size="small" onClick={() => onDelete(params)}>削除</Button>
                    </>
                )
            }
        },
    ]
}

AdminUserAdminGridColumnDefs.propTypes = {
    onChangePassword: PropTypes.func,
    onEdit: PropTypes.func,
    onDelete: PropTypes.func,
}

export default AdminUserAdminGridColumnDefs
