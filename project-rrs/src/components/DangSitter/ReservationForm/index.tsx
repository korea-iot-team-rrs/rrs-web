import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import DangSitterBox from "../DangSitterBox";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { Notice } from "../../../constants/Notice";
import "../../../styles/ReservationForm.css";
import dayjs, { Dayjs } from "dayjs";
import { DangSitter, Pet, User } from "../../../types/reservationType";
import { useCookies } from "react-cookie";
import { fetchprovidersByDate } from "../../../apis/reservationApi";
import { FaSearch } from "react-icons/fa";
import { FaRegSadTear } from "react-icons/fa";
import { Pets } from "@mui/icons-material";

export default function ReservationForm() {
  const today = dayjs();
  const tomorrow = today.add(1, "day");
  const oneMonthLater = today.add(1, "month");
  const oneMonthAndOneDayLater = today.add(1, "month").add(1, "day");
  const [cookies] = useCookies(["token"]);

  const [startDate, setStartDate] = useState<Dayjs>(today);
  const [endDate, setEndDate] = useState<Dayjs>(tomorrow);
  const [endMinDate, setEndMinDate] = useState<Dayjs>(startDate.add(1, "day"));
  const [noticeChecked, setNoticeChecked] = useState<boolean>(false);
  const [findPetSitter, setFindPetSitter] = useState<DangSitter[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [selectDangSitterId, setSelectDangSitterId] = useState<number>(0);
  const [pets, setPets] = useState<Pet[]>([]);
  const [user, setUSer] = useState<User>({
    username: "",
    nickname: "",
    phone: "",
    address: ""
  });

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
    if (token) {
      try {
        const findDangSitter = await fetchprovidersByDate(data, token);
        setFindPetSitter(findDangSitter);
        console.log(findDangSitter);
        setIsSearched(true);
      } catch (e) {
        console.error("Failed to fetch providers", e);
      }
    }
  };

  const setSelectDangSitterBtnHandler = (providerId: number) => {
    if (selectDangSitterId === providerId) {
      setSelectDangSitterId(0);
    } else {
      setSelectDangSitterId(providerId);
    }
    console.log("Selected Provider ID:", providerId);
  };
  useEffect(() => {
    const newEndMinDate = startDate.add(1, "day");
    setEndMinDate(newEndMinDate);
    if (endDate.isBefore(newEndMinDate)) {
      setEndDate(newEndMinDate);
    }

    const dayDifference = endDate.diff(startDate, "day");
    if (dayDifference > 7) {
      alert("날짜 선택은 최대 7일까지만 가능합니다.");
      setEndDate(startDate.add(7, "day"));
    }
  }, [startDate, endDate]);

  return (
    <>
      <div className="reservationFormContainer">
        <div className="notice">
          <div className="notice-title">
            <span>주의사항</span>
          </div>
          <div>
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
        </div>
        <div className="reservation-date-picker">
          <div className="date-title">
            <span>날짜 선택</span>
            <span>
              원하시는 날짜를 선택해 주세요. 최대 7일 선택이 가능합니다.
            </span>
          </div>

          <div className="reservation-date-picker-main">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="이용 시작일"
                minDate={today}
                maxDate={oneMonthLater}
                value={startDate}
                onChange={(newStartDate) => {
                  if (newStartDate) setStartDate(newStartDate);
                }}
              />
              <DatePicker
                label="이용 종료일"
                minDate={endMinDate}
                maxDate={oneMonthAndOneDayLater}
                value={endDate}
                onChange={(newEndDate) => {
                  if (newEndDate) setEndDate(newEndDate);
                }}
              />
            </LocalizationProvider>
            <Button
              onClick={findMyPetSitterBtnHandler}
              className="find-my-dang-sitter-btn"
              sx={{
                borderRadius: "18px",
              }}
            >
              <FaSearch />
              댕시터 찾기
            </Button>
          </div>
        </div>
        <div className="founded-dang-sitter">
          <div className="founded-dang-sitter-title">
            <span>댕시터 목록</span>
          </div>

          {isSearched &&
            (findPetSitter.length > 0 ? (
              findPetSitter.map((petSitter) => {
                const isSelected = selectDangSitterId === petSitter.providerId;
                return (
                  <button
                    key={petSitter.providerId}
                    onClick={() =>
                      setSelectDangSitterBtnHandler(petSitter.providerId)
                    }
                    className={`dangSitter-box-btn ${
                      isSelected ? "selected" : ""
                    }`}
                  >
                    <DangSitterBox providerId={petSitter.providerId} />
                  </button>
                );
              })
            ) : (
              <div className="cant-not-find-sitter">
                <p>
                  이용할 수 있는 댕시터가 없습니다. 다른 날짜를 선택해주세요.
                </p>
              </div>
            ))}
        </div>
        <div className="reservation-userInfo">
          <div className="reservation-userInfo-title">
            <span>사용자 정보</span>
          </div>
          <div></div>
          <div></div>
        </div>

        <div className="reservation-contnert">
          <div className="reservation-userInfo-title">
            <span>사용자 정보</span>
          </div>
          <div className="reservation-userInfo-body">
            <div>
              <div className="info-about-my-dog">
                <span>내 강아지</span>
                <span>
                  사용자의 정보가 알맞은지 확인해주세요! 올바르지 않다면
                  마이페이지에서 수정 할 수 있습니다.
                </span>

                {pets.length > 0 ? (
                  pets.map((pet) => {
                    return (
                      <div className="pet-info">
                        <img src={pet.petImageUrl} alt="" />
                        <p>{pet.petName}</p>
                      </div>
                    );
                  })
                ) : (
                  <div className="cant-not-find-dog">
                    <p>이용가능한 강아지가 없습니다. 강아지를 등록해 주세요.</p>
                  </div>
                )}
              </div>
              <div className="info-about-me">
                  <span>주소 및 핸드폰 번호</span>
                  <span>핸드폰 번호</span>
                  <span>{user.phone}</span>
                  <span>펫시터에게는 안심번호가 제공됩니다.</span>
                  <span>{user.address}</span>
                  <span>상세주소는 예약 수락 후 공유 됩니다.</span>
              </div>
            </div>
          </div>
          <div className="reservation-userInfo-reservationMemo">
            <input type="text" placeholder={`${user.nickname}님 댕시터에게 전달하고 싶은 내용용을 적어주세요!`} />
          </div>
        </div>
      </div>
    </>
  );
}
