import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { deleteCustomerSupport, fetchOneCustomerSupport } from "../../../apis/custommerSupport";
import { useNavigate, useParams } from "react-router-dom";
import { FetchCS } from "../../../types/customerSupport";
import {
  Avatar,
  Button,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import "../../../styles/customerSupport/CustomerSupportDetail.css";

export default function CustomerSupportDetail() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [cs, setCs] = useState<FetchCS>({
    customerSupportId: 0,
    customerSupportTitle: "",
    customerSupportContent: "",
    customerSupportStatus: "",
    customerSupportCreateAt: new Date(),
    customerSupportCategory: "",
    fileInfos: [],
  });

  const normalizePath = (path: string) => {
    const baseUrl =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:4040/";
    return baseUrl + encodeURIComponent(path.replace(/\\/g, "/"));
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
    navigate(`/customer-supports/edit/${id}`);
  };

  const deleteBtnHandler = () => {
    const token = cookies.token;
    if (!token || !id) {
      console.error("Token is not available or ID is missing.");
      return;
    }

    if (window.confirm("정말 삭제하시겠습니까?")) {
      const csId = Number(id);
      deleteCustomerSupport(csId, token)
        .then(() => {
          alert("삭제되었습니다.");
          navigate("/customer-supports");
        })
        .catch((e) => {
          console.error("Failed to delete customer support:", e);
        });
    }
  };

  useEffect(() => {
    const token = cookies.token;
    if (token && id) {
      const csId = Number(id);
      fetchOneCustomerSupport(csId, token)
        .then((data: FetchCS) => {
          setCs(data);
        })
        .catch((e) => {
          console.error("Failed to fetch customer support:", e);
        });
    }
  }, [id, cookies.token]);

  return (
    <div className="cs-detail-wrapper">
      <div className="cs-detail-header">
        <Chip
          label={categoryLabel(cs.customerSupportCategory)}
          color="primary"
          variant="outlined"
        />
        <Chip
          label={statusLabel(cs.customerSupportStatus)}
          color="success"
          variant="outlined"
        />
      </div>
      <div className="cs-detail-body">
        <div className="cs-detail-title">{cs.customerSupportTitle}</div>
        <div className="cs-detail-content">{cs.customerSupportContent}</div>
        <div className="cs-detail-attachment">
          {cs.fileInfos.length > 0 ? (
            <List>
              {cs.fileInfos.map((att, index) => (
                <ListItem key={index}>
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
          {cs.customerSupportStatus !== "1" ? (
            <Button onClick={handleEdit}>수정하기</Button>
          ) : (
            <Button disabled color="error">
              수정 불가
            </Button>
          )}
          <Button onClick={deleteBtnHandler} color="error">
            삭제하기
          </Button>
        </div>
      </div>
    </div>
  );
}