import React, { useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DangSitter from "../DangSitterBox";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { Notice } from "../../../constants/Notice";
import "../../../styles/ReservationForm.css";
import dayjs, { Dayjs } from "dayjs";
import { PetSitter } from "../../../types/reservationType";
import { useCookies } from "react-cookie";
import { fetchprovidersByDate } from "../../../apis/reservationApi";
import { useDateStore } from "../../../stores/daytransfer";

export default function ReservationForm() {
  const today = dayjs();
  const tomorrow = today.add(1, "day");
  const oneMonthLater = today.add(1, "month");
  const oneMonthAndOneDayLater = today.add(1, "month").add(1, "day");
  const [cookies] = useCookies(["token"]);

  const [startDate, setStartDate] = useState<Dayjs>(today);
  const [endDate, setEndDate] = useState<Dayjs>(tomorrow);
  const [noticeChecked, setNoticeChecked] = useState<boolean>(false);
  const [findPetSitter, setFindPetSitter] = useState<PetSitter[]>([]);

  const noticeCheckboxChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNoticeChecked((prev) => !prev);
  };

  const findMyPetSitterBtnHandler = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    const token = cookies.token;
    const data = {
      startDate: startDate.format("YYYY-MM-DD"),
      endDate: endDate.format("YYYY-MM-DD"),
    };
    console.log(data);
    if (token) {
      try {
        const findDangSitter = await fetchprovidersByDate(data, token);
        setFindPetSitter(findDangSitter);
      } catch (e) {
        console.error("Failed to fetch providers", e);
      }
    }
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
              onChange={(newStartDate) =>
                newStartDate && setStartDate(newStartDate)
              }
            />
            <DatePicker
              label="이용 종료일"
              minDate={tomorrow}
              maxDate={oneMonthAndOneDayLater}
              value={endDate}
              onChange={(newEndDate) => newEndDate && setEndDate(newEndDate)}
            />
          </LocalizationProvider>
          <Button
            className="find-my-dang-sitter"
            onClick={findMyPetSitterBtnHandler}
          >
            댕시터 찾기
          </Button>
        </div>
        <div>
          {findPetSitter.map((petSitter) => (
            <DangSitter
              key={petSitter.providerId}
              providerId={petSitter.providerId}
            />
          ))}
        </div>
      </div>
    </>
  );
}
