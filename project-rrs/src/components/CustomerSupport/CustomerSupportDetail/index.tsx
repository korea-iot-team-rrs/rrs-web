import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { fetchOneCustomerSupport } from "../../../apis/custommerSupport";
import { useNavigate, useParams } from "react-router-dom";
import { FetchCS, CreateCS, EditedCS } from "../../../types/customerSupport";
import {
  Avatar,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import CustomerSupportWrite from "../CustomerSupportWrite";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CustomerSupportDetail() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [cs, setCs] = useState<FetchCS>({
    customerSupportId: 0,
    customerSupportTitle: "",
    customerSupportContent: "",
    customerSupportStatus: "",
    customerSupportCreateAt: new Date(),
    customerSupportCategory: "",
    fileInfos: [],
  });

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [editData, setEditData] = useState<EditedCS | null>(null);
  const { id } = useParams<{ id: string }>();

  const normalizePath = (path: string) => {
    const baseUrl =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:4040/";
    return baseUrl + path.replace(/\\/g, "/");
  };

  const handleDeleteFile = (index: number) => {
    setCs((prev) => ({
      ...prev,
      fileInfos: prev.fileInfos.filter((_, i) => i !== index),
    }));
  };

  const categoryLabel = (status: string) => {
    switch (status) {
      case "0":
        return "신고";
      case "1":
        return "문의";
      default:
        return "알 수 없음";
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case "0":
        return "미 처리";
      case "1":
        return "처리 완료";
      default:
        return "알 수 없음";
    }
  };

  const handleEdit = () => {
    setEditData({
      customerSupportId: cs.customerSupportId,
      customerSupportTitle: cs.customerSupportTitle,
      customerSupportContent: cs.customerSupportContent,
      customerSupportCategory: cs.customerSupportCategory,
      fileInfos: cs.fileInfos,
    });
    setIsEdit(true);
  };

  useEffect(() => {
    const token = cookies.token;
    if (token && id) {
      const csId = Number(id);
      fetchOneCustomerSupport(csId, token)
        .then((data: FetchCS) => {
          setCs(data);
        })
        .catch((e) => console.error("fail to fetch cs", e));
    }
  }, [id, cookies.token]);

  return (
    <>
      {!isEdit ? (
        <div className="cs-detail-wrapper">
          <div className="cs-detail-header">
            <p>{categoryLabel(cs.customerSupportCategory)}</p>
            <p>{statusLabel(cs.customerSupportStatus)}</p>
          </div>
          <div className="cs-detail-body">
            <div className="cs-detail-title">{cs.customerSupportTitle}</div>
            <div className="cs-detail-content">{cs.customerSupportContent}</div>
            <div className="cs-detail-attachment">
              {cs.fileInfos.length > 0 ? (
                <List>
                  {cs.fileInfos.map((att, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          aria-label="delete"
                          onClick={() => handleDeleteFile(index)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          <FolderIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <a href={normalizePath(att.filePath)} download>
                            {att.fileName}
                          </a>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <p>첨부된 파일이 없습니다.</p>
              )}
            </div>
            <div className="cs-detail-btn">
              <Button onClick={handleEdit}>수정하기</Button>
              <Button>삭제하기</Button>
            </div>
          </div>
        </div>
      ) : (
        <CustomerSupportWrite editData={editData} />
      )}
    </>
  );
}
