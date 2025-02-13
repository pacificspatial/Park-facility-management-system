import React from "react"
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {Close as CloseIcon} from "@mui/icons-material";

const styles = {
    root: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        background: '#73bb73',
        borderRadius: '8px',
        padding: '4px 8px',
    },
    name: {
        fontWeight: "bold",
        fontSize: "12px",
    },
    valueText: {
        fontSize: "14px",
    },
    closeIcon: {
        fontSize: "14px",
    },
    multiConditionBox: {
        display: 'flex',
        alignItems: 'center',
    },
    operator: {
        color: "#333",
        fontSize: "12px",
    },
    setValue: {
        fontSize: '14px',
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    setValueBox: {
        display: "flex",
        flexDirection: "row",
    }
}

const useAgGridManager = () => {


    const getFilterValueComponent = (filter, style) => {
        if (filter.operator) {
            const cond1 = getFilterValueComponent(filter.condition1, style)
            const cond2 = getFilterValueComponent(filter.condition2, style)
            if (!cond1 || !cond2) { return null }
            return (
                <Box style={style.multiConditionBox}>
                    {cond1}
                    {filter.operator === "AND" && <Typography style={style.operator}>かつ</Typography>}
                    {filter.operator === "OR" && <Typography style={styles.operator}>または</Typography>}
                    {cond2}
                </Box>
            )
        }
        switch(filter.filterType) {
            case "text":
                return (<Typography style={style.valueText}>{getTextFilterValue(filter)}</Typography>)
            case "number":
                return (<Typography style={style.valueText}>{getNumberFilterValue(filter)}</Typography>)
            case "set":
                return (<Typography style={style.valueText}>{getSetFilterValue(filter, style)}</Typography>)
            case "date":
                return (<Typography style={style.valueText}>{getDateFilterValue(filter)}</Typography>)
            default:
                break
        }
        return null
    }

    const getFilterComponent = ({filter, colDef, onRemove, style}) => {
        const _styles = {...styles, ...style}
        let value = getFilterValueComponent(filter, _styles)
        console.log(filter, style, value)
        if (!value) { return null }

        return (
            <Box style={_styles.root}>
                <Typography style={_styles.name}>{colDef.headerName}：</Typography>
                {value}
                <IconButton style={_styles.closeButton} onClick={() => onRemove(filter, colDef)}><CloseIcon style={_styles.closeIcon} /></IconButton>
            </Box>
        )

    }

    const getTextFilterValue = (filter) => {
        switch(filter.type) {
            case "contains":
                return `含む『${filter.filter}』`
            case "notContains":
                return `含まない『${filter.filter}』`
            case "equals":
                return `一致『${filter.filter}』`
            case "notEqual":
                return `不一致『${filter.filter}』`
            case "startsWith":
                return `先頭一致『${filter.filter}』`
            case "endsWidth":
                return `後方一致『${filter.filter}』`
            case "blank":
                return `(空白)`
            case "notBlank":
                return `(空白以外)`
            default:
                break
        }
    }

    const getNumberFilterValue = (filter) => {
        switch(filter.type) {
            case "equals":
                return `等しい『${filter.filter}』`
            case "notEqual":
                return `等しくない『${filter.filter}』`
            case "lessThan":
                return `『${filter.filter}』未満`
            case "lessThanOrEqual":
                return `『${filter.filter}』以下`
            case "greaterThan":
                return `『${filter.filter}』超過`
            case "greaterThanOrEqual":
                return `『${filter.filter}』以上`
            case "inRange":
                return `『${filter.filter}』〜『${filter.filterTo}』`
            case "blank":
                return '(空白)'
            case "notBlank":
                return '(空白以外)'
            default:
                break
        }
        return null
    }

    const getSetFilterValue = (filter, style) => {
        return (<Box style={style.setValueBox}>『<Typography style={style.setValue}>{filter.values.join(',')}</Typography>』</Box>)
    }

    const getDateFilterValue = (filter) => {
        return null
    }

    return {
        getFilterComponent,
    }

}

export default useAgGridManager
