import dayjs from "dayjs";
import {SUMMARY_ROW_OFFSET, SUMMARY_USER_OFFSET} from "../../export";
import {GetSummaryData} from "./util";

const DailyReportExportExcelSummaryHeader = (sheet, users, data, row = 1) => {

    // 名前
    console.log(sheet, row)
    sheet.getCell(row, 1).value = "名前"
    for(const [i, user] of users.entries()) {
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = user.user_name
    }
    // 作業開始
    sheet.getCell(++row, 1).value = "作業開始"
    for(const [i, user] of users.entries()) {
        const d = GetSummaryData(data, user, "work_time")
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = d?.open_time ? dayjs(d.open_time).format("HH:mm") : null
    }
    // 作業終了
    sheet.getCell(++row, 1).value = "作業終了"
    for(const [i, user] of users.entries()) {
        const d = GetSummaryData(data, user, "work_time")
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = d?.close_time ? dayjs(d.close_time).format("HH:mm") : null
    }
    // 体調
    sheet.getCell(++row, 1).value = "体調"
    for(const [i, user] of users.entries()) {
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = user.health ? "良好": "不調"
    }
    // 天候
    sheet.getCell(++row, 1).value = "天候"
    for(const [i, user] of users.entries()) {
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = user.weather
    }

    return row + 1

}

export default DailyReportExportExcelSummaryHeader
