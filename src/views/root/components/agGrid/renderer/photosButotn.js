import PropTypes from "prop-types";
import _ from "lodash";
import IconButton from "@mui/material/IconButton";
import {PhotoLibrary as PhotoLibraryIcon} from "@mui/icons-material";


const PhotosButtonRenderer = ({onClick, value}) => {


    return _.isEmpty(value) ? null : (
        <IconButton
            onClick={() => {onClick && onClick(value)}}
            size="small"
        >
            <PhotoLibraryIcon />
        </IconButton>
    )

}

PhotosButtonRenderer.propTypes = {
    onClick: PropTypes.func,
    value: PropTypes.array,
}

export default PhotosButtonRenderer
