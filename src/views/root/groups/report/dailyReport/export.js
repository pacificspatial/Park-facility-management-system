import ExcelJS from "exceljs";
import dayjs from "dayjs";
import root from "../../../index";
import SummaryHeader from "./excel/summary/header"
import SummaryOther from "./excel/summary/other"
import SummaryWork from "./excel/summary/work"
import SummaryCheck from "./excel/summary/check"

export const SUMMARY_USER_OFFSET = 5
export const SUMMARY_ROW_OFFSET = 3

const UseReportExport = () => {

    const exportExcel = async (data, date) => {
        console.log(data, date)

        const workbook = new ExcelJS.Workbook()

        const users = data.filter(d => d.user?.user_name && d.summary_data).map(d => d.user)

        summarySheet(workbook, users, data)

        data.forEach(d => {
            d.summary_data && userSheet(workbook, d)
        })

        const uint8Array = await workbook.xlsx.writeBuffer()
        const blob = new Blob([uint8Array], {type: 'application/octet-binary'})
        const a = document.createElement('a')
        a.href = window.URL.createObjectURL(blob)
        a.download = `作業日報-${dayjs(date).format("YYYY年M月D日")}.xlsx`
        a.click()
        a.remove()

    }

    const summarySheet = (workbook, users, data) => {
        const sheet = workbook.addWorksheet("作業日報")
        let row = SummaryHeader(sheet, users, data)
        row = SummaryOther(sheet, users, data, row)
        row = SummaryWork(sheet, users, data, row)
        row = SummaryCheck(sheet, users, data, row)
        sheet.getCell(1,1, row, users.length * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).border = {
            top: { style: 'thin', color: { argb: 'FF000000' } },
            left: { style: 'thin', color: { argb: 'FF000000' } },
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
            right: { style: 'thin', color: { argb: 'FF000000' } }
        }

        for (const i in users) {
            sheet.getCell(1, 1, row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET).border = {
                top: { style: 'thin', color: { argb: 'FF000000' } },
                left: { style: 'thin', color: { argb: 'FF000000' } },
                bottom: { style: 'thin', color: { argb: 'FF000000' } },
                right: { style: 'thin', color: { argb: 'FF000000' } }
           }
        }
    }

    const userSheet = (workbook, rootData) => {
        console.log(workbook, rootData)

        if (!rootData.user?.user_name) { return }
        const sheet = workbook.addWorksheet(rootData.user.user_name)
        let row = 0
        const data = rootData.summary_data
        // ヘッダー
        sheet.getCell(++row,1).value = `${rootData.user.user_name}さんの日次報告`
        sheet.getCell(++row,1).value = "天候"
        sheet.getCell(++row,1).value = rootData.user.weather
        sheet.getCell(++row,1).value = "体調"
        sheet.getCell(++row,1).value = rootData.user.health ? "良好": "不調"
        sheet.getCell(++row,1).value = "作業開始"
        sheet.getCell(++row,1).value = data.work_time?.open_time ? dayjs(data.work_time.open_time).format("HH:mm") : null
        sheet.getCell(++row,1).value = "作業終了"
        sheet.getCell(++row,1).value = data.work_time?.close_time ? dayjs(data.work_time.close_time).format("HH:mm") : null
        row++
        // 巡回情報
        sheet.getCell(++row,1).value = "点検事項"
        sheet.getCell(++row, 1).value = "項目"
        sheet.getCell(row,2).value = "内容"
        row++
        data.other_report?.forEach((report, i) => {
            sheet.getCell(row + i, 1).value =  report.item_name
            sheet.getCell(row + i, 2).value = report.text
        })
        row+= (data.other_report?.length ?? 0) + 1
        // 開園業務
        sheet.getCell(++row, 1).value = "園内業務"
        sheet.getCell(++row, 1).value = "項目"
        sheet.getCell(row, 2).value = "内容"
        sheet.getCell(row, 3).value = "巡視員確認"
        sheet.getCell(row, 4).value = "開始時刻"
        sheet.getCell(row, 5).value = "終了時刻"
        row++
        data.work_report?.sort((v1, v2) => {
            return v1.sort - v2.sort
        }).forEach((report, i) => {
            sheet.getCell(row + i, 1).value = report.type_name
            sheet.getCell(row + i, 2).value = report.item_name
            sheet.getCell(row + i, 3).value = report.measured_at ? "◯" : null
            sheet.getCell(row + i, 4).value = report.measured_at ? dayjs(report.measured_at).format("HH:mm") : null
        })
        row += (data.work_report?.length ?? 0) + 1
        sheet.getCell(++row, 1).value = "点検・記録業務"
        sheet.getCell(++row, 1).value = "項目"
        sheet.getCell(row, 2).value = "遊具・施設名"
        sheet.getCell(row, 3).value = "数値"
        sheet.getCell(row, 4).value = "異常有無"
        sheet.getCell(row, 5).value = "状態"
        sheet.getCell(row, 6).value = "処置"
        sheet.getCell(row, 7).value = "現在のステータス"
        sheet.getCell(row, 8).value = "IN・点検時刻"
        sheet.getCell(row, 9).value = "OUT時刻"
        row++
        data.check_report?.forEach((report, i) => {
            sheet.getCell(row + i, 1).value = report.group_key
            sheet.getCell(row + i, 2).value = report.facility_name
            sheet.getCell(row + i, 3).value = report.value
            sheet.getCell(row + i, 4).value = report.incident_id ? "異常あり" : null
            sheet.getCell(row + i, 5).value = report.report_text
            sheet.getCell(row + i, 6).value = report.repair_text
            sheet.getCell(row + i, 7).value = report.latest_status_name
            sheet.getCell(row + i, 8).value = report.checkin_at ? dayjs(report.checkin_at).format("HH:mm") : null
            sheet.getCell(row + i, 9).value = report.checkout_at ? dayjs(report.checkout_at).format("HH:mm"): null
        })
    }

    const unionSheet = (workbook, data) => {

    }

    return {
        exportExcel,
    }

}

export default UseReportExport
