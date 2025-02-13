import React, {useEffect, useMemo, useRef} from "react"
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import ContentView from "./content"

const styles = {
    root: {
        border: '3px inset #d8d8d8',
        overflowY: 'auto',
        flexGrow: '1',

    },
    outerBox: {
        '& :hover': {
            background: "#fffbf7",
        },
    },
    innerBox: {
        padding: '0.3rem 1rem 1rem 1rem'
    },
}

const IncidentReportInfoReportView = React.memo(({data, onChange}) => {

    const contentRef = useRef()

    useEffect(() => {
        let tm = setTimeout(() => {
            contentRef.current.scrollTop = contentRef.current.scrollHeight
        }, 1)

        return () => {
            clearTimeout(tm)
        }
    }, [data])


    return (
        <Box ref={contentRef} sx={styles.root}>
            <Box sx={styles.outerBox}>
            {data?.map((d, i) => {
                let p = i > 0 ? data[i - 1] : null
                return (
                    <Box sx={styles.innerBox}>
                        <ContentView key={`incident_${d.incident_id}`} data={d} prev={p} />
                    </Box>
                )
            })}
            </Box>
        </Box>
    )


})

IncidentReportInfoReportView.propTypes = {
    data: PropTypes.array,
    onChange: PropTypes.func.isRequired,
}

export default IncidentReportInfoReportView
