import React from "react"
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import {Button, ButtonGroup} from "@mui/material";
import Typography from "@mui/material/Typography";

const styles = {
    menuItemButtonBox: {
        marginRight: "1.5rem",
        marginTop: "0.5rem",
        marginBottom: "0.5rem",
    },
    menuItemTitle: {}, logoutBox: {
        marginRight: "1rem",
        fontSize: "12px",
    },
}

const GroupItemSelectorComponent = React.memo(({items, selected, onSelect}) => {

    return (
        <Box style={styles.menuItemButtonBox}>
            <ButtonGroup variant="outlined">
                {items?.map(i => {
                    return (<Button
                        key={i.viewItem}
                        onClick={() => onSelect(i.viewItem)}
                        variant={i.viewItem === selected ? "contained": "outlined"}
                    >
                        <Typography style={styles.menuItemTitle}>{i.title}</Typography>
                    </Button>)
                })}
            </ButtonGroup>
        </Box>
    )

})

GroupItemSelectorComponent.propTypes = {
    items: PropTypes.array.isRequired,
    selected: PropTypes.string,
    onSelect: PropTypes.func.isRequired
}

export default GroupItemSelectorComponent
