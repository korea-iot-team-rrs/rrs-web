import React, { useEffect, useState } from "react";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import ReportIcon from "@mui/icons-material/Report";
import { CreateCS } from "../../../types/customerSupport";
import "../../../styles/CustomerSupportWrite.css";
import { createCustomerSupport } from "../../../apis/custommerSupport";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Fab,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";

type CustomerSupportWriteProps = {
  editData?: CreateCS | null;
};

export default function CustomerSupportWrite({
  editData,
}: CustomerSupportWriteProps) {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [createCSReqDto, setCreateCSRequestDto] = useState<CreateCS>({
    customerSupportTitle: "",
    customerSupportContent: "",
    customerSupportCategory: "1",
    files: [],
    path: "/uploads/customer-support",
  });
  const [isInquiry, setIsInquiry] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(false);

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
    setCreateCSRequestDto((prev) => ({
      ...prev,
      files: [...prev.files, ...files],
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

    const formData = new FormData();
    Object.entries(createCSReqDto).forEach(([key, value]) => {
      if (key === "files" && Array.isArray(value)) {
        value.forEach((file: File) => {
          formData.append("files", file);
        });
      } else {
        formData.append(key, value as string);
      }
    });

    console.log(createCSReqDto);
    try {
      await createCustomerSupport(createCSReqDto, token);
      alert("성공적으로 저장되었습니다!");
      navigate("/customer-supports");
    } catch (error) {
      console.error("Error creating customer support:", error);
      alert("요청 처리 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (editData) {
      setCreateCSRequestDto(editData);
    }
  }, [editData]);

  return (
    <div className="cs-write-wrapper">
      <div className="cs-write-header">
        <h1>{isInquiry ? "문의하기" : "신고하기"}</h1>
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
          <input type="file" multiple onChange={handleFileChange} />
          <List>
            {createCSReqDto.files.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => removeFile(index)}
                  >
                    <DeleteIcon  color="primary"/>
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar>
                    <FolderIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={file.name} />
              </ListItem>
            ))}
          </List>
        </div>
        <div className="cs-complete-btn">
          <Fab variant="extended" color="primary" onClick={handleSubmit}>
            완료하기
          </Fab>
        </div>
      </div>
    </div>
  );
}
