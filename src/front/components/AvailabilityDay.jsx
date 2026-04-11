import React from "react"
import { useState } from "react"

export const AvailabilityDay = (day) => {
    const [availability, setAvailability] = useState({
        isAvailable: false,
        timeAvailable: {
            start: null,
            end: null
        }
    })

    return (
        <div className="form-check">
            <input className="form-check-input" type="checkbox" id="dayCheck" value={availability.isAvailable} onChange={() => setAvailability({ ...availability, isAvailable: !availability.isAvailable })} />
            <label className="form-check-label" for="gridCheck">
                {day.day}
            </label>
            {availability.isAvailable ? <div>
                <label className="pe-1 small">From</label>
                <select className="form-select" aria-label="Select Start Time">
                    <option selected>Select Start Time</option>
                    <option value="1">12:00am</option>
                    <option value="2">1:00am</option>
                    <option value="3">2:00am</option>
                    <option value="4">3:00am</option>
                    <option value="5">4:00am</option>
                    <option value="6">5:00am</option>
                    <option value="7">6:00am</option>
                    <option value="8">7:00am</option>
                    <option value="9">8:00am</option>
                    <option value="10">9:00am</option>
                    <option value="11">10:00am</option>
                    <option value="12">11:00am</option>
                    <option value="13">12:00pm</option>
                    <option value="14">1:00pm</option>
                    <option value="15">2:00pm</option>
                    <option value="16">3:00pm</option>
                    <option value="17">4:00pm</option>
                    <option value="18">5:00pm</option>
                    <option value="19">6:00pm</option>
                    <option value="20">7:00pm</option>
                    <option value="21">8:00pm</option>
                    <option value="22">9:00pm</option>
                    <option value="23">10:00pm</option>
                    <option value="24">11:00pm</option>
                    <option value="25">11:59pm</option>
                </select>
                {/* <input type="text" value={availability.timeAvailable.start} onChange={(e) => setAvailability({ ...availability, day: { ...availability, timeAvailable: { ...availability.timeAvailable, start: e.target.value } } })} /> */}
                <label className="pe-1 ps-1 small">To</label>
                <select className="form-select" aria-label="Select End Time">
                    <option selected>Select End Time</option>
                    <option value="1">12:00am</option>
                    <option value="2">1:00am</option>
                    <option value="3">2:00am</option>
                    <option value="4">3:00am</option>
                    <option value="5">4:00am</option>
                    <option value="6">5:00am</option>
                    <option value="7">6:00am</option>
                    <option value="8">7:00am</option>
                    <option value="9">8:00am</option>
                    <option value="10">9:00am</option>
                    <option value="11">10:00am</option>
                    <option value="12">11:00am</option>
                    <option value="13">12:00pm</option>
                    <option value="14">1:00pm</option>
                    <option value="15">2:00pm</option>
                    <option value="16">3:00pm</option>
                    <option value="17">4:00pm</option>
                    <option value="18">5:00pm</option>
                    <option value="19">6:00pm</option>
                    <option value="20">7:00pm</option>
                    <option value="21">8:00pm</option>
                    <option value="22">9:00pm</option>
                    <option value="23">10:00pm</option>
                    <option value="24">11:00pm</option>
                    <option value="25">11:59pm</option>
                </select>
                {/* <input type="text" value={availability.timeAvailable.end} onChange={(e) => setAvailability({ ...availability, day: { ...availability, timeAvailable: { ...availability.timeAvailable, end: e.target.value } } })} /> */}
            </div> : null}
        </div>
    )
}