import {ArrowBack as ArrowBackIcon} from "@mui/icons-material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";

const AdminHeaderView = ({onBack}) => {

    return (
        <Box>
            <IconButton onClick={onBack}>
                <ArrowBackIcon />
            </IconButton>
            管理者ツール
        </Box>
    )

}

AdminHeaderView.propTypes = {
    onBack: PropTypes.func,
}

export default AdminHeaderView
