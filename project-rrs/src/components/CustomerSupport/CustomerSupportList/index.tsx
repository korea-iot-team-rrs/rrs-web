import React, { useEffect, useState } from "react";
import { CustomerSupport, fetchCSList } from "../../../types/customerSupport";
import { Button, Fab } from "@mui/material";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "../../../styles/CustomerSupportList.css";
import { fetchCustomerSupportList } from "../../../apis/custommerSupport";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ReportIcon from "@mui/icons-material/Report";
import { useDateStore } from "../../../stores/daytransfer";

export default function CustomerSupportList() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [csList, setCsList] = useState<fetchCSList[]>([]);
  const [isInquiry, setIsInquiry] = useState<boolean>(true);
  const { formatDateBySlash } = useDateStore();

  const csAddBtnHandler = (e: React.MouseEvent<HTMLButtonElement>) => {
    navigate("/customer-supports/write");
  };

  const csBtnClickHandler = (category: string, isInquiry: boolean) => {
    setIsInquiry(isInquiry);
  };

  useEffect(() => {
    const fetchCSList = async () => {
      const token = cookies.token;
      try {
        const response = await fetchCustomerSupportList(token);
        setCsList(response);
      } catch (error) {
        console.error("fail to fetch cs list", error);
      }
    };

    fetchCSList();
  }, [cookies.token]);

  return (
    <>
      <div className="cs-switch-btn">
        <Fab
          className="inquiry-btn"
          variant="extended"
          color={isInquiry ? "primary" : "default"}
          onClick={() => csBtnClickHandler("1", true)}
        >
          <SupportAgentIcon />
          문의하기
        </Fab>
        <Fab
          className="report-btn"
          variant="extended"
          color={!isInquiry ? "primary" : "default"}
          onClick={() => csBtnClickHandler("0", false)}
        >
          <ReportIcon />
          신고하기
        </Fab>
      </div>
      <button className="cs-create-button" onClick={csAddBtnHandler}>
        글쓰기 +
      </button>
      <div className="cs-list-wrapper">
        <ul>
          {csList
            .filter((value) =>
              isInquiry
                ? value.customerSupportCategory === "1"
                : value.customerSupportCategory === "0"
            )
            .map((value, index) => (
              <li key={index} onClick={(id) => navigate(`/dang-sitter/customer-supports/${id}`)}>
                <h3>{value?.customerSupportTitle}</h3>
                <p>{value?.customerSupportContent}</p>
                <p>
                  {value?.customerSupportCreateAt
                    ? formatDateBySlash(new Date(value.customerSupportCreateAt))
                    : "날짜 없음"}
                </p>
                <p>{value?.customerSupportStatus}</p>
              </li>
            ))}
        </ul>
      </div>
    </>
  );
}
