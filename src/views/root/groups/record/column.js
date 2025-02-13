import dayjs from "dayjs";

export const columnDefs = [
    {
        field: "facility_name",
        headerName: "メーター",
        filter: "agTextColumnFilter",
    },
    {
        headerName: "1回目",
        children: [
            {
                field: "measured_at_1",
                headerName: "時間",
                filter: 'agTextColumnFilter',
                cellRenderer: (params) => params.value ? dayjs(params.value).format("HH:mm") : null,
            },
            {
                field: "value_1",
                headerName: "数値",
                filter: 'agNumberColumnFilter'
            },
            {
                field: "user_name_1",
                headerName: "作業者",
                filter: "agTextColumnFilter",
            }
        ]
    },
    {
        headerName: "2回目",
        children: [
            {
                field: "measured_at_2",
                headerName: "時間",
                filter: 'agTextColumnFilter',
                cellRenderer: (params) => params.value ? dayjs(params.value).format("HH:mm") : null,
            },
            {
                field: "value_2",
                headerName: "数値",
                filter: 'agNumberColumnFilter',
            },
            {
                field: "user_name_2",
                headerName: "作業者",
                filter: "agTextColumnFilter",
            }
        ]
    },
    {
        headerName: "3回目",
        children: [
            {
                field: "measured_at_3",
                headerName: "時間",
                filter: 'agTextColumnFilter',
                cellRenderer: (params) => params.value ? dayjs(params.value).format("HH:mm") : null,
            },
            {
                field: "value_3",
                headerName: "数値",
                filter: 'agNumberColumnFilter'
            },
            {
                field: "user_name_3",
                headerName: "作業者",
                filter: "agTextColumnFilter",
            }
        ]
    },
    {
        headerName: "4回目",
        children: [
            {
                field: "measured_at_4",
                headerName: "時間",
                filter: 'agTextColumnFilter',
                cellRenderer: (params) => params.value ? dayjs(params.value).format("HH:mm") : null,
            },
            {
                field: "value_4",
                headerName: "数値",
                filter: 'agNumberColumnFilter'
            },
            {
                field: "user_name_4",
                headerName: "作業者",
                filter: "agTextColumnFilter",
            }
        ]
    },
    {
        headerName: "5回目",
        children: [
            {
                field: "measured_at_5",
                headerName: "時間",
                filter: 'agTextColumnFilter',
                cellRenderer: (params) => params.value ? dayjs(params.value).format("HH:mm") : null,
            },
            {
                field: "value_5",
                headerName: "数値",
                filter: 'agNumberColumnFilter'

            },
            {
                field: "user_name_5",
                headerName: "作業者",
                filter: "agTextColumnFilter",
            }
        ]
    },
]

export const defaultColDef = {
    sortable: true,
    resizable: true,
}
