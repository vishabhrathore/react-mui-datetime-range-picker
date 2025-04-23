import React, { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { RangePicker } from "../component";

import "../component/react-minimal-datetime-range.css";
import { Box } from "@mui/material";
const now = new Date();

if (!String.prototype.padStart) {
  String.prototype.padStart = function padStart(targetLength, padString) {
    targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
    padString = String(typeof padString !== "undefined" ? padString : " ");
    if (this.length >= targetLength) {
      return String(this);
    } else {
      targetLength = targetLength - this.length;
      if (targetLength > padString.length) {
        padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
      }
      return padString.slice(0, targetLength) + String(this);
    }
  };
}

export default function MyDatePicker() {
  const [hour, setHour] = useState("01");
  const [minute, setMinute] = useState("01");
  const [month, setMonth] = useState(
    String(now.getMonth() + 1).padStart(2, "0"),
  );
  const [date, setDate] = useState(String(now.getDate()).padStart(2, "0"));
  const [year, setYear] = useState(String(now.getFullYear()));
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <RangePicker
          locale={`en-us`} // default is en-us
          show={false} // default is false
          disabled={false} // default is false
          allowPageClickToClose={true} // default is true
          placeholder={["Start Time", "End Time"]}
          defaultDates={[
            year + "-" + month + "-" + date,
            year + "-" + month + "-" + date,
          ]} // ['YYYY-MM-DD', 'YYYY-MM-DD']
          defaultTimes={[hour + ":" + minute, hour + ":" + minute]} // ['hh:mm', 'hh:mm']
          initialDates={[
            year + "-" + month + "-" + date,
            year + "-" + month + "-" + date,
          ]} // ['YYYY-MM-DD', 'YYYY-MM-DD']
          initialTimes={[hour + ":" + minute, hour + ":" + minute]} // ['hh:mm', 'hh:mm']
          onConfirm={(res) => console.log(res, 1)}
          onClose={() => console.log("closed")}
          style={{ width: "300px", margin: "0 auto" }}
          // markedDates={[`${todayY}-${todayM}-${todayD - 1}`, `${todayY}-${todayM}-${todayD}`]} // OPTIONAL. ['YYYY-MM-DD']
          // supportDateRange={[`2022-02-16`, `2022-12-10`]} // "YYYY-MM-DD"
          // showOnlyTime={true} // default is false
          // duration={2} // day count default is 0. End date will be automatically added 2 days when the start date is picked.
        />
      </Box>
    </LocalizationProvider>
  );
}
