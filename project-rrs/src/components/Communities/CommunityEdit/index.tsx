import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../stores/auth.store";
import { updateCommunity } from "../../../apis/communityApi";
import { uploadFile } from "../../CommunityUploadFile";
import "../../../styles/CommunityCreate.css";
import axios from "axios";
import { MAIN_URL } from "../../../constants";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 최대 파일 크기: 5MB

export default function CommunityUpdate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [communityThumbnailFile, setCommunityThumbnailFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", { replace: true });
    }

    // 기존 커뮤니티 데이터 로드 (수정 시 초기값 설정)
    const fetchCommunityData = async () => {
      try {
        const response = await axios.get(`${MAIN_URL}/community/${id}`);
        const data = response.data.data;
        setTitle(data.communityTitle);
        setContent(data.communityContent);
        setThumbnailPreview(`${MAIN_URL}/${data.communityThumbnailFile}`);
        setAttachments(data.attachments || []);
      } catch (err) {
        console.error("커뮤니티 데이터 로드 실패:", err);
        navigate("/community", { replace: true });
      }
    };

    fetchCommunityData();
  }, [id, isLoggedIn, navigate]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview); // 메모리 누수 방지
      }
    };
  }, [thumbnailPreview]);

  // 파일 처리 핸들러
  const handleFileChange = <T extends File | File[] | null>(
    e: ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<T>>,
    single: boolean = false
  ): void => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);

      // 파일 크기 제한
      const validFiles = filesArray.filter((file) => file.size <= MAX_FILE_SIZE);

      if (validFiles.length !== filesArray.length) {
        alert("일부 파일이 너무 큽니다. 최대 5MB까지 업로드할 수 있습니다.");
      }

      // 단일 파일 처리
      if (single) {
        setter(validFiles[0] as T); // File | null 타입으로 캐스팅
        if (validFiles[0]) {
          setThumbnailPreview(URL.createObjectURL(validFiles[0]));
        }
      } else {
        setter(validFiles as T); // File[] 타입으로 캐스팅
      }
    }
  };

  // 제출 핸들러
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
  
    try {
      const thumbnailFile = communityThumbnailFile
        ? `${MAIN_URL}${await uploadFile(communityThumbnailFile, "community-thumbnail")}`
        : undefined;
  
      const attachmentUrls = attachments.length
        ? await Promise.all(
            attachments.map((file) =>
              uploadFile(file, "community").then((url) => `${MAIN_URL}/upload${url}`)
            )
          )
        : undefined;
  
      // attachments를 JSON 문자열로 변환
      const updatedData = {
        communityTitle: title,
        communityContent: content,
        communityThumbnailFile: thumbnailFile,
        attachments: attachmentUrls ? JSON.stringify(attachmentUrls) : undefined,
      };
  
      await updateCommunity(Number(id), updatedData);
  
      alert("커뮤니티 게시글이 성공적으로 업데이트되었습니다.");
      navigate(`/community/${id}`);
    } catch (err: any) {
      console.error("커뮤니티 업데이트 실패:", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "서버와의 통신에 실패했습니다.");
      } else {
        setError("예상치 못한 오류가 발생했습니다.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="community-create-container">
      <h1 className="community-create-title">댕소통 글 수정</h1>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="community-create-form"
      >
        {/* 제목 입력 */}
        <div className="community-create-form-group">
          <label htmlFor="title" className="community-create-label">
            제목
          </label>
          <input
            type="text"
            id="title"
            className="community-create-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        {/* 내용 입력 */}
        <div className="community-create-form-group">
          <label htmlFor="content" className="community-create-label">
            내용
          </label>
          <textarea
            id="content"
            className="community-create-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={10}
            required
          ></textarea>
        </div>

        {/* 썸네일 입력 */}
        <div className="community-create-form-group">
          <label htmlFor="thumbnail" className="community-create-label">
            썸네일 이미지
          </label>
          <input
            type="file"
            id="thumbnail"
            className="community-create-input"
            onChange={(e) => handleFileChange(e, setCommunityThumbnailFile, true)}
            accept="image/*"
          />
          {thumbnailPreview && (
            <>
              <p>선택된 썸네일:</p>
              <img src={thumbnailPreview} alt="썸네일 미리보기" />
            </>
          )}
        </div>

        {/* 첨부 파일 입력 */}
        <div className="community-create-form-group">
          <label htmlFor="attachments" className="community-create-label">
            첨부 파일
          </label>
          <input
            type="file"
            id="attachments"
            className="community-create-input"
            onChange={(e) => handleFileChange(e, setAttachments)}
            multiple
            accept="image/*,application/pdf"
          />
          {attachments.length > 0 && (
            <ul>
              {attachments.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "업데이트 중..." : "업데이트"}
        </button>
      </form>
    </div>
  );
}
