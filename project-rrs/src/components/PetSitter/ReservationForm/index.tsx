import * as React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DangSitter from "../DangSitter";
import { Box, Checkbox, FormControlLabel } from "@mui/material";
import { Notice } from "../../../constants/Notice";
import "../../../styles/ReservationForm.css";
import dayjs, { Dayjs } from "dayjs";

export default function ReservationForm() {
  const today = dayjs();
  const tomorrow = today.add(1, "day");
  const oneMonthLater = today.add(1, "month");
  const oneMonthAndOneDayLater = today.add(1, "month").add(1, "day");

  const [startDate, setStartDate] = React.useState<Dayjs | null>(today);
  const [endDate, setEndDate] = React.useState<Dayjs | null>(tomorrow);
  const [noticeChecked, setNoticeChecked] = React.useState<boolean>(false);

  const noticeCheckboxChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNoticeChecked((prev) => !prev);
  };

  return (
    <>
      <div className="reservatoionFormContainer">
        <div className="notice">
          <Box
            className="notice-box"
            sx={{
              backgroundColor: "#f5f5f5",
              border: "3px solid #f1f1f1",
              borderRadius: "15px",
              padding: "20px",
              maxWidth: "1000px",
            }}
          >
            <span>주의사항</span>
            <Notice />
            <FormControlLabel
              className="notice-checkbox"
              value="bottom"
              checked={noticeChecked}
              control={<Checkbox onChange={noticeCheckboxChangeHandler} />}
              label="약관에 동의합니다."
              labelPlacement="start"
            />
          </Box>
        </div>
        <div className="reservation-date-picker">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="이용 시작일"
              slotProps={{
                textField: {
                  helperText: "예: 01/01/2025 (월/일/년)",
                },
              }}
              minDate={today}
              maxDate={oneMonthLater}
              value={startDate}
              onChange={(startDate) => setStartDate(startDate)}
            />
            <DatePicker
              label="이용 종료일"
              minDate={tomorrow}
              maxDate={oneMonthAndOneDayLater}
              value={endDate}
              onChange={(newEndDate) => setEndDate(startDate)}
            />
          </LocalizationProvider>
        </div>

        <DangSitter providerId={2} />
      </div>
    </>
  );
}
