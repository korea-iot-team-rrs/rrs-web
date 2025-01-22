import React, { useState } from "react";
import { UserSignUp } from "../../../types/authType";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../../styles/Signup.css";
import SignUpModal from "../../../components/sign-up-modal";

const API_BASE_URL = "http://localhost:4040/api/v1/auth";

const ENDPOINTS = {
  DUPLICATE_USERNAME: "/duplicate-username",
  DUPLICATE_NICKNAME: "/duplicate-nickname",
  DUPLICATE_PHONE: "/duplicate-phone",
  DUPLICATE_EMAIL: "/duplicate-email",
};

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
});

interface DuplicateCheckResponse {
  result: boolean;
  data: {
    duplicate: boolean;
  };
}

const handleError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data || error.message;
  }
  return String(error);
};

const checkUsernameDuplicate = async (
  username: string
): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<DuplicateCheckResponse>(
      ENDPOINTS.DUPLICATE_USERNAME,
      {
        params: { username },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error checking username duplicate:", handleError(error));
    return { result: false, data: { duplicate: true } };
  }
};

const checkNicknameDuplicate = async (
  nickname: string
): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<DuplicateCheckResponse>(
      ENDPOINTS.DUPLICATE_NICKNAME,
      {
        params: { nickname },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error checking nickname duplicate:", handleError(error));
    return { result: false, data: { duplicate: true } };
  }
};

const checkPhoneDuplicate = async (
  phone: string
): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<DuplicateCheckResponse>(
      ENDPOINTS.DUPLICATE_PHONE,
      {
        params: { phone },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error checking phone duplicate:", handleError(error));
    return { result: false, data: { duplicate: true } };
  }
};

const checkEmailDuplicate = async (
  email: string
): Promise<DuplicateCheckResponse> => {
  try {
    const response = await axiosInstance.get<DuplicateCheckResponse>(
      ENDPOINTS.DUPLICATE_EMAIL,
      {
        params: { email },
      }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error checking email duplicate:", handleError(error));
    return { result: false, data: { duplicate: true } };
  }
};

export default function RrsSignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const snsId = params.get("snsId");
  const joinPath = params.get("joinPath");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [userInfo, setUserInfo] = useState<UserSignUp>({
    profileImageUrl: null,
    username: "",
    password: "",
    confirmPassword: "",
    name: "",
    nickname: "",
    address: "",
    addressDetail: "",
    email: "",
    phone: "",
    joinPath: joinPath ? joinPath : "Home",
    snsId: snsId,
  });

  const [emailDomain, setEmailDomain] = useState("custom");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserInfo((prev) => {
      const updatedInfo = { ...prev, [name]: value };

      if (name === "password") {
        if (
          !/^(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,15}$/.test(
            value
          )
        ) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password:
              "비밀번호는 8~15자이며 숫자와 특수문자를 포함해야 합니다.",
          }));
        } else {
          setErrors((prevErrors) => {
            const { password, ...rest } = prevErrors;
            return rest;
          });
        }
      }

      if (name === "confirmPassword") {
        if (value !== updatedInfo.password) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            confirmPassword: "비밀번호가 일치하지 않습니다.",
          }));
        } else {
          setErrors((prevErrors) => {
            const { confirmPassword, ...rest } = prevErrors;
            return rest;
          });
        }
      }

      return updatedInfo;
    });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserInfo((prev) => ({ ...prev, email: value }));
    if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "유효한 이메일 주소를 입력하세요.",
      }));
    } else {
      setErrors((prevErrors) => {
        const { email, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleEmailDomainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setEmailDomain(value);
    if (value === "custom") {
      setUserInfo((prev) => ({
        ...prev,
        email: prev.email.split("@")[0] + "@",
      }));
    } else {
      setUserInfo((prev) => ({
        ...prev,
        email: prev.email.split("@")[0] + value,
      }));

      setErrors((prevErrors) => {
        const { email, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const handleAddressSearch = () => {
    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        setUserInfo((prev) => ({
          ...prev,
          address: data.address,
        }));
      },
    }).open();
  };

  const validateField = (field: string): boolean => {
    switch (field) {
      case "username":
        return /^[a-zA-Z0-9]{5,15}$/.test(userInfo.username);
      case "name":
        return (
          /^[가-힣]{2,10}$/.test(userInfo.name) &&
          !/(.)\1{2,}/.test(userInfo.name)
        );
      case "nickname":
        return /^[a-zA-Z0-9가-힣]{2,10}$/.test(userInfo.nickname);
      case "email":
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(
          userInfo.email
        );
      case "phone":
        return /^[0-9]{11}$/.test(userInfo.phone);
      default:
        return true;
    }
  };

  const handleDuplicateCheck = async (field: string) => {
    if (!validateField(field)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "입력값이 올바르지 않습니다.",
      }));
      return;
    }

    try {
      let response: DuplicateCheckResponse;
      let message = "";
      switch (field) {
        case "username":
          response = await checkUsernameDuplicate(userInfo.username);
          message = response.data.duplicate
            ? "이미 등록된 아이디입니다."
            : "사용 가능한 아이디입니다.";
          break;
        case "nickname":
          response = await checkNicknameDuplicate(userInfo.nickname);
          message = response.data.duplicate
            ? "이미 등록된 닉네임입니다."
            : "사용 가능한 닉네임입니다.";
          break;
        case "email":
          response = await checkEmailDuplicate(userInfo.email);
          message = response.data.duplicate
            ? "이미 등록된 이메일입니다."
            : "사용 가능한 이메일입니다.";
          break;
        case "phone":
          response = await checkPhoneDuplicate(userInfo.phone);
          message = response.data.duplicate
            ? "이미 등록된 연락처입니다."
            : "사용 가능한 연락처입니다.";
          break;
        default:
          return;
      }

      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: message,
      }));
    } catch (error) {
      console.error("Error during duplicate check:", handleError(error));
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "중복 확인 중 오류가 발생했습니다.",
      }));
    }
  };

  const handleSignUp = async () => {
    const isValid = validateForm();
  
    if (isValid) {
      try {
        const requestBody = { ...userInfo };
  
        const response = await axios.post(
          `${API_BASE_URL}/sign-up`,
          requestBody,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        console.log(response);
  
        if (response.data.result) {
          setShowModal(true); // 모달 표시
        } else {
          setErrors((prev) => ({
            ...prev,
            form: "회원가입에 실패했습니다.",
          }));
        }
      } catch (error) {
        setErrors((prev) => ({
          ...prev,
          form: "서버 에러가 발생하였습니다.",
        }));
        console.error("Error during sign-up:", handleError(error));
      }
    }
  };

  const [showModal, setShowModal] = useState(false);

  const validateForm = () => {
    const tempErrors: { [key: string]: string } = {};

    if (!userInfo.username || !/^[a-zA-Z0-9]{5,15}$/.test(userInfo.username))
      tempErrors.username = "아이디는 영문 및 숫자로 5~15자이어야 합니다.";

    if (!userInfo.name || !/^[가-힣]+$/.test(userInfo.name))
      tempErrors.name = "이름은 한글로만 입력해야 합니다.";

    if (
      !userInfo.nickname ||
      !/^[a-zA-Z0-9가-힣]{2,10}$/.test(userInfo.nickname)
    )
      tempErrors.nickname = "닉네임은 2~10자 이내로 입력하세요.";

    if (
      !userInfo.email ||
      !/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(userInfo.email)
    )
      tempErrors.email = "유효한 이메일 주소를 입력하세요.";

    if (!userInfo.phone || !/^[0-9]{11}$/.test(userInfo.phone))
      tempErrors.phone = "연락처는 11자리 숫자여야 합니다.";

    if (!userInfo.password) tempErrors.password = "비밀번호를 입력하세요.";
    else if (
      !/^(?=.*\d)(?=.*[!@#$%^&*()_\-+=])[A-Za-z\d!@#$%^&*()_\-+=]{8,15}$/.test(
        userInfo.password
      )
    )
      tempErrors.password =
        "비밀번호는 8~15자이며 숫자와 특수문자를 포함해야 합니다.";

    if (userInfo.password !== userInfo.confirmPassword)
      tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    if (!userInfo.address) tempErrors.address = "주소를 입력하세요.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  return (
    <div className="signup-main">
      <h1>회원가입</h1>
      <form>
        <label htmlFor="username">아이디</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="영문, 숫자 5 ~ 15자 이내 작성"
          onChange={handleInputChange}
        />
        <button
          type="button"
          onClick={() => handleDuplicateCheck("username")}
          disabled={!validateField("username")}
        >
          중복확인
        </button>
        <p
          style={{
            color: errors.username?.includes("사용 가능") ? "green" : "red",
          }}
        >
          {errors.username}
        </p>

        <label htmlFor="name">이름</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="이름을 입력하세요"
          onChange={handleInputChange}
        />
        <p
          style={{
            color: errors.name?.includes("사용 가능") ? "green" : "red",
          }}
        >
          {errors.name}
        </p>

        <label htmlFor="nickname">닉네임</label>
        <input
          type="text"
          id="nickname"
          name="nickname"
          placeholder="닉네임을 입력해주세요 (2 ~ 10자)"
          onChange={handleInputChange}
        />
        <button
          type="button"
          onClick={() => handleDuplicateCheck("nickname")}
          disabled={!validateField("nickname")}
        >
          중복확인
        </button>
        <p
          style={{
            color: errors.nickname?.includes("사용 가능") ? "green" : "red",
          }}
        >
          {errors.nickname}
        </p>

        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="example@domain.com"
          value={userInfo.email}
          onChange={handleEmailChange}
        />
        <select
          name="emailDomain"
          value={emailDomain}
          onChange={handleEmailDomainChange}
        >
          <option value="custom">직접입력</option>
          <option value="@gmail.com">@gmail.com</option>
          <option value="@naver.com">@naver.com</option>
          <option value="@daum.net">@daum.net</option>
        </select>
        <button
          type="button"
          onClick={() => handleDuplicateCheck("email")}
          disabled={!validateField("email")}
        >
          중복확인
        </button>
        <p
          style={{
            color: errors.email?.includes("사용 가능") ? "green" : "red",
          }}
        >
          {errors.email}
        </p>

        <label htmlFor="phone">연락처</label>
        <input
          type="text"
          id="phone"
          name="phone"
          placeholder='01011111111 "-제외"'
          onChange={handleInputChange}
        />
        <button
          type="button"
          onClick={() => handleDuplicateCheck("phone")}
          disabled={!validateField("phone")}
        >
          중복확인
        </button>
        <p
          style={{
            color: errors.phone?.includes("사용 가능") ? "green" : "red",
          }}
        >
          {errors.phone}
        </p>

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="비밀번호를 입력하세요."
          onChange={handleInputChange}
        />
        <p style={{ color: "red" }}>{errors.password}</p>

        <label htmlFor="confirmPassword">비밀번호 확인</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="비밀번호를 다시 입력하세요."
          onChange={handleInputChange}
        />
        <p style={{ color: "red" }}>{errors.confirmPassword}</p>

        <label htmlFor="address">주소</label>
        <input
          type="text"
          id="address"
          name="address"
          placeholder="주소 입력"
          value={userInfo.address}
          readOnly
        />
        <button type="button" onClick={handleAddressSearch}>
          주소검색
        </button>
        <p
          style={{
            color: errors.address?.includes("사용 가능") ? "green" : "red",
          }}
        >
          {errors.address}
        </p>

        <label htmlFor="addressDetail">상세주소</label>
        <input
          type="text"
          id="addressDetail"
          name="addressDetail"
          placeholder="상세 주소 입력"
          onChange={handleInputChange}
        />
        <button type="button" onClick={handleSignUp}>
          완료
        </button>
        <p style={{ color: "red" }}>{errors.form}</p>
      </form>
      {showModal && (
      <SignUpModal onClose={() => { setShowModal(false); navigate("/login"); }} />
    )}
    </div>
  );
}
