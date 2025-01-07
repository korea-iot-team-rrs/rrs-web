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

export default function CustomerSupportUpdate() {
  const { id } = useParams<{ id: string }>();
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

  const [updateCs, setUpdateCs] = useState<UpdateCS>({
    customerSupportTitle: "",
    customerSupportContent: "",
    existingFilePaths: [],
    files: [],
  });

  const [existingFiles, setExistingFiles] = useState<{
    filePath: string;
    fileName: string;
  }[]>([]);

  const [newFiles, setNewFiles] = useState<File[]>([]);
  
  const [removedFiles, setRemovedFiles] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setNewFiles((prev) => [...prev, ...files]);
  };

  const removeExistingFile = (index: number) => {
    const fileToRemove = existingFiles[index];
    setRemovedFiles((prev) => [...prev, fileToRemove.filePath]); // 삭제된 파일 추가
    setExistingFiles((prev) => prev.filter((_, i) => i !== index)); // UI 업데이트
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const submitClickHandler = () => {
    const token = cookies.token;
  
    const data: UpdateCS = {
      customerSupportTitle: updateCs.customerSupportTitle,
      customerSupportContent: updateCs.customerSupportContent,
      existingFilePaths: existingFiles.map((file) => file.filePath),
      files: newFiles,
    };
  
    if (id && token) {
      updateCustomerSupport(Number(id), data, token)
        .then(() => {
          alert("수정이 완료 되었습니다.")
          navigate(`/customer-supports/${id}`)
        }).catch((e) => {
          console.error("Failed to edit customer support:", e);
        });
        
    } else {
      console.error("Token or ID is missing.");
    }
  };
  

  useEffect(() => {
    const token = cookies.token;
    if (token && id) {
      const csId = Number(id);
      fetchOneCustomerSupport(csId, token)
        .then(async (response: FetchCS) => {
          setCs(response);
          setUpdateCs({
            customerSupportTitle: response.customerSupportTitle,
            customerSupportContent: response.customerSupportContent,
            existingFilePaths: [],
            files: [],
          });
          setExistingFiles(
            response.fileInfos.map(({ filePath, fileName }) => ({
              filePath,
              fileName,
            }))
          );

          const files = await Promise.all(
            response.fileInfos.map(async ({ filePath, fileName }) => {
              const res = await fetch(filePath);
              const blob = await res.blob();
              return new File([blob], fileName, { type: blob.type });
            })
          );
          setNewFiles(files); 
        })
        .catch((e) => {
          console.error("Failed to fetch customer support:", e);
        });
    }
  }, [id, cookies.token]);

  const normalizePath = (path: string) => {
    const baseUrl =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:4040/";
    return baseUrl + path.replace(/\\/g, "/");
  };

  return (
    <div>
      <h2>{cs.customerSupportTitle}</h2>
      <p>{cs.customerSupportContent}</p>

      <div>
        <h3>기존 첨부 파일</h3>
        {existingFiles.length > 0 ? (
          <List>
            {existingFiles.map((att, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => removeExistingFile(index)}
                  >
                    삭제
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

      <div>
        <h3>새로 추가된 파일</h3>
        <input type="file" multiple onChange={handleFileChange} />
        {newFiles.length > 0 ? (
          <List>
            {newFiles.map((file, index) => (
              <ListItem
                key={index}
                secondaryAction={
                  <IconButton edge="end" onClick={() => removeNewFile(index)}>
                    삭제
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
        ) : (
          <p>추가된 파일이 없습니다.</p>
        )}
      </div>

      <Button variant="contained" color="primary" onClick={submitClickHandler}>
        수정하기
      </Button>
    </div>
  );
}
