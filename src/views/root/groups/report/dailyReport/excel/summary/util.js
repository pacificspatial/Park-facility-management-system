import _ from "lodash";

export const GetSummaryData = (data, user, key) =>
    _.get(data.find(({user:u}) => u.user_id === user.user_id)
        ?.summary_data, key)

export const GetWorkItems = (data, users, type) => {
    const values = []

    for(const user of users) {
        const d = GetSummaryData(data, user, "work_report").filter(v => v.type === type)
        if (!d) { continue }
        for(const item of d) {
            if(values.find(p => p.item_id === item.item_id)) { continue }
            values.push({
                item_id: item.item_id,
                item_name: item.item_name,
                type: item.type,
                sort: item.sort,
            })
        }
    }
    return values.sort((v1, v2) => v1.sort - v2.sort)
}

export const GetLocationReportItems = (data, user) =>  GetSummaryData(data, user, "check_report")?.filter(v => v.group_key === "地点報告")

export const AddRowValues = (sheet, row, arrayOfData, startCol = 1) => {
    let col = startCol
    for(const data of arrayOfData) {
        sheet.getCell(row, col++).value = data
    }
    return col
}
