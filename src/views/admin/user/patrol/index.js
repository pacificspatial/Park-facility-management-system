import React, {useCallback, useEffect, useState} from "react"
import Box from "@mui/material/Box";
import {
    Button, Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import GridView from "./grid"
import useApiManager from "../../../../manager/api2";
import "ag-grid-community/styles/ag-grid.css"
import "ag-grid-community/styles/ag-theme-balham.min.css"
import _ from "lodash"
import Typography from "@mui/material/Typography";

const styles = {
    root: {
        position: "relative",
        flexGrow: 1,
    },
    rootBox: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    headerBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        padding: '10px',
    }
}

const UserType = {
    Admin: "admin",
    Patrol: "patrol",
}

const AdminUserPatrolListView = (props) => {

    const [rowData, setRowData] = useState()
    const [loading, setLoading] = useState(false)
    const [loadError, setLoadError] = useState()
    const [newUserName, setNewUserName] = useState()
    const [newSort, setNewSort] = useState()
    const [newUserType, setNewUserType] = useState(UserType.Patrol)
    const [editingUserId, setEditingUserId] = useState()
    const [openConfirmNewSubmit, setOpenConfirmNewSubmit] = useState(false)
    const [openConfirmEditSubmit, setOpenConfirmEditSubmit] = useState(false)
    const [openConfirmDeleteSubmit, setOpenConfirmDeleteSubmit] = useState(false)
    const [openProcessSuccessful, setOpenProcessSuccessful] = useState(false)
    const [openProcessFailed, setOpenProcessFailed] = useState(false)
    const [openConfirmPasswordChange, setOpenConfirmPasswordChange] = useState(false)
    const [openChangePassword, setOpenChangePassword] = useState(false)
    const [errorMessage, setErrorMessage] = useState()

    const { Get, Put, Post, Delete } = useApiManager()

    const load = useCallback(() => {
        Get("admin/users/patrol")
            .then(setRowData)
            .catch(setLoadError)
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        load()
    }, [])


    const onEdit = useCallback((params) => {
        setEditingUserId(params.data.user_id)
        setNewUserName(params.data.user_name)
        setNewUserType(params.data.user_type === 99 ? UserType.Admin : UserType.Patrol)
        setNewSort(params.data.sort)
    }, [])

    const onDelete = useCallback((params) => {
        setEditingUserId(params.data.user_id)
        setOpenConfirmDeleteSubmit(true)
    }, [])

    const onSubmit = useCallback(() => {

        console.log("[PatrolUser]", "on submit", newUserName, newUserType, editingUserId)

        if(_.isEmpty(newUserName)) { return }

        console.log("Validateda")

        if (!editingUserId) {
            setOpenConfirmNewSubmit(true)
        } else {
            setOpenConfirmEditSubmit(true)
        }

    }, [editingUserId, newUserName, newUserType])

    const onSubmitNew = useCallback(() => {
        setOpenConfirmNewSubmit(false)
        setLoading(true)
        Post("admin/patrol_user", {
            user_name: newUserName,
            user_type: newUserType === UserType.Admin ? 99 : 1,
            sort: newSort,
        }).then(res => {
            setOpenProcessSuccessful(true)
        }).catch(e => {
            setErrorMessage(e)
            setOpenProcessFailed(true)
        }).finally(() => setLoading(false))
    }, [newUserName, newUserType, newSort])

    const onSubmitEdit = useCallback(() => {
        setOpenConfirmEditSubmit(false)
        setLoading(true)
        Put("admin/patrol_user", {
            user_id: editingUserId,
            user_name: newUserName,
            user_type: newUserType === UserType.Admin ? 99 : 1,
            sort: newSort,
        }).then(res => {
            setOpenProcessSuccessful(true)
        }).catch(e => {
            setErrorMessage(e)
            setOpenProcessFailed(true)
        }).finally(() => setLoading(false))
    }, [Put, editingUserId, newUserName, newSort, newUserType])

    const onSubmitDelete = useCallback(() => {
        setOpenConfirmDeleteSubmit(false)
        setLoading(true)
        Delete("admin/patrol_user", {
            user_id: editingUserId,
        }).then(() => [
            setOpenProcessSuccessful(true)
        ]).catch(e => {
            setErrorMessage(e)
            setOpenProcessFailed(true)
        }).finally(() => setLoading(false))
    }, [editingUserId])


    const refreshAll = useCallback(() => {
        console.log("Refresh All")
        setNewSort("")
        setNewUserName("")
        setNewUserType(UserType.Patrol)
        setEditingUserId(null)
        setErrorMessage(null)
        setOpenConfirmNewSubmit(false)
        setOpenConfirmEditSubmit(false)
        setOpenConfirmDeleteSubmit(false)
        setOpenProcessSuccessful(false)
        setOpenProcessFailed(false)
        setOpenChangePassword(false)
        load()
    }, [load])

    const refreshError = useCallback(() => {
        console.log("Refresh Error")
        setErrorMessage(null)
        setOpenConfirmNewSubmit(false)
        setOpenConfirmEditSubmit(false)
        setOpenConfirmDeleteSubmit(false)
        setOpenProcessSuccessful(false)
        setOpenProcessFailed(false)
        setOpenChangePassword(false)
    },[])

    return (
        <Box style={styles.root}>
            <Box style={styles.rootBox}>
                <Box style={styles.headerBox}>
                    <Typography>{editingUserId ? "ユーザ編集" : "新規登録"}</Typography>
                    <TextField
                        InputLabelProps={{ shrink: true, }}
                        size="small"
                        value={newUserName}
                        onChange={e => setNewUserName(e.target.value)} label="名前"
                    />
                    <Select size="small" value={newUserType} onChange={e => setNewUserType(e.target.value)} label="ユーザタイプ">
                        <MenuItem value={UserType.Patrol}>巡視員</MenuItem>
                        <MenuItem value={UserType.Admin}>管理者</MenuItem>
                    </Select>
                    <TextField
                        InputLabelProps={{
                            shrink: true,
                        }}
                        size="small"
                        value={newSort}
                        onChange={e => setNewSort(e.target.value)}
                        error={newSort && isNaN(newSort)}
                        label="ソート"
                    />
                    <Button onClick={onSubmit} variant="contained">
                        {editingUserId ? "更新" : "登録"}
                    </Button>
                    <Button onClick={refreshAll} variant="outlined">
                        {editingUserId ? "キャンセル": "クリア"}
                    </Button>
                </Box>
                <Box style={{flexGrow: 1}}>
                    <GridView
                        rowData={rowData}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </Box>
                <Dialog open={openConfirmNewSubmit}>
                    <DialogTitle>登録しますか</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            名前: {newUserName ?? "--"}<br />
                            タイプ: {newUserType === UserType.Admin ? "管理者" : "巡視員"}<br />
                            ソート順: {newSort}<br />
                            このユーザを登録しますか？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onSubmitNew}>登録</Button>
                        <Button onClick={() => setOpenConfirmNewSubmit(false)}>キャンセル</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openConfirmEditSubmit}>
                    <DialogTitle>変更しますか</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            名前: {newUserName ?? "--"}<br />
                            タイプ: {newUserType === UserType.Admin ? "管理者" : "巡視員"}<br />
                            ソート順: {newSort}<br />
                            このユーザを登録しますか？
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onSubmitEdit}>登録</Button>
                        <Button onClick={() => setOpenConfirmEditSubmit(false)}>キャンセル</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openConfirmDeleteSubmit}>
                    <DialogTitle>本当に削除しますか</DialogTitle>
                    <DialogContent>
                        <DialogContentText>この操作はもとに戻せません。本当に削除しますか</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onSubmitDelete}>登録</Button>
                        <Button onClick={() => setOpenConfirmDeleteSubmit(false)}>キャンセル</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openProcessSuccessful}>
                    <DialogTitle>登録しました</DialogTitle>
                    <DialogActions>
                        <Button onClick={refreshAll}>OK</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openProcessFailed}>
                    <DialogTitle>登録に失敗しました</DialogTitle>
                    {errorMessage && <DialogContent>
                        <DialogContentText>{errorMessage}</DialogContentText>
                    </DialogContent>}
                    <DialogActions>
                        <Button onClick={refreshError}>OK</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    )
}

export default AdminUserPatrolListView
