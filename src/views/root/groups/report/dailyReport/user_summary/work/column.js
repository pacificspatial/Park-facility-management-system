import PropTypes from "prop-types";

const getColumnDefs = ({timeValueGetter, timeValueSetter}) => [
    {
        field: "type_name",
        headerName: "グループ",
        rowGroup: true,
        width: 50,
        hide: true,
    },
    {
        field: "item_name",
        headerName: "内容",
        width: 300,
    },
    {
        headerName: "巡視員確認",
        cellDataType: "boolean",
        valueGetter: (params, value) => {
            console.log(params.data?.measured_at)
            return !!params.data?.measured_at
        }
    },
    {
        field: "measured_at",
        headerName: "開始時刻",
        editable: true,
        valueSetter: timeValueSetter,
        valueGetter: timeValueGetter,
    },
    {
        field: "",
        headerName: "終了時刻",
    },
]

getColumnDefs.propTypes = {
    timeValueGetter: PropTypes.func,
    timeValueSetter: PropTypes.func,
}

export default getColumnDefs
