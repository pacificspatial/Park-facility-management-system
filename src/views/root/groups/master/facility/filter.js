import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import {useEffect} from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Close as CloseIcon} from "@mui/icons-material";
import {Button} from "@mui/material";
import useAgGridManager from "../../../../../manager/agGrid";

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'row',
        margin: '8px',
        alignItems: "center",
        gap: "8px",
    },
    label: {
        fontSize: '14px',
    }
}

const MasterGroupFacilityFilterView = ({filterModel, columnDefs, onResetColumnState, onRemoveFilter, onExportExcel}) => {

    const { getFilterComponent } = useAgGridManager()

    useEffect(() => {
        console.log("[FilterView]", filterModel, columnDefs)
    }, [filterModel, columnDefs])

    return (
        <Box style={styles.root}>
            <Typography style={styles.label}>フィルター:</Typography>
            {filterModel && Object.entries(filterModel).map(([key, value]) => {
                const colDef = columnDefs.find(v => v.field === key)
                return (
                    <Box key={key}>
                        {getFilterComponent({filter: value, colDef, onRemove: () => onRemoveFilter(value, colDef)})}
                    </Box>
                )
            })}
            <Box style={{flexGrow: 1}} />
            <Button variant="outlined" onClick={onResetColumnState}>列初期化</Button>
            <Button variant="outlined" onClick={onExportExcel}>Excel出力</Button>
        </Box>
    )

}

MasterGroupFacilityFilterView.propTypes = {
    filterModel: PropTypes.object,
    columnDefs: PropTypes.array,
    onRemoveFilter: PropTypes.func.isRequired,
    onResetColumnState: PropTypes.func.isRequired,
    onExportExcel: PropTypes.func.isRequired,
}

export default MasterGroupFacilityFilterView
