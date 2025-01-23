import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import {
  deleteCustomerSupport,
  fetchOneCustomerSupport,
} from "../../../apis/custommerSupportApi";
import { useNavigate, useParams } from "react-router-dom";
import { FetchCS } from "../../../types/customerSupportType";
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
import "../../../styles/customer-support/customerSupportDetail.css";

export default function CustomerSupportDetail() {
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [totalFileSize, setTotalFileSize] = useState<number | null>(null);
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
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${baseUrl}${path.replace(/\\/g, "/")}`;
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
    navigate(`/customer-support/edit/${id}`);
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
          navigate("/customer-support/list");
        })
        .catch((e) => {
          console.error("Failed to delete customer support:", e);
        });
    }
  };
  const fetchFileSize = async (filePath: string): Promise<number | null> => {
    try {
      const response = await fetch(filePath, { method: "HEAD" });
      const size = response.headers.get("Content-Length");
      return size ? parseInt(size, 10) : null;
    } catch (error) {
      console.error("Failed to fetch file size:", error);
      return null;
    }
  };

  useEffect(() => {
    const token = cookies.token;
    if (token && id) {
      const csId = Number(id);

      fetchOneCustomerSupport(csId, token)
        .then(async (data: FetchCS) => {
          const fileInfosWithSize = await Promise.all(
            data.fileInfos.map(async (file) => ({
              ...file,
              fileSize: await fetchFileSize(normalizePath(file.filePath)),
            }))
          );

          const totalSize = fileInfosWithSize.reduce((sum, file) => {
            return sum + (file.fileSize || 0);
          }, 0);

          setCs({ ...data, fileInfos: fileInfosWithSize });
          setTotalFileSize(totalSize);
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
        <pre className="cs-detail-content">{cs.customerSupportContent}</pre>
        <div className="cs-detail-attachment">
          <div>
            <p>
              <strong>총 파일 크기:</strong>{" "}
              {totalFileSize !== null
                ? `${(totalFileSize / (1024 * 1024)).toFixed(2)} MB`
                : "계산 중..."}
            </p>
          </div>
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
                    secondary={
                      att.fileSize
                        ? `크기: ${(att.fileSize / (1024 * 1024)).toFixed(
                            2
                          )} MB`
                        : "크기 정보 없음"
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
          <Button
            color="inherit"
            variant="outlined"
            onClick={() => navigate('/customer-support/list')}
            sx={{
              fontFamily: "Pretendard",
            }}
          >
            돌아가기
          </Button>
          <div>
            {cs.customerSupportStatus !== "1" ? (
              <Button
                variant="outlined"
                onClick={handleEdit}
                sx={{
                  fontFamily: "Pretendard",
                }}
              >
                수정하기
              </Button>
            ) : (
              <Button
                variant="outlined"
                disabled
                color="error"
                sx={{
                  fontFamily: "Pretendard",
                }}
              >
                수정 불가
              </Button>
            )}
            <Button
              variant="outlined"
              onClick={deleteBtnHandler}
              color="warning"
              sx={{
                fontFamily: "Pretendard",
              }}
            >
              삭제하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
