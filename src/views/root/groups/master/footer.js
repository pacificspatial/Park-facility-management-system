import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const styles = {
    root: {
        display: 'flex',
        justifyContent: 'end',
        margin: '4px 8px',
        gap: '4px',
    },
    label: {
        fontWeight: "bold",
    },
    value: {
        marginRight: "8px",
    }
}

const MasterGroupFooterView = ({total, count}) => {

    return (
        <Box style={styles.root}>
            {total !== count && (
                <>
                <Typography style={styles.label}>件数</Typography>
                    <Typography style={styles.value}>{count?.toLocaleString() ?? "--"}</Typography>
                </>
            )}
            <>
                <Typography style={styles.label}>全件数</Typography>
                <Typography style={styles.value}>{total?.toLocaleString() ?? "--"}</Typography>
            </>
        </Box>
    )

}

MasterGroupFooterView.propTypes = {
    total: PropTypes.number.isRequired,
    count: PropTypes.number.isRequired,
}

export default MasterGroupFooterView
