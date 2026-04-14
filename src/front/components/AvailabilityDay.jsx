import React from "react"
import { isValidElement } from "react"
import { useState } from "react"

const available_time_options = [
    { value: "", label: "Select a Time" },
    {value: "0", label: "12:00am"},
    {value: "1", label: "1:00am"},
    {value: "2", label: "2:00am"},
    {value: "3", label: "3:00am"},
    {value: "4", label: "4:00am"},
    {value: "5", label: "5:00am"},
    {value: "6", label: "6:00am"},
    {value: "7", label: "7:00am"},
    {value: "8", label: "8:00am"},
    {value: "9", label: "9:00am"},
    {value: "10", label: "10:00am"},
    {value: "11", label: "11:00am"},
    {value: "12", label: "12:00pm"},
    {value: "13", label: "1:00pm"},
    {value: "14", label: "2:00pm"},
    {value: "15", label: "3:00pm"},
    {value: "16", label: "4:00pm"},
    {value: "17", label: "5:00pm"},
    {value: "18", label: "6:00pm"},
    {value: "19", label: "7:00pm"},
    {value: "20", label: "8:00pm"},
    {value: "21", label: "9:00pm"},
    {value: "22", label: "10:00pm"},
    {value: "23", label: "11:00pm"},
    {value: "24", label: "11:59pm"},
]

export const AvailabilityDay = ({day, isAvailable, start, end, onChange}) => {

    const handleDayCheckbox = () => {
        onChange(day, { isAvailable: !isAvailable, start: start || "", end: end || "" })
    }

    const handleStartTime = (e) => {
        onChange(day, { isAvailable, start: e.target.value, end })
    }

    const handleEndTime = (e) => {
        onChange(day, { isAvailable, start, end: e.target.value })
    }
    
    return (
        <div className="form-check">
            <input 
                className="form-check-input"
                type="checkbox"
                id={`check-${day}`}
                checked={isAvailable}
                onChange={handleDayCheckbox}
                />
            <label className="form-check-label" htmlFor={`check-${day}`}>
                {day}
            </label>
            {isAvailable && (
                <div>
                    <label className="pe-1 small">From</label>
                    <select className="form-select" value={start || ""} onChange={handleStartTime}>
                        {available_time_options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                    <label className="pe-1 ps-1 small">To</label>
                    <select className="form-select" value={end || ""} onChange={handleEndTime}>
                        {available_time_options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    )
}