import {Button} from "@mui/material";
import PropTypes from "prop-types";
import _ from "lodash"

const AdminUserAdminGridColumnDefs = ({onChangePassword, onEdit, onDelete}) => {


    return [
        {
            headerName: "メールアドレス",
            field: "email",
            sortable: true,
            filter: true,
        },
        {
            headerName: "名前",
            field: "display_name",
            sortable: true,
            filter: true,
        },
        {
            headerName: "権限",
            field: "role",
            valueGetter: (params) => {
                return _.isEmpty(params.data?.role) ? "管理者" : "閲覧者"
            },
            sortable: true,
            filter: true,
        },
        {
            headerName: "UID",
            field: "uid",
            sortable: true,
            filter: true,
        },
        {
            headerName: "設定",
            width: 260,
            cellRenderer: (params) => {
                return (
                    <>
                        <Button size="small" onClick={() => onChangePassword(params)}>パスワード変更</Button>
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
