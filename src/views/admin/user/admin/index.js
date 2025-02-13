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
    },
}

const PermissionType = {
    Admin: "admin",
    Reader: "reader",
}

const AdminUserAdminListView = (props) => {

    const [rowData, setRowData] = useState()
    const [loading, setLoading] = useState(false)
    const [loadError, setLoadError] = useState()
    const [newName, setNewName] = useState()
    const [newEmail, setNewEmail] = useState()
    const [newPermission, setNewPermission] = useState(PermissionType.Admin)
    const [newPassword, setNewPassword] = useState()
    const [editingUid, setEditingUid] = useState()
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
        Get("admin/users/admin")
            .then(setRowData)
            .catch(setLoadError)
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        load()
    }, [])

    const onChangePassword = useCallback((params) => {
        setNewPassword(null)
        setEditingUid(params.data.uid)
        setOpenChangePassword(true)
    }, [])

    const onEdit = useCallback((params) => {
        setEditingUid(params.data.uid)
        setNewName(params.data.display_name)
        setNewEmail(params.data.email)
        setNewPermission(_.isEmpty(params.data.role) ? PermissionType.Admin : PermissionType.Reader)
    }, [])

    const onDelete = useCallback((params) => {
        setEditingUid(params.data.uid)
        setOpenConfirmDeleteSubmit(true)
    }, [])

    const onSubmit = useCallback(() => {

        console.log("[AdminUser]", "on submit", newEmail, newPassword, editingUid)

        if(_.isEmpty(newEmail)) { return }
        if(_.isEmpty(editingUid) && (_.isEmpty(newPassword) || newPassword.length < 6)) { return }

        console.log("Validateda")

        if (!editingUid) {
            setOpenConfirmNewSubmit(true)
        } else {
            setOpenConfirmEditSubmit(true)
        }

    }, [newEmail, newPassword, editingUid])

    const onSubmitNew = useCallback(() => {
        setOpenConfirmNewSubmit(false)
        setLoading(true)
        Post("admin/admin_user", {
            name: newName,
            email: newEmail,
            password: newPassword,
            permission: newPermission,
        }).then(res => {
            setOpenProcessSuccessful(true)
        }).catch(e => {
            setErrorMessage(e)
            setOpenProcessFailed(true)
        }).finally(() => setLoading(false))
    }, [newName, newEmail, newPassword, newPermission])

    const onSubmitEdit = useCallback(() => {
        setOpenConfirmEditSubmit(false)
        setLoading(true)
        Put("admin/admin_user", {
            uid: editingUid,
            name: newName,
            email: newEmail,
            password: newPassword,
            permission: newPermission,
        }).then(res => {
            setOpenProcessSuccessful(true)
        }).catch(e => {
            setErrorMessage(e)
            setOpenProcessFailed(true)
        }).finally(() => setLoading(false))
    }, [editingUid, newName, newEmail, newPassword, newPermission])

    const onSubmitDelete = useCallback(() => {
        setOpenConfirmDeleteSubmit(false)
        setLoading(true)
        Delete("admin/admin_user", {
            uid: editingUid,
        }).then(() => [
            setOpenProcessSuccessful(true)
        ]).catch(e => {
            setErrorMessage(e)
            setOpenProcessFailed(true)
        }).finally(() => setLoading(false))
    }, [editingUid])

    const onSubmitChangePassword = useCallback(() => {
        setOpenConfirmPasswordChange(false)
        setLoading(true)
        Put("admin/admin_password", {
            uid: editingUid,
            password: newPassword,
        }).then(() => {
            setOpenProcessSuccessful(true)
        }).catch(e => {
            setErrorMessage(e)
            setOpenProcessFailed(true)
        }).finally(() => setLoading(false))
    }, [Put, editingUid, newPassword])

    const refreshAll = useCallback(() => {
        console.log("Refresh All")
        setNewEmail("")
        setNewName("")
        setNewPassword("")
        setNewPermission(PermissionType.Admin)
        setEditingUid("")
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
                    <Typography>{editingUid ? "ユーザ編集" : "新規登録"}</Typography>
                    <TextField InputLabelProps={{ shrink: true, }} size="small" value={newName} onChange={e => setNewName(e.target.value)} label="名前" />
                    <TextField InputLabelProps={{ shrink: true, }} size="small" value={newEmail} onChange={e => setNewEmail(e.target.value)} label="メールアドレス" />
                    {!editingUid && <TextField
                        size="small"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        inputProps={{ minLength: 6 }}
                        InputLabelProps={{ shrink: true, }}
                        error={!_.isEmpty(newPassword) && newPassword.length < 6}
                        label="パスワード" />}

                    <Select size="small" value={newPermission} onChange={e => setNewPermission(e.target.value)} label="権限">
                        <MenuItem value={PermissionType.Admin}>管理者</MenuItem>
                        <MenuItem value={PermissionType.Reader}>閲覧者</MenuItem>
                    </Select>
                    <Button onClick={onSubmit} variant="contained">
                        {editingUid ? "更新" : "登録"}
                    </Button>
                    <Button onClick={refreshAll} variant="outlined">
                        {editingUid ? "キャンセル" : "クリア"}
                    </Button>
                </Box>
                <Box style={{flexGrow: 1}}>
                    <GridView
                        rowData={rowData}
                        onChangePassword={onChangePassword}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                </Box>
                <Dialog open={openConfirmNewSubmit}>
                    <DialogTitle>登録しますか</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            名前: {newName ?? "--"}<br />
                            メール: {newEmail}<br />
                            パスワード: {newPassword}<br />
                            権限: {newPermission}<br />
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
                            名前: {newName ?? "--"}<br />
                            メール: {newEmail}<br />
                            権限: {newPermission}<br />
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
                <Dialog open={openChangePassword}>
                    <DialogTitle>変更するパスワードを入力してください</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            label="パスワード"
                            fullWidth
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => {
                            setOpenChangePassword(false)
                            setOpenConfirmPasswordChange(true)
                        }} disabled={newPassword?.length < 6}>登録</Button>
                        <Button onClick={() => setOpenChangePassword(false)}>キャンセル</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={openConfirmPasswordChange}>
                    <DialogTitle>パスワードを変更しますか</DialogTitle>
                    <DialogContent>
                        <DialogContentText>この変更はもとに戻せません<br />変更前に必ず「{newPassword}」をメモしてください</DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onSubmitChangePassword}>登録</Button>
                        <Button onClick={() => setOpenConfirmPasswordChange(false)}>キャンセル</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    )
}

export default AdminUserAdminListView
