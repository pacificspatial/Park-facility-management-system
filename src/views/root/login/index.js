import React, {useContext, useMemo, useState} from "react"
import {Box, Button, DialogContent, DialogTitle, TextField, Typography} from "@mui/material";
import {getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence} from "firebase/auth";
import axios from "axios";
import {MainDataContext} from "../../../App";

const LoginView = (props) => {

    const { setUser } = useContext(MainDataContext)
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const auth = useMemo(() => getAuth(), [])
    const [isError, setIsError] = useState()

    const onChangeEmail = (e) => {
        setEmail(e.target.value);
        setIsError(null)
    }
    const onChangePassword = (e) => {
        setPassword(e.target.value);
        setIsError(null)
    }

    const onPasswordKeyup = (e) => {
        console.log(e)
        if (!e.nativeEvent.isComposing && e.code === "Enter") {
            onLoginClick()
        }
    }

    const onLoginClick = () => {

        setPersistence(getAuth(), browserLocalPersistence)
            .then(() => {
                signInWithEmailAndPassword(auth, email, password)
                    .then(user => {
                        axios.post(`${process.env.REACT_APP_API_ENDPOINT}/auth/fb_user`, {
                            user,
                        })
                            .then(res => {

                            })
                            .catch(e => {
                                setIsError("ネットワークエラー。システム管理者へ連絡してください")
                            })
                        setUser(user)
                    })
                    .catch(e  => {
                        console.log(e.code)
                        if (e.code === "auth/invalid-credential") {
                            setIsError("メールアドレスまたはパスワードが違います")
                        } else {
                            setIsError(e)
                        }
                    })
            })
    }

    return (
        <Box style={{display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100vw',
            height: '100vh'}}>
            <Box style={{display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                width: '40%',
                maxWidth: '350px', alignItems: "center"}}>
                <Typography variant="h5">越後丘陵公園　施設管理</Typography>
                <TextField style={{width: "100%"}} label="メールアドレス" variant="outlined" size="small" type="email" value={email} onChange={onChangeEmail} />
                <TextField style={{width: "100%"}} label="パスワード" variant="outlined" size="small" type="password" value={password} onChange={onChangePassword} onKeyUp={onPasswordKeyup} />
                {isError && <Typography style={{color: "red"}}>{isError?.message ?? "メールアドレスまたはパスワードが違います"}</Typography>}
                <Button style={{margin: '8px',
                    width: '160px'}} variant="contained" onClick={onLoginClick}>ログイン</Button>
            </Box>
        </Box>
    )

}

LoginView.propTypes = {

}

export default LoginView
