import React from "react";
import "../../../../styles/PetDiaryTodo.css";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import PlusIcon from '@rsuite/icons/Plus';

export default function PetDiaryTodo() {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  return (
    <>
      <div className="petDiaryTodoConatiner">
        <header>
          <div>
            <h2>오늘 할 일</h2>
            <span>Today's Date</span>
          </div>
          <div>
            <Button variant="contained" 
            sx={{
              backgroundColor: '#3DA1FF',
              boxShadow: "none",
              '&:hover': {
                boxShadow: "none"
              },
              fontWeight:"bold",
              borderRadius:"20px"
            }}>
              추가하기 &nbsp;
              <PlusIcon />
            </Button>
          </div>
        </header>
        <ul>
          <li>
            <span>사료 사두기</span>{" "}
            <Checkbox
              {...label}
              sx={{
                color: "#7e7e7e", // 기본 체크박스 색상
                "&.Mui-checked": {
                  color: "#ff6b6b", // 체크된 상태일 때 색상
                },
              }}
            />
          </li>
        </ul>
      </div>
    </>
  );
}
