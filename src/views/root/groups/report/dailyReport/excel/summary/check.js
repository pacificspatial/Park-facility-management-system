import {AddRowValues, GetSummaryData} from "./util";
import {SUMMARY_ROW_OFFSET, SUMMARY_USER_OFFSET} from "../../export";
import dayjs from "dayjs";

const GROUP_KEYS = [
    "屋外遊具",
    "遊びの里",
    "水遊具",
    "施設",
    "地点報告",
    "水道メーター(午前)",
    "水道メーター(午後)",
    "水質(午前)",
    "水質(午後)",
    "水温(午前)",
    "水温(午後)",
]

const GetCheckItems = (data, users, type) => {
    const values = []

    for(const user of users) {
        const d = GetSummaryData(data, user, "check_report").filter(v => v.type === type && v.group_key !== "地点報告")
        if (!d) { continue }
        for(const item of d) {
            if(values.find(p => p.group_key === item.group_key && p.facility_code === item.facility_code)) {
                continue
            }
            values.push({
                type: item.type,
                facility_code: item.facility_code,
                facility_name: item.facility_name,
                group_key: item.group_key
            })
        }
    }

    return values.sort((v1, v2) => {
        if(GROUP_KEYS.findIndex(v => v === v1.group_key) > GROUP_KEYS.findIndex(v => v === v2.group)) return -1
        if(GROUP_KEYS.findIndex(v => v === v1.group_key) < GROUP_KEYS.findIndex(v => v === v2.group)) return 1
        return v1.facility_code.localeCompare(v2.facility_code)
    })

}

const DailyReportExportExcelSummaryCheck = (sheet, users, data, row = 1) => {

    sheet.getCell(++row, 1).value = "点検・記録業務"

    const playGroundItems = GetCheckItems(data, users, "playground")
    const facilityItems = GetCheckItems(data, users, "facility")
    const waterMeterItems = GetCheckItems(data, users, "water_meter")
    const waterQualityItems = GetCheckItems(data, users, "water_quality")
    const waterTempItems = GetCheckItems(data, users, "water_temp")

    sheet.getCell(++row, 1).value = "遊具"
    sheet.getCell(++row, 1).value = "項目"
    sheet.getCell(row, 2).value = "遊具・施設名"
    sheet.getCell(row, 3).value = "時刻"
    sheet.getCell(row, 4).value = "異常"
    sheet.getCell(row, 5).value = "処置"
    for(const item of playGroundItems) {
        sheet.getCell(++row, 1).value = item.group_key
        sheet.getCell(row, 2).value = item.facility_name
        for(const [i, user] of users.entries()) {
            const d = data.find(({user:u}) => u.user_id === user.user_id)?.summary_data?.check_report
                ?.find(v => v.type === "playground" && v.group_key === item.group_key && v.facility_code === item.facility_code)
            if (!d) { continue }
            const tm = d.checkin_at ?? d.incident_measured_at
            AddRowValues(sheet, row, [
                tm ? dayjs(tm).format("HH:mm") : null,
                d.report_text ? "◯" : null,
                d.repair_text ? "◯" : null,
            ], i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET)
        }
    }

    sheet.getCell(++row, 1).value = "施設"
    sheet.getCell(++row, 1).value = "項目"
    sheet.getCell(row, 2).value = "遊具・施設名"
    sheet.getCell(row, 3).value = "時刻"
    sheet.getCell(row, 4).value = "異常"
    sheet.getCell(row, 5).value = "処置"
    for(const [i, user] of users.entries()) {
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET + 0).value = "時刻"
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET + 1).value = "異常"
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET + 2).value = "処置"
    }
    for(const item of facilityItems) {
        sheet.getCell(++row, 1).value = item.group_key
        sheet.getCell(row, 2).value = item.facility_name
        for(const [i, user] of users.entries()) {
            const d = data.find(({user:u}) => u.user_id === user.user_id)?.summary_data?.check_report
                ?.find(v => v.type === "facility" && v.group_key === item.group_key && v.facility_code === item.facility_code)
            if (!d) { continue }
            const tm = d.checkin_at ?? d.incident_measured_at
            AddRowValues(sheet, row, [
                tm ? dayjs(tm).format("HH:mm") : null,
                d.report_text ? "◯" : null,
                d.repair_text ? "◯" : null,
            ], i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET)
        }
    }

    sheet.getCell(++row, 1).value = "水道メーター"
    sheet.getCell(++row, 1).value = "項目"
    sheet.getCell(row, 2).value = "施設名"
    for(const [i, user] of users.entries()) {
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET + 0).value = "時刻"
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET + 1).value = "数値"
    }
    for(const item of waterMeterItems) {
        sheet.getCell(++row, 1).value = item.group_key
        sheet.getCell(row, 2).value = item.facility_name
        for(const [i, user] of users.entries()) {
            const d = data.find(({user:u}) => u.user_id === user.user_id)?.summary_data?.check_report
                ?.find(v => v.type === "water_meter" && v.group_key === item.group_key && v.facility_code === item.facility_code)
            if (!d) { continue }
            const tm = d.checkin_at ?? d.incident_measured_at
            AddRowValues(sheet, row, [
                tm ? dayjs(tm).format("HH:mm") : null,
                d.value
            ], i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET)
        }
    }

    sheet.getCell(++row, 1).value = "水質"
    sheet.getCell(++row, 1).value = "項目"
    sheet.getCell(row, 2).value = "施設名"
    for(const [i, user] of users.entries()) {
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET + 0).value = "時刻"
        sheet.getCell(row, i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET + 1).value = "数値"
    }
    for(const item of waterQualityItems) {
        sheet.getCell(++row, 1).value = item.group_key
        sheet.getCell(row, 2).value = item.facility_name
        for(const [i, user] of users.entries()) {
            const d = data.find(({user:u}) => u.user_id === user.user_id)?.summary_data?.check_report
                ?.find(v => v.type === "water_quality" && v.group_key === item.group_key && v.facility_code === item.facility_code)
            if (!d) { continue }
            const tm = d.checkin_at ?? d.incident_measured_at
            AddRowValues(sheet, row, [
                tm ? dayjs(tm).format("HH:mm") : null,
                d.value
            ], i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET)
        }
    }

    sheet.getCell(++row, 1).value = "水温"
    sheet.getCell(++row, 1).value = "項目"
    sheet.getCell(row, 2).value = "施設名"
    sheet.getCell(row, 3).value = "時刻"
    sheet.getCell(row, 4).value = "数値"
    for(const item of waterQualityItems) {
        sheet.getCell(++row, 1).value = item.group_key
        sheet.getCell(row, 2).value = item.facility_name
        for(const [i, user] of users.entries()) {
            const d = data.find(({user:u}) => u.user_id === user.user_id)?.summary_data?.check_report
                ?.find(v => v.type === "water_temp" && v.group_key === item.group_key && v.facility_code === item.facility_code)
            if (!d) { continue }
            const tm = d.checkin_at ?? d.incident_measured_at
            AddRowValues(sheet, row, [
                tm ? dayjs(tm).format("HH:mm") : null,
                d.value
            ], i * SUMMARY_USER_OFFSET + SUMMARY_ROW_OFFSET)
        }
    }

    return row + 1
}

export default DailyReportExportExcelSummaryCheck
