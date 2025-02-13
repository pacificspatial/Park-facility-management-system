import dayjs from "dayjs";

export const ColumnDefs = ({timeValueGetter, timeValueSetter}) => [
    {
        field: "group_key",
        headerName: "グループ",
        rowGroup: true,
        hide: true,
    },
    {
        field: "facility_title",
        headerName: "遊具・施設名"
    },
    {
        field: "value",
        headerName: "数値",
        editable: (params) =>
            params.data.type.match(/^water_/)
    },
    {
        cellDataType: "boolean",
        headerName: "報告",
        width: 90,
        valueGetter: (params) => {
            if (["屋外遊具", "あそびの里", "水遊具", "施設", "地点報告"].includes(params.data?.type)) {
                return null
            }
            return !!params.data?.incident_id || !!params.data?.repair_text || !!params.data?.report_text
        },
    },
    {
        field: "report_text",
        headerName: "状態",
        width: 120,
        editable: (params) => {
            return !(params.data.type.match(/^water_/))
        }
    },
    {
        field: "repair_text",
        headerName: "処置",
        width: 120,
        editable: (params) => {
            return !(params.data.type.match(/^water_/))
        }
    },
    {
        field: "latest_status_name",
        headerName: "現状",
        width: 90,
        editable: (params) =>
            !(params.data.type.match(/^water_/))
    },
    {
        field: "checkin_at",
        headerName: "IN・点検時刻",
        width: 120,
        editable: true,
        valueSetter: timeValueSetter,
        valueGetter: timeValueGetter,
    },
    {
        field: "checkout_at",
        headerName: "OUT時刻",
        width: 100,
        editable: true,
        valueSetter: timeValueSetter,
        valueGetter: timeValueGetter,

    },
]
