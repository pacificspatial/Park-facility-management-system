import dayjs from "dayjs";
import IconButton from "@mui/material/IconButton";
import {OpenInNew as OpenInNewIcon} from "@mui/icons-material";


export const ColumnDefs = [
    {
        field: "measured_at",
        headerName: "時刻",
        valueGetter: (params) => {
            console.log('Time', params)
            return dayjs(params.data.measured_at).format("HH:mm")
        }
    },
    {
        field: "zone_name",
        headerName: "ゾーン",
    },
    {
        field: "nearest_facility_code",
        headerName: "施設コード"
    },
    {
        field: "nearest_facility_name",
        headerName: "施設名",
    },
    {
        field: "nearest_facility_distance",
        headerName: "施設までの距離",
        cellRenderer: (params) => {
            if (!params.value) { return null }
            let l = parseInt(params.value)
            if (l < 0) {
                return "施設周辺"
            }
            if (l > 10000) {
                return `${parseInt(l / 1000).toLocaleString()}km`
            }
            if (l > 1100) {
                return `${(l / 1000).toFixed(1).toLocaleString()}km`
            }
            return `${l.toLocaleString()}m`
        }
    },
    {
        headerName: "ステータス(端末判定)",
        cellRenderer: (params) => {
            console.log(params)
            if (!params.data.is_moving) {
                return "滞在"
            }
            switch(params.data.activity) {
                case "in_vehicle":
                    return "車移動"
                case "running":
                    return "徒歩(速い)"
                case "walking":
                    return "徒歩(普通)"
                case "on_bicycle":
                    return "自転車等"
                case "still":
                    return "滞在"
                default:
                    break
            }
            return `不明(${params.data.activity})`
        },
    },
    {
        headerName: "地図",
        cellRenderer: (params) => {
            return (
                <IconButton size="small" onClick={() => window.open(`https://maps.google.com/maps?q=${params.data.lat},${params.data.lon}`)}>
                    <OpenInNewIcon style={{fontSize: "12px"}} />
                </IconButton>
            )
        }
    },
]

export const DefaultColDef = {
    resizable: true,
}
