import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";
import {
  fetchOneCustomerSupport,
  updateCustomerSupport,
} from "../../../apis/custommerSupport";
import { FetchCS, UpdateCS } from "../../../types/customerSupport";
import {
  Avatar,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
} from "@mui/material";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";
import "../../../styles/customerSupport/CustomerSupportUpdate.css";

export default function CustomerSupportUpdate() {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_TOTAL_SIZE = 20 * 1024 * 1024; // 20MB

  const { id } = useParams<{ id: string }>();
  const [cookies] = useCookies(["token"]);
  const navigate = useNavigate();
  const [totalFileSize, setTotalFileSize] = useState<number>(0);

  const [cs, setCs] = useState<FetchCS>({
    customerSupportId: 0,
    customerSupportTitle: "",
    customerSupportContent: "",
    customerSupportStatus: "",
    customerSupportCreateAt: new Date(),
    customerSupportCategory: "",
    fileInfos: [],
  });

  const [updateCs, setUpdateCs] = useState<UpdateCS>({
    customerSupportTitle: "",
    customerSupportContent: "",
    files: [],
  });

  const [existingFilesInfo, setExistingFilesInfo] = useState<
    { filePath: string; fileName: string }[]
  >([]);
  const [existingFiles, setExistingFiles] = useState<File[]>([]);
  const [newFiles, setNewFiles] = useState<File[]>([]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpdateCs((prev) => ({
      ...prev,
      customerSupportTitle: e.target.value,
    }));
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateCs((prev) => ({
      ...prev,
      customerSupportContent: e.target.value,
    }));
  };

  const calculateTotalSize = () => {
    const existingTotalSize = existingFiles.reduce(
      (acc, file) => acc + file.size,
      0
    );
    const newFilesTotalSize = newFiles.reduce(
      (acc, file) => acc + file.size,
      0
    );
    return existingTotalSize + newFilesTotalSize;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    let totalSize = calculateTotalSize();

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

    setNewFiles((prev) => [...prev, ...validFiles]);
    setTotalFileSize(totalSize);
  };

  const removeNewFile = (index: number) => {
    const updatedFiles = newFiles.filter((_, i) => i !== index);
    setNewFiles(updatedFiles);
    setTotalFileSize(calculateTotalSize());
  };

  const removeExistingFile = (index: number) => {
    const updatedFilesInfo = existingFilesInfo.filter((_, i) => i !== index);
    const updatedFiles = existingFiles.filter((_, i) => i !== index);

    setExistingFilesInfo(updatedFilesInfo);
    setExistingFiles(updatedFiles);

    const totalSize = [
      ...updatedFiles.map((file) => file.size),
      ...newFiles.map((file) => file.size),
    ].reduce((acc, size) => acc + size, 0);

    setTotalFileSize(totalSize);
  };
  const submitClickHandler = () => {
    const token = cookies.token;

    if (!token || !id) {
      console.error("Token or ID is missing.");
      return;
    }

    const formData = new FormData();
    formData.append("customerSupportTitle", updateCs.customerSupportTitle);
    formData.append("customerSupportContent", updateCs.customerSupportContent);

    const allFiles = [...existingFiles, ...newFiles];
    allFiles.forEach((file) => {
      formData.append("files", file);
    });

    updateCustomerSupport(Number(id), formData, token)
      .then(() => {
        alert("수정이 완료되었습니다.");
        navigate(`/inquiry_and_report/${id}`);
      })
      .catch((error) => {
        console.error("Failed to edit customer support:", error);
        alert("수정 중 에러가 발생했습니다.");
      });
  };

  useEffect(() => {
    const token = cookies.token;
    if (token && id) {
      fetchOneCustomerSupport(Number(id), token)
        .then(async (response: FetchCS) => {
          setCs(response);
          setUpdateCs({
            customerSupportTitle: response.customerSupportTitle,
            customerSupportContent: response.customerSupportContent,
            files: [],
          });

          const filesWithPaths = response.fileInfos.map((file) => ({
            filePath: normalizePath(file.filePath),
            fileName: file.fileName,
          }));

          setExistingFilesInfo(filesWithPaths);

          const fileObjects = await Promise.all(
            filesWithPaths.map((file) =>
              convertFilePathToFile(file.filePath, file.fileName)
            )
          );

          setExistingFiles(fileObjects);

          const existingSize = fileObjects.reduce(
            (acc, file) => acc + file.size,
            0
          );
          const newFilesSize = newFiles.reduce(
            (acc, file) => acc + file.size,
            0
          );
          setTotalFileSize(existingSize + newFilesSize);
        })
        .catch((e) => {
          console.error("Failed to fetch customer support files:", e);
        });
    }
  }, [id, cookies.token]);

  const normalizePath = (path: string) => {
    const baseUrl =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:4040/";
    if (path.startsWith("http://") || path.startsWith("https://")) {
      return path;
    }
    return `${baseUrl}${path.replace(/\\/g, "/")}`;
  };

  const convertFilePathToFile = async (filePath: string, fileName: string) => {
    const response = await fetch(filePath);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  return (
    <div className="cs-update-wrapper">
      <div className="cs-update-header">
        <div className="cs-update-title">
          <input
            type="text"
            value={updateCs.customerSupportTitle}
            onChange={handleTitleChange}
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className="cs-update-content">
          <textarea
            name="customerSupportContent"
            value={updateCs.customerSupportContent}
            onChange={handleContentChange}
            placeholder="내용을 입력하세요"
          />
        </div>
      </div>
      <div className="cs-update-attachment">
        <div className="cs-update-exist-attachment">
          <h3>기존 첨부 파일</h3>
          {existingFilesInfo.length > 0 ? (
            <List>
              {existingFilesInfo.map((att, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => removeExistingFile(index)}
                    >
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
                    primary={
                      <a href={normalizePath(att.filePath)} download>
                        {att.fileName}
                      </a>
                    }
                    secondary={
                      existingFiles[index]
                        ? `크기: ${(
                            existingFiles[index].size /
                            (1024 * 1024)
                          ).toFixed(2)} MB`
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

        <div className="cs-update-new-attachment">
          <h3>새로 추가된 파일</h3>
          <div className="file-input-wrapper">
            <input
              type="file"
              id="custom-file-input"
              multiple
              onChange={handleFileChange}
              className="file-upload-input"
              hidden
            />
            <label htmlFor="custom-file-input" className="custom-file-label">
              파일 선택
            </label>
          </div>

          {newFiles.length > 0 ? (
            <List>
              {newFiles.map((file, index) => (
                <ListItem
                  key={index}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => removeNewFile(index)}>
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
          ) : (
            <p>추가된 파일이 없습니다.</p>
          )}
        </div>
      </div>
      <div className="total-file-size">
        <p>
          <strong>총 파일 크기:</strong>{" "}
          {(totalFileSize / (1024 * 1024)).toFixed(2)} MB
        </p>
      </div>

      <div className="cs-update-submit-btn">
        <Button
          variant="contained"
          color="primary"
          onClick={submitClickHandler}
          sx={{
            width: "100%",
            backgroundColor: "#2194FF",
            color: "#ffffff",
            fontFamily: "Pretendard",
          }}
        >
          수정하기
        </Button>
      </div>
    </div>
  );
}
