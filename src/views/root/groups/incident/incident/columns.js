import ViewMapButtonRenderer from "../../../list/renderer/view_map_button";
import DetailButtonRenderer from "../../../components/agGrid/renderer/detailButton";
import dayjs from "dayjs";
import VoiceButtonRenderer from "../../../components/agGrid/renderer/voiceButton";
import PhotosButtonRenderer from "../../../components/agGrid/renderer/photosButotn";

export const columnDefs = [
    {
        headerName: "",
        width: 40,
        cellRenderer: "mapIconRenderer"
    },
    {
        field: 'incident_uid',
        headerName: "確認",
        cellRenderer: "detailButtonRenderer",
        width: 80,
    },
    {
        colId: "first_time",
        field: "first_report.measured_at",
        headerName: "報告時間",
        filter: "agTextColumnFilter",
        width: 80,
        cellRenderer: (params) => {
            if (params.value) {
                return dayjs(params.value).format("HH:mm")
            }
            return null
        },
    },
    {
        colId: "last_date",
        field: "measured_at",
        headerName: "最終更新日時",
        filter: "agTextColumnFilter",
        width: 140,
        cellRenderer: (params) => {
            if (params.value) {
                return dayjs(params.value).format("YYYY/MM/DD HH:mm")
            }
            return null
        }
    },
    {
        colId: "status_name",
        field: "status_name",
        headerName: "現状",
        filter: "agTextColumnFilter",
        width: 100,
    },
    {
        colId: "facility_name",
        field: "facility_name",
        headerName: "施設名",
        filter: "agTextColumnFilter",
    },
    {
        colId: "facility_type",
        field: "facility_type",
        headerName: "種類",
        filter: "agTextColumnFilter",
    },
    {
        headerName: "状態",
        children: [
            {
                colId: "latest_report_text",
                field: "latest_report_text",
                headerName: "報告",
            },
            {
                colId: "latest_report_voice_url",
                field: "latest_report_voice_url",
                headerName: "音声",
                width: 60,
                cellRenderer: "voiceButtonRenderer",
            },
        ],
    },
    {
        headerName: "処置",
        children: [
            {
                colId: "latest_repair_text",
                field: "latest_repair_text",
                headerName: "報告",
            },
            {
                colId: "latest_repair_voice_url",
                field: "latest_repair_voice_url",
                headerName: "音声",
                width: 60,
                cellRenderer: "voiceButtonRenderer",
            },
        ]
    },
    {
        colId: 'photos',
        field: 'photos',
        headerName: "写真",
        cellRenderer: "photoIconRenderer"
    },
    {
        colId: "user_name",
        field: "user_name",
        headerName: "報告者",
    }
]

export const defaultColDef = {
    sortable: true,
    resizable: true,
}
