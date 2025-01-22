import React, { useEffect, useMemo, useState } from "react";
import { FetchCSList } from "../../../types/customerSupport";
import { Fab, Pagination } from "@mui/material";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { fetchCustomerSupportList } from "../../../apis/custommerSupport";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ReportIcon from "@mui/icons-material/Report";
import { useDateStore } from "../../../stores/daytransfer";
import "../../../styles/customerSupport/CustomerSupportList.css";

export default function CustomerSupportList() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [csList, setCsList] = useState<FetchCSList[]>([]);
  const [isInquiry, setIsInquiry] = useState<boolean>(true);
  const { formatDateBySlash } = useDateStore();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredCS = useMemo(() => {
    if (!Array.isArray(csList)) return [];
    return csList
      .filter((value) =>
        isInquiry
          ? value.customerSupportCategory === "1"
          : value.customerSupportCategory === "0"
      )
      .sort(
        (a, b) =>
          new Date(b.customerSupportCreateAt).getTime() -
          new Date(a.customerSupportCreateAt).getTime()
      );
  }, [csList, isInquiry]);


  const totalPages = Math.ceil(filteredCS.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const csAddBtnHandler = () => {
    navigate("/inquiry-and-report/write", { state: { isInquiry } });
  };

  const csBtnClickHandler = (isInquiry: boolean) => {
    setIsInquiry(isInquiry);
    setCurrentPage(1);
  };

  const statusFormater = (status: string) => {
    switch (status) {
      case "0":
        return "미처리";
      case "1":
        return "처리완료";
      default:
        return "알 수 없는 처리";
    }
  };

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number
  ) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    const FetchCSList = async () => {
      const token = cookies.token;
      try {
        const response = await fetchCustomerSupportList(token);
        setCsList(response);
      } catch (error) {
        console.error("fail to fetch cs list", error);
      }
    };

    FetchCSList();
  }, [cookies.token]);

  return (
    <>
      <div className="cs-list-wrapper">
        <div>
          <h2>나의 고객센터</h2>
        </div>
        <div className="cs-switch-btn">
          <div className="cs-list-wrapper-title">
            <div>
              <Fab
                className="inquiry-btn"
                variant="extended"
                color={isInquiry ? "primary" : "default"}
                onClick={() => csBtnClickHandler(true)}
              >
                <SupportAgentIcon /> 문의하기
              </Fab>
              <Fab
                className="report-btn"
                variant="extended"
                color={!isInquiry ? "primary" : "default"}
                onClick={() => csBtnClickHandler(false)}
              >
                <ReportIcon /> 신고하기
              </Fab>
            </div>
            <div>
              <button className="cs-create-button" onClick={csAddBtnHandler}>
                글쓰기 +
              </button>
            </div>
          </div>
        </div>
        <div className="cs-list-body">
          <div className="cs-list-body-title">
            <div><p>목차</p></div>
            <div><p>제목</p></div>
            <div><p>날짜</p></div>
            <div><p>상태</p></div>
          </div>
          <ul>
            {filteredCS.slice(startIndex, endIndex).map((value, index) => (
              <li
                key={index}
                onClick={() =>
                  navigate(`/inquiry-and-report/${value.customerSupportId}`)
                }
              >
                <p>{index + 1}</p>
                <p>{value?.customerSupportTitle}</p>
                <p>
                  {value?.customerSupportCreateAt
                    ? formatDateBySlash(new Date(value.customerSupportCreateAt))
                    : "날짜 없음"}
                </p>
                <p>{statusFormater(value.customerSupportStatus)}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="pagination">
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
}
