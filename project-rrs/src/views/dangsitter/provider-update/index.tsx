import React, { useEffect, useState } from "react";
import { AntSwitch } from "../../../styles/dangsitter/dangsitterCommon";
import { data, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "../../../styles/dangsitter/providerCalendar.module.css";
import "../../../styles/dangsitter/provider.css";

const ProviderUpdate = () => {
  const [isActive, setIsActive] = useState(false);
  const [role, setRole] = useState<boolean>(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [providerIntroduction, setProviderIntroduction] = useState<string>("");

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
      return;
    }

    const fetchRole = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4040/api/v1/providers/role/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const isProviderActive = response.data.data.isActive;
        setRole(isProviderActive);
        setIsActive(isProviderActive);
      } catch (error) {
        console.log("role 가져오는 중 오류 발생", error);
      }
    };

    fetchRole();
  }, [cookies.token, navigate]);

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
    navigate(-1);
  };

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/login");
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = cookies.token || localStorage.getItem("token");

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
        `http://localhost:4040/api/v1/providers/me`,
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
    <div className="provider-container">
      <div className="provider-content">
        <div className="provider-switch">
          <div>
            <AntSwitch checked={isActive} onChange={handleRoleToggle} />
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div>
            <label>근무 일정</label>
            <div className={styles.calendarContainer}>
              {isActive ? (
                <Calendar
                  className={styles.calendar}
                  locale="en-US"
                  onClickDay={handleCalendarChange}
                  tileClassName={({ date }) =>
                    selectedDates.some(
                      (selectedDate) =>
                        selectedDate.toDateString() === date.toDateString()
                    )
                      ? styles.selectedDate
                      : styles.calendarTile
                  }
                  formatMonthYear={(locale, date) =>
                    date.toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "long",
                    })
                  }
                  formatMonth={(locale, date) =>
                    date.toLocaleString("ko-KR", { month: "long" })
                  }
                  formatShortWeekday={(locale, date) =>
                    date.toLocaleString("ko-KR", { weekday: "short" }).charAt(0)
                  }
                />
              ) : (
                <div className="isActive-container">
                  <p>댕시터를 활성화 해주세요</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label>소개</label>
            <div className="introduction">
              {isActive ? (
                <textarea
                  value={providerIntroduction}
                  onChange={(e) => setProviderIntroduction(e.target.value)}
                />
              ) : (
                <div className="isActive-container">
                  <p>댕시터를 활성화 해주세요</p>
                </div>
              )}
            </div>
          </div>

          {isActive ? (
            <div className="button-group">
              <button
                type="button"
                onClick={handleSubmit}
                className="ok-button"
              >
                저장
              </button>
              <button type="button" onClick={goBack} className="cancle-button">
                취소
              </button>
            </div>
          ) : (
            <div className="button-group">
              <button type="button" onClick={goBack} className="cancle-button">
                취소
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProviderUpdate;
