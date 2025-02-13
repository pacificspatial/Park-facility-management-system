import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import _ from "lodash";
import {OpenInNew as OpenInNewIcon} from "@mui/icons-material";
import {rendererStyles} from "./index";

const styles = {
    ...rendererStyles,
}

const DetailButtonRenderer = ({onClick, value, data, node, type, view}) => {

    return _.isEmpty(value) ? null : (
        <IconButton style={styles.iconButton} size="small" onClick={() => {
            onClick && onClick({
                value,
                data,
                node,
                type,
                view
            })
        }}>
            <OpenInNewIcon style={styles.icon} />
        </IconButton>
    )
}

DetailButtonRenderer.propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.any,
    data: PropTypes.any,
    node: PropTypes.any,
    type: PropTypes.string,
}

export default DetailButtonRenderer
