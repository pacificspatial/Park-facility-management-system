import React, {useCallback, useEffect, useMemo, useState} from "react"
import PropTypes from "prop-types";
import {Backdrop} from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useApiManager from "../../../../manager/api2";
import {Close as CloseIcon} from "@mui/icons-material";
import IconButton from "@mui/material/IconButton";
import {ColumnDefs as FacilityColumnDefs} from "./facility/column"
import {ColumnDefs as TreeColumnDefs} from "./tree/column"

const styles = {
    backDrop: {
        zIndex: 10,
    },
    root: {
        background: 'white',
        borderRadius: '18px',
        boxShadow: '1px 1px 8px #5f5f5f',
        overflow: "hidden",
    },
    headerBox: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#989898',
        overflow: 'hidden',
        padding: '0.3rem 1rem',
    },
    bodyOuterBox: {
        margin: '0.5rem 1rem',
        display: 'flex',
        flexDirection: 'column',
    },
    bodyRowBox: {
        background: "#0e0",
        display: "flex",
        flexDirection: "row",
    },
    bodyNameBox: {
        fontSize: "12px",
        color: "#333",
        width: "200px",
        height: "28px",
        borderTopWidth: "0.5px",
        borderRightWidth: "1px",
        borderLeftWidth: "1px",
        borderBottomWidth: "0",
        borderColor: "#000",
        borderStyle: "solid",
        display: "flex",
        alignItems: "center",
        paddingLeft: "0.5rem",
    },
    bodyValueBox: {
        fontSize: '14px',
        borderColor: '#000',
        borderStyle: 'solid',
        background: 'white',
        flexGrow: '1',
        minWidth: '300px',
        borderTopWidth: "0.5px",
        borderRightWidth: "1px",
        borderLeftWidth: "0",
        borderBottomWidth: "0",
        display: 'flex',
        alignItems: 'center',
        paddingLeft: '0.5rem',
    },
}

const MasterGroupInfoView = ({facilityCode, open, onClose}) => {

    const [elem, setElem] = useState()
    const { GetFirst } = useApiManager()

    useEffect(() => {
        if (!facilityCode) {
            setElem(null)
            return
        }

        if (facilityCode.startsWith("GRN")) {
            GetFirst(`tree/info/${facilityCode}`).then(updateElem)
        } else {
            GetFirst(`facility/info/${facilityCode}`).then(updateElem)
        }

    }, [facilityCode])

    const updateElem = useCallback((data) => {
        if (!data) {
            setElem(null)
            return
        }

        const colDefs = data.facility_code?.startsWith("GRN") ? TreeColumnDefs : FacilityColumnDefs
        const values = colDefs.map(def => {
            if (def.hide) { return null }
            if (!data[def.field]) { return null }
            return {
                name: def.headerName,
                value: data[def.field]
            }
        }).filter(v => !!v)

        setElem((
            <Box style={styles.contentBox}>
                <Box style={styles.headerOuterBox}>
                    <Box style={styles.headerBox}>
                        <Box style={{display: "flex", flexDirection: "row", alignItems: "center", gap: "4px"}}>
                        <Typography>{facilityCode}</Typography>
                        {!data.facility_code?.startsWith("GRN") && (
                            <Typography>{data.facility_name}</Typography>
                        )}
                            <Typography>詳細情報</Typography>
                        </Box>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
                <Box style={styles.bodyOuterBox}>
                    {values.map((v, i)=> (
                        <Box style={styles.bodyRowBox}>
                            <Box style={{...styles.bodyNameBox, ...(i === values.length - 1 ? {borderBottomWidth: "0.5px"}: null)}}>{v.name}</Box>
                            <Box style={{...styles.bodyValueBox, ...(i === values.length - 1 ? {borderBottomWidth: "0.5px"}: null)}}>{v.value}</Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        ))

    }, [facilityCode])


    return (
        <Backdrop open={open} style={styles.backDrop}>
            <Box style={styles.root}>
                {elem ? elem : <Typography>読込中...</Typography>}
            </Box>
        </Backdrop>
    )
}

MasterGroupInfoView.propTypes = {
    facilityCode: PropTypes.string,
    open: PropTypes.bool,
    onClose: PropTypes.func,
}

export default MasterGroupInfoView
