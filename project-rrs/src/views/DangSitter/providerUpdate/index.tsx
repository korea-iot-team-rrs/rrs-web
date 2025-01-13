import React, { useEffect, useState } from "react";
import { AntSwitch } from "../../../styles/dangSitter/DangSitterCommon";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import useAuthStore from "../../../stores/useAuthStore";
import '../../../styles/dangSitter/Provider.css'

const ProviderUdpate = () => {
  const [isActive, setIsActive] = useState(false);
  const [role, setRole] = useState<boolean>(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [providerIntroduction, setProviderIntroduction] = useState<string>("");
  const { user } = useAuthStore();
  const userId = user?.userId;

  // Role 조회
  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchRole = async () => {
      try {
        const response = await axios.get(`http://localhost:4040/api/v1/role`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        const isProviderActive = response.data.data.isActive;
        setRole(isProviderActive);
        setIsActive(isProviderActive);
      } catch (error) {
        console.log("role 가져오는 중 오류 발생", error);
      }
    };

    fetchRole();
  }, [cookies.token, navigate]);

  // Role 수정
  const handleRoleToggle = async () => {
    const token = cookies.token || localStorage.getItem("token");

    try {
      const newIsActive = !isActive;
      const roleData = { isActive: newIsActive };

      const response = await axios.put(
        `http://localhost:4040/api/v1/role`,
        roleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setIsActive(newIsActive);
    } catch (error) {
      console.error("role 업데이트 중 오류 발생:", error);
    }
  };

  const goBack = () => {
    window.history.back();
  };

  // Provider 정보 조회 (근무 일정, 소개)
  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchProviderDate = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/api/v1/provider/profile`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const availableDates = response.data.availableDate
        ? response.data.availableDate.map((dateStr: string) => new Date(dateStr))
        : [];
        setSelectedDates(availableDates);
      } catch (error) {
        console.log("근무 일정 가져오는 중 오류 발생", error);
      }
    };

    fetchProviderDate();
  }, [cookies.token, navigate]);

  const handleCalendarChange = (date: Date) => {
    const isDateSelected = selectedDates.some(
      (selectedDate) =>
        selectedDate.toDateString() === date.toDateString()
    );

    if (isDateSelected) {
      // 선택된 날짜가 있으면 제거
      setSelectedDates((prevDates) =>
        prevDates.filter(
          (selectedDate) =>
            selectedDate.toDateString() !== date.toDateString()
        )
      );
    } else {
      // 선택되지 않은 날짜면 추가
      setSelectedDates((prevDates) => [...prevDates, date]);
    }
  };

  const handleSubmit = async () => {
    const token = cookies.token || localStorage.getItem("token");

    console.log("선택된 날짜들:", selectedDates);

    if (selectedDates.length === 0) {
      alert("하나의 이상의 근무일을 선택해주세요.");
      return;
    } 

    const data = {
      availableDates: selectedDates.map((date) => date.toISOString().split("T")[0]),
    };

    console.log("전송되는 날짜들:", data.availableDates);

    try {
      const response = await axios.put(
        `http://localhost:4040/api/v1/provider/profile/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        alert("댕시터 정보가 수정되었습니다.");
        goBack();
      }
    } catch (error) {
      console.error("댕시터 정보 수정 중 오류 발생: ", error);
      alert("댕시터 정보 수정 실패");
    }
  };

  return (
    <div>
      <div>
        <p>현재 역할: {isActive ? "ROLE_USER, ROLE_PROVIDER" : "ROLE_USER"}</p>
        <AntSwitch checked={isActive} onChange={handleRoleToggle} />
      </div>

      {isActive ? (
        <form action="">
          <div>
            <label>근무 일정</label>
            <Calendar
              onClickDay={handleCalendarChange} // 날짜 클릭 시 실행되는 핸들러
              tileClassName={({ date }) =>
                selectedDates.some(
                  (selectedDate) =>
                    selectedDate.toDateString() === date.toDateString()
                )
                  ? "selected" // 이미 선택된 날짜에는 스타일 추가
                  : ""
              }
            />
          </div>

          <div>
            <label>소개</label>
            <input
              type="text"
              value={providerIntroduction}
              onChange={(e) => setProviderIntroduction(e.target.value)}
            />
          </div>

          <button type="button" onClick={goBack}>
            취소
          </button>
          <button type="button" onClick={handleSubmit}>
            저장
          </button>
        </form>
      ) : (
        <div>
          <div>
            <label>근무 일정</label>
            <p>댕시터를 활성화 해주세요</p>
          </div>

          <div>
            <label>소개</label>
            <p>댕시터를 활성화 해주세요</p>
          </div>

          <button type="button" onClick={goBack}>
            취소
          </button>
        </div>
      )}
    </div>
  );
};

export default ProviderUdpate;
