import { Button } from "@mui/material";
import React, { useState } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import "../../../../../styles/PetDiaryTodo.css";
import { createTodo, TOKEN } from "../../../../../apis/todo";
interface TodoUpdateProps {
  goBack: () => void;
  selectedDate: string;
  triggerRefresh: () => void;
}

export default function TodoUpdate({
  goBack,
  selectedDate,
  triggerRefresh,
}: TodoUpdateProps) {
  const [todoContent, setTodoContent] = useState<string>("");
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoContent(e.target.value);
  };

  const inputTodoContentBtnHandler = async () => {
    const token = TOKEN;
    if (!token) {
      console.error("Token not found");
      return;
    }

    if (!todoContent.trim()) {
      alert("내용을 입력해주세요!");
      return;
    }

    try {
      await createTodo(todoContent, selectedDate, token);
      alert("Todo가 생성되었습니다.");
      setTodoContent("");
      triggerRefresh();
      goBack();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <>
      <header>
        <div>
          <h2>Todo 추가하기</h2>
          <span>
            {selectedDate && (
              <>
                {selectedDate.split("-")[0]}년 &nbsp;
                {selectedDate.split("-")[1]}월 &nbsp;
                {selectedDate.split("-")[2]}일
              </>
            )}
          </span>
        </div>
        <div>
          <Button
            onClick={goBack}
            variant="contained"
            sx={{
              backgroundColor: "#4d4d4d",
              boxShadow: "none",
              "&:hover": {
                boxShadow: "none",
              },
              fontWeight: "bold",
              borderRadius: "20px",
            }}
          >
            <IoIosArrowDropleftCircle size={"1.5em"} />
            &nbsp;뒤로가기
          </Button>
        </div>
      </header>
      <div className="createTodoBox">
        <input
          type="text"
          value={todoContent}
          onChange={handleInputChange}
          placeholder={"할 일을 입력 해주세요"}
        />
      </div>
      <div className="createTodoInputBtn">
        <Button onClick={inputTodoContentBtnHandler} variant="contained">
          생성
        </Button>
      </div>
    </>
  );
}