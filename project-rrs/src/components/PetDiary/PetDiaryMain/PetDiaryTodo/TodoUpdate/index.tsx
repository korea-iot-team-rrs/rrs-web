import { Button } from "@mui/material";
import React, { useState } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import "../../../../../styles/PetDiaryTodo.css";
import { updateTodo } from "../../../../../apis/todo";
import { useCookies } from "react-cookie";
import { Todo } from "../../../../../types/todoType";
import { useRefreshStore } from "../../../../../stores/PetDiaryStore";

interface TodoUpdateProps {
  selectedDate: string;
  currentTodo: Todo | null;
  goBack: () => void;
}

export default function TodoUpdate({
  selectedDate,
  currentTodo,
  goBack,
}: TodoUpdateProps) {
  const [cookies] = useCookies(["token"]);
  const [updatedContent, setUpdatedContent] = useState(
    currentTodo?.todoPreparationContent || ""
  );
  const { incrementRefreshKey } = useRefreshStore();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdatedContent(e.target.value);
  };

  const updateTodoContentBtnHandler = async () => {
    const token = cookies.token;
    if (!currentTodo || !token) {
      console.error("Todo or token is missing");
      return;
    }
    const updatedCreateAt = selectedDate || currentTodo.todoCreateAt; // 선택된 날짜를 우선 사용
    try {
      await updateTodo(
        currentTodo.todoId,
        {
          todoPreparationContent: updatedContent,
          todoCreateAt: updatedCreateAt,
          todoStatus: currentTodo.todoStatus,
        },
        token
      );
      incrementRefreshKey();
      goBack();
    } catch (error) {
      console.error("Failed to update todo:", error);
    }
  };

  return (
    <>
      <header>
        <div>
          <div className="headerMain">
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
          <div className="headerBtn">
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
        </div>
      </header>
      <div className="createTodoBox">
        <input
          type="text"
          value={updatedContent}
          onChange={handleInputChange}
        />
      </div>
      <div className="createTodoInputBtn">
        <Button onClick={updateTodoContentBtnHandler} variant="contained">
          확인
        </Button>
      </div>
    </>
  );
}
