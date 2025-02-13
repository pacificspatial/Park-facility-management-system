import {AddRowValues, GetSummaryData} from "./util";
import {SUMMARY_ROW_OFFSET, SUMMARY_USER_OFFSET} from "../../export";


const GetWorkItems = (data, users, type) => {
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

const DailyReportExportExcelSummaryWork = (sheet, users, data, row = 1) => {

    const openWorkItems = GetWorkItems(data, users, "open")
    const closeWorkItems = GetWorkItems(data, users, "close")

    sheet.getCell(++row, 1).value = "開園業務"
    sheet.getCell(++row, 1).value = "項目"
    sheet.getCell(row, 2).value = "確認"
    for(const item of openWorkItems) {
        sheet.getCell(++row, 1).value = item.item_name
        for(const [i, user] of users.entries()) {
            const d = GetSummaryData(data, user, "work_report").find(v => v.type === "open" && v.item_id === item.item_id)
            sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = d?.measured_at ? "◯" : null
        }
    }


    sheet.getCell(++row, 1).value = "園内業務"
    sheet.getCell(++row, 1).value = "項目"
    sheet.getCell(row, 2).value = "確認"
    for(const item of closeWorkItems) {
        sheet.getCell(++row, 1).value = item.item_name
        for(const [i, user] of users.entries()) {
            const d = GetSummaryData(data, user, "work_report").find(v => v.type === "close" && v.item_id === item.item_id)
            sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = d?.measured_at ? "◯" : null
        }
    }

    return row + 1
}

export default DailyReportExportExcelSummaryWork
