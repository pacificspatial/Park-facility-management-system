import {distinctFilterParams} from "../../../list/filter";
import React from "react";

export const ColumnDefs = [
    {
        field: "map",
        headerName: "",
        cellRenderer: "rendererMapIcon",
        width: 48,
    },
    {
        field: "facility_code",
        headerName: "樹木ID",
        filter: "agTextColumnFilter",
        sort: "asc",
        pinned: "left",
        width: 120,
        map_detail: true,
        cellRendererFramework: (params) => {
            return (
                <span
                    style={{
                        color: "#38389d",
                        textDecoration: "underline",
                        cursor: "pointer",
                    }}
                >
          {params.value}
        </span>
            )
        },
    },
    {
        field: "facility_name_optional",
        headerName: "樹木タイプ",
        filter: "agSetColumnFilter",
        width: 100,
        map_detail: true,
    },
    {
        field: "specific_facility_name",
        headerName: "種名",
        filter: "agSetColumnFilter",
        map_detail: true,
    },
    {
        field: "height",
        headerName: "樹高(m)",
        filter: "agNumberColumnFilter",
        width: 110,
        map_detail: true,
    },
    {
        field: "perimeter",
        headerName: "幹周(cm)",
        filter: "agNumberColumnFilter",
        width: 110,
        map_detail: true,
    },
    {
        field: "quantity_numeric",
        headerName: "数量",
        filter: "agNumberColumnFilter",
        width: 70,
    },
    {
        field: "quantity_unit",
        headerName: "単位",
        filter: "agSetColumnFilter",
        width: 70,
        map_label: true,
    },
    {
        field: "park_code",
        headerName: "公園コード",
        filter: "agSetColumnFilter",
        hide: true,
    },
    {
        field: "park_name",
        headerName: "公園名",
        filter: "agSetColumnFilter",
        hide: true,
    },
    {
        field: "park_type",
        headerName: "公園タイプ",
        filter: "agSetColumnFilter",
        hide: true,
    },
    {
        field: "elevation",
        headerName: "標高(m)",
        filter: "agNumberColumnFilter",
        width: 110,
        map_label: true,
    },
    {
        field: "note",
        headerName: "メモ",
        filter: "agTextColumnFilter",
        map_label: true,
    },
]

export const DefaultColDef = {
    resizable: true,
    sortable: true,
    floatingFilter: true,
}
