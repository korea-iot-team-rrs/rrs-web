import React, { useEffect, useState } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Box, Button, Checkbox, FormControlLabel } from "@mui/material";
import { Notice } from "../../../constants/notice";
import dayjs, { Dayjs } from "dayjs";
import { DangSitter, Pet, User } from "../../../types/reservationType";
import { useCookies } from "react-cookie";
import {
  createReservation,
  fetchprovidersByDate,
} from "../../../apis/reservationApi";
import { FaSearch } from "react-icons/fa";
import { fetchUserInfo } from "../../../apis/userInfoApi";
import { fetchPets } from "../../../apis/petApi";
import { useNavigate } from "react-router-dom";
import "../../../styles/reservation/reservationForm.css";
import ReservationUserInfo from "../../../components/dangsitter/reservation-user-info";
import DangSitterBox from "../../../components/dangsitter/dangsitter-box";

export default function ReservationForm() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();

  const today = dayjs();
  const tomorrow = today.add(1, "day");
  const oneMonthLater = today.add(1, "month");
  const oneMonthAndOneDayLater = today.add(1, "month").add(1, "day");

  const [startDate, setStartDate] = useState<Dayjs>(today);
  const [endDate, setEndDate] = useState<Dayjs>(tomorrow);
  const [endMinDate, setEndMinDate] = useState<Dayjs>(startDate.add(1, "day"));

  const [noticeChecked, setNoticeChecked] = useState<boolean>(false);
  const [findPetSitter, setFindPetSitter] = useState<DangSitter[]>([]);
  const [isSearched, setIsSearched] = useState(false);
  const [selectDangSitterId, setSelectDangSitterId] = useState<number>(0);
  const [reservationMemo, setReservationMemo] = useState<string>("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [user, setUser] = useState<User>({
    username: "",
    nickname: "",
    phone: "",
    address: "",
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

  const memoInputChangeHandler = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setReservationMemo(e.target.value);
  };

  const reservationSubmitBtnHandler = () => {
    const token = cookies.token;
    if (!noticeChecked) {
      alert("약관에 동의해주세요.");
      return;
    }
    if (selectDangSitterId === 0) {
      alert("댕시터를 선택해주세요.");
      return;
    }
    const data = {
      reservationStartDate: startDate.format("YYYY-MM-DD"),
      reservationEndDate: endDate.format("YYYY-MM-DD"),
      providerId: selectDangSitterId,
      reservationMemo: reservationMemo || null,
    };

    if (token) {
      createReservation(data, token)
        .then((response) => {
          console.log("API Response:", response);
          alert("요청에 성공하였습니다.");
          navigate(`/users/dang-sitter/reservations`);
        })
        .catch((e) => {
          console.error("요청에 실패하였습니다.", e);
          alert("요청 처리 중 문제가 발생했습니다. 다시 시도해 주세요.");
        });
    }
  };

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const user = await fetchUserInfo();

        if (user) {
          setUser(user);
        }
      } catch (error) {
        console.error("Failed to fetch user info:", error);
      }
    };

    getUserInfo();
  }, []);

  useEffect(() => {
    const token = cookies.token;
    if (token) {
      fetchPets(token)
        .then((pets) => setPets(pets))
        .catch(() => setPets([]));
    }
  }, [cookies.token]);

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
                    style={{
                      marginTop: "10px",
                    }}
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
        <ReservationUserInfo pets={pets} user={user} />
        <div className="reservation-userInfo-reservation-memo">
          <div className="reservation-memo-title">
            <span>댕시터에게 전하고 싶은 말</span>
          </div>

          <textarea
            id="reservation-memo"
            className="memo"
            placeholder="댕시터에게 전달하고 싶은 내용을 적어주세요!"
            value={reservationMemo}
            onChange={(e) => memoInputChangeHandler(e)}
            rows={4}
            cols={50}
          />
          <Button
            className="reservation-submit-btn"
            onClick={reservationSubmitBtnHandler}
          >
            댕시터 요청하기
          </Button>
        </div>
      </div>
    </>
  );
}
