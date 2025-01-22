import React, { useState } from "react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ReportIcon from "@mui/icons-material/Report";
import { CreateCS } from "../../../types/customerSupportType";
import { createCustomerSupport } from "../../../apis/custommerSupportApi";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Avatar,
  Button,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../../styles/customer-support/customerSupportWrite.css";

export default function CustomerSupportWrite() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const location = useLocation();
  const isInquiryFromList = location.state?.isInquiry ?? true;
  const [isInquiry, setIsInquiry] = useState<boolean>(isInquiryFromList);
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 20 * 1024 * 1024;
  const [createCSReqDto, setCreateCSRequestDto] = useState<CreateCS>({
    customerSupportTitle: "",
    customerSupportContent: "",
    customerSupportCategory: "1",
    files: [],
    path: "/uploads/inquiry-and-report",
  });

  const csBtnClickHandler = (category: string, isInquiry: boolean) => {
    setIsInquiry(isInquiry);
    setCreateCSRequestDto((prev) => ({
      ...prev,
      customerSupportCategory: category,
    }));
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCreateCSRequestDto((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    let totalSize = createCSReqDto.files.reduce(
      (acc, file) => acc + file.size,
      0
    );

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        invalidFiles.push(
          `${file.name} (크기: ${(file.size / (1024 * 1024)).toFixed(2)}MB)`
        );
      } else if (totalSize + file.size > MAX_TOTAL_SIZE) {
        invalidFiles.push(`${file.name} (총 크기 초과)`);
      } else {
        validFiles.push(file);
        totalSize += file.size;
      }
    });

    if (invalidFiles.length > 0) {
      alert(`다음 파일은 업로드할 수 없습니다:\n${invalidFiles.join("\n")}`);
    }

    setCreateCSRequestDto((prev) => ({
      ...prev,
      files: [...prev.files, ...validFiles],
    }));
  };

  const removeFile = (index: number) => {
    setCreateCSRequestDto((prev) => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    const token = cookies.token;

    if (!token) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      const createRequestData = {
        customerSupportTitle: createCSReqDto.customerSupportTitle,
        customerSupportContent: createCSReqDto.customerSupportContent,
        customerSupportCategory: createCSReqDto.customerSupportCategory,
        files: createCSReqDto.files,
        path: "inquiry-and-report",
      };

      await createCustomerSupport(createRequestData, token);
      alert("성공적으로 저장되었습니다!");
      navigate("/inquiry-and-report/list");
    } catch (error) {
      console.error("Error during submit:", error);
      alert("요청 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="cs-write-wrapper">
      <div className="cs-write-header">
        <h2>{isInquiry ? "문의하기" : "신고하기"}</h2>
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
      </div>
      <div className="cs-write-body">
        <div className="cs-write-title">
          <input
            type="text"
            name="customerSupportTitle"
            placeholder={isInquiry ? "문의 제목" : "신고 제목"}
            value={createCSReqDto.customerSupportTitle}
            onChange={handleInputChange}
          />
        </div>
        <div className="cs-write-content">
          <textarea
            name="customerSupportContent"
            placeholder={
              isInquiry ? "문의 내용을 입력하세요." : "신고 사유를 입력하세요."
            }
            value={createCSReqDto.customerSupportContent}
            onChange={handleInputChange}
            rows={6}
          />
        </div>
        <div className="cs-write-attachment">
          <h3>{isInquiry ? "첨부 파일 (선택)" : "증빙 자료 첨부 (선택)"}</h3>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="custom-file-input"
              multiple
              onChange={handleFileChange}
              hidden
            />
            <label htmlFor="custom-file-input" className="custom-file-label">
              파일 선택
            </label>
          </div>

          <List>
            {createCSReqDto.files.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeFile(index)}>
                    <DeleteIcon color="primary" />
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={file.name}
                  secondary={`크기: ${(file.size / (1024 * 1024)).toFixed(
                    2
                  )} MB`}
                />
              </ListItem>
            ))}
          </List>
        </div>
        <div className="cs-complete-btn">
          <Button
            color="primary"
            onClick={handleSubmit}
            sx={{
              width: "100%",
              backgroundColor: "#2194FF",
              color: "#ffffff",
              fontFamily: "Pretendard",
            }}
          >
            완료하기
          </Button>
        </div>
      </div>
    </div>
  );
}
