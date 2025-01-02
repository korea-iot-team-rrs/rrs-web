import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import "../../../../../styles/PetDiaryTodo.css";
import { useCookies } from "react-cookie";
import { useRefreshStore } from "../../../../../stores/PetDiaryStore";
import { createTodo } from "../../../../../apis/todo";
interface TodoUpdateProps {
  goBack: () => void;
  selectedDate: string;
}

export default function TodoCreate({
  goBack,
  selectedDate,
}: TodoUpdateProps) {
  const [todoContent, setTodoContent] = useState<string>("");
  const [cookies] = useCookies(["token"]);
  const { incrementRefreshKey } = useRefreshStore();
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setTodoContent(e.target.value);
  };
  const inputTodoContentBtnHandler = async () => {
    const token = cookies.token;
    console.log(token);
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
      setTodoContent("");
      goBack();
      incrementRefreshKey();
    } catch (e) {
      console.error(e);
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
          value={todoContent}
          onChange={handleInputChange}
          placeholder={"할 일을 입력 해주세요"}
        />
      </div>
      <div className="createTodoInputBtn">
        <Button onClick={inputTodoContentBtnHandler} variant="contained">
          확인
        </Button>
      </div>
    </>
  );
}
