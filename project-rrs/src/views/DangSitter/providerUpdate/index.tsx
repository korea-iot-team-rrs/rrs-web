import React, { useEffect, useState } from "react";
import { AntSwitch } from "../../../styles/dangSitter/DangSitterCommon";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Calendar } from "rsuite";
import useAuthStore from "../../../stores/auth.store";

const ProviderUdpate = () => {
  const [isActive, setIsActive] = useState(false);
  const [role, setRole] = useState<boolean>(false);
  const navigate = useNavigate();
  const [cookies] = useCookies(["token"]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [providerIntroduction, setProviderIntroduction] = useState<string>("");
  const { user } = useAuthStore();

  console.log(user);

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

  const handleCalendarChange = (date: any) => {
    const formattedDate = date.toISOString().split("T")[0]; // 날짜 형식을 'YYYY-MM-DD'로 변환
    setSelectedDates((prevDates) => {
      if (prevDates.includes(formattedDate)) {
        return prevDates.filter((d) => d !== formattedDate); // 이미 선택된 날짜면 삭제
      }
      return [...prevDates, formattedDate]; // 선택되지 않은 날짜면 추가
    });
  };

  useEffect(() => {
    const token = cookies.token || localStorage.getItem("token");
    if (!token) {
      alert("로그인 정보가 없습니다.");
      navigate("/");
      return;
    }

    const fetchAvailableDate = async () => {
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

        const availableDates = response.data.data.map((dateStr: string) => new Date(dateStr));
        setSelectedDates(availableDates);
      } catch (error) {
        console.log("근무 일정 가져오는 중 오류 발생", error);
      }
    };

    fetchAvailableDate();
  }, [cookies.token, navigate]);

  const handleSubmit = async () => {
    const token = cookies.token || localStorage.getItem("token");

    try {
      const data = {
        availableDates: selectedDates.map((date) => date.toISOString().split("T")[0]), // Date를 'YYYY-MM-DD' 형식의 문자열로 변환
        providerIntroduction: providerIntroduction,
      };

      const response = await axios.put(
        `http://localhost:4040/api/v1/provider/profile`,
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
            <Calendar onChange={handleCalendarChange} />
          </div>

          <div>
            <label>소개</label>
            <input type="text" />
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
