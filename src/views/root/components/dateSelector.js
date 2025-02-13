import React, {useCallback, useEffect} from "react"
import PropTypes from "prop-types"
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import _ from "lodash";
import dayjs from "dayjs";
import {TextField} from "@mui/material";

const DateSelectorComponent = ({defaultDate, selectedDate, activeDates, onSelectDate}) => {

    const onChange = (d) => {
        onSelectDate(d.format("YYYY-MM-DD"))
    }

    useEffect(() => {
        if (selectedDate || !activeDates) { return }

        let d = [...activeDates].sort((v1, v2) => v1.diff(v2)).pop()
        onSelectDate(dayjs(d).format("YYYY-MM-DD"))

    }, [activeDates, selectedDate])

    const shouldDisableDate = useCallback(d =>
        _.isNil(activeDates) ? false : !activeDates.some(date => dayjs(date).isSame(d, 'day'))
        , [activeDates])

    const shouldDisableMonth = useCallback(d =>
        _.isNil(activeDates) ? false : !activeDates.some(date => dayjs(date).isSame(d, "month"))
        , [activeDates])

    const shouldDisableYear = useCallback(d =>
        _.isNil(activeDates) ? false: !activeDates.some(date => dayjs(date).isSame(d, "year"))
        , [activeDates])

    useEffect(() => {
        console.log("[ActiveDates]", activeDates)
    }, [activeDates])

    return activeDates ? (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ja">
            <DatePicker
                label="日付"
                onChange={onChange}
                value={dayjs(selectedDate)}
                format="YYYY/MM/DD"
                // shouldDisableDate={shouldDisableDate}
                // shouldDisableMonth={shouldDisableMonth}
                // shouldDisableYear={shouldDisableYear}
                sx={{
                    "& .MuiInputBase-formControl": {
                        height: '38px',
                        width: '160px',
                    }
                }}
            />
        </LocalizationProvider>
    ) : null
}

DateSelectorComponent.propTypes = {
    defaultDate: PropTypes.string,
    selectedDate: PropTypes.string,
    activeDates: PropTypes.array,
    onSelectDate: PropTypes.func.isRequired,
}

export default DateSelectorComponent
