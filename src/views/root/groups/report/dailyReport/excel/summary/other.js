import {SUMMARY_ROW_OFFSET, SUMMARY_USER_OFFSET} from "../../export";
import {GetSummaryData} from "./util";


const DailyReportExportExcelSummaryOther = (sheet, users, data, row = 1) => {

    sheet.getCell(++row, 1).value = "点検事項"
    // 予想される危険ポイント
    sheet.getCell(++row, 1).value = "予想される危険ポイント"
    for(const [i, user] of users.entries()) {
        const d = GetSummaryData(data, user, "other_report")?.find(v => v.item_id === 26)
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = d?.text
    }
    // 危険ポイントに対する対策
    sheet.getCell(++row, 1).value = "危険ポイントに対する対策"
    for(const [i, user] of users.entries()) {
        const d = GetSummaryData(data, user, "other_report")?.find(v => v.item_id === 27)
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = d?.text
    }
    // ルート巡回外の作業
    sheet.getCell(++row, 1).value = "ルート巡回外の作業"
    for(const [i, user] of users.entries()) {
        const d = GetSummaryData(data, user, "other_report")?.find(v => v.item_id === 24)
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = d?.text
    }
    // その他の特記事項
    sheet.getCell(++row, 1).value = "その他の特記事項"
    for(const [i, user] of users.entries()) {
        const d = GetSummaryData(data, user, "other_report")?.find(v => v.item_id === 25)
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).value = d?.text
    }

    return row + 1
}

export default DailyReportExportExcelSummaryOther
