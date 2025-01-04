import React, { useEffect, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { AntSwitch } from "../../../styles/DangSitterCommon";
import { useNavigate } from "react-router-dom";
import "../../../styles/DangSitterMain.css";
import { TfiArrowTopRight } from "react-icons/tfi";

export default function DangSitterMain() {
  const navigate = useNavigate();
  const [toggleChecked, setToggleChecked] = useState(false);

  const toggleHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToggleChecked(event.target.checked);
  };

  return (
    <>
      <div className="dang-sitter-main-wrapper">
        <div className="dang-sitter-toggle">
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Typography>이용자</Typography>
            <AntSwitch
              inputProps={{ "aria-label": "ant design" }}
              checked={toggleChecked}
              onChange={toggleHandleChange}
            />
            <Typography>댕시터</Typography>
          </Stack>
        </div>

        <div
          className="dang-sitter-container01"
          onClick={() =>
            navigate(toggleChecked ? "/" : "/dang-sitter/reservations/write")
          }
        >
          <h2 className="reservation-title">
            {toggleChecked ? "등록 및 수정하기" : "예약 하기"}
          </h2>
            <TfiArrowTopRight size={40}/>
        </div>
        <div
          className="dang-sitter-container02"
          onClick={() =>
            navigate(
              toggleChecked
                ? "/dang-sitter/reservations"
                : "/dang-sitter/reservations"
            )
          }
        >
          <h2 className="reservation-title">
            {toggleChecked ? "제공 목록" : "예약 목록"}
          </h2>
            <TfiArrowTopRight size={40}/>
        </div>
        <div
          className="dang-sitter-container03"
          onClick={() => navigate(toggleChecked ? "/" : "/")}
        >
          <h2 className="reservation-title">
            {toggleChecked ? "댕시터란?" : "댕시터란?"}
          </h2>
        </div>
        <div
          className="dang-sitter-container04"
          onClick={() => navigate(toggleChecked ? "/" : "/")}
        >
          <h2 className="reservation-title">
            {toggleChecked ? "댕시터 제공자 가이드" : "댕시터 이용자 가이드"}
          </h2>
        </div>
      </div>
    </>
  );
}
