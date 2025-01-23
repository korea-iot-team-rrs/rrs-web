import React, { useEffect, useState } from "react";
import { AntSwitch } from "../../../styles/dangsitter/dangsitterCommon";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../../styles/dangsitter/provider.css";

const ProviderUpdate = () => {
  const [isActive, setIsActive] = useState(false);
  const [role, setRole] = useState<boolean>(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [providerIntroduction, setProviderIntroduction] = useState<string>("");

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
        const response = await axios.get(`http://localhost:4040/api/v1/providers/role/me`, {
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
        `http://localhost:4040/api/v1/providers/role/me`,
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

    const fetchProviderInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/api/v1/providers/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response:", response.data.data);

        const providerIntro = response.data.data.providerIntroduction || "";
        setProviderIntroduction(providerIntro);
        const availableDates = response.data.data.availableDate
          ? response.data.data.availableDate.map(
              (dateObj: any) => new Date(dateObj.availableDate)
            )
          : [];
        setSelectedDates(availableDates);
      } catch (error) {
        console.log("근무 일정 가져오는 중 오류 발생", error);
      }
    };

    fetchProviderInfo();
  }, [cookies.token, navigate]);

  const handleCalendarChange = (date: Date) => {
    const today = new Date();

    if (date < today) {
      alert("과거 날짜는 선택할 수 없습니다.");
      return;
    }

    const isDateSelected = selectedDates.some(
      (selectedDate) => selectedDate.toDateString() === date.toDateString()
    );

    if (isDateSelected) {
      setSelectedDates((prevDates) =>
        prevDates.filter(
          (selectedDate) => selectedDate.toDateString() !== date.toDateString()
        )
      );
    } else {
      setSelectedDates((prevDates) => [...prevDates, date]);
    }
  };

  const handleSubmit = async () => {
    const token = cookies.token || localStorage.getItem("token");

    // 유효성 검사
    if (selectedDates.length === 0) {
      alert("하나의 이상의 근무일을 선택해주세요.");
      return;
    }

    if (!providerIntroduction || providerIntroduction.trim() === "") {
      alert("소개를 작성해주세요.");
      return;
    }

    const data = {
      availableDate: selectedDates.map((date) =>
        date.toLocaleDateString("en-CA")
      ),
      providerIntroduction: providerIntroduction,
    };

    console.log("전송되는 데이터:", data);

    try {
      const response = await axios.put(
        `http://localhost:4040/api/v1/provider/providers/me`,
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
              onClickDay={handleCalendarChange}
              tileClassName={({ date }) =>
                selectedDates.some(
                  (selectedDate) =>
                    selectedDate.toDateString() === date.toDateString()
                )
                  ? "selected-date"
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

export default ProviderUpdate;