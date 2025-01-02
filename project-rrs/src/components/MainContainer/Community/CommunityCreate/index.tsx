// src/components/Community/CommunityCreate.tsx
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from '../../../../stores/auth.store';
import { createCommunity } from "../../../../apis/communityApi";
import { uploadFile } from "../../../CommunityUploadFile";
import '../../../../styles/CommunityCreate.css';
import axios from 'axios';
import { MAIN_URL } from '../../../../constants';

export default function CommunityCreate() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  // 썸네일 파일 선택 핸들러
  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files[0]) {
      const file: File = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // 첨부 파일 선택 핸들러
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      const filesArray: File[] = Array.from(e.target.files);

      // 파일 크기 제한 (예: 5MB)
      const maxSize: number = 5 * 1024 * 1024;
      const validFiles: File[] = filesArray.filter(file => file.size <= maxSize);

      if (validFiles.length !== filesArray.length) {
        alert("일부 파일이 너무 큽니다. 최대 5MB까지 업로드할 수 있습니다.");
      }

      setAttachments(validFiles);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let thumbnailUrl: string = "";

      // 썸네일 파일 업로드
      if (thumbnailFile) {
        const uploadedThumbnailUrl: string = await uploadFile(thumbnailFile, 'community-thumbnail');
        // 업로드된 썸네일 URL을 서버의 절대 URL로 변환 (예: http://localhost:4040/uploads/file/community-thumbnail/uniqueFileName.jpg)
        thumbnailUrl = `${MAIN_URL}${uploadedThumbnailUrl}`;
      } else {
        // 썸네일 파일이 없는 경우 기본값 사용 (백엔드에서 기본 썸네일을 제공하도록 설정되어 있다면 이 부분을 생략 가능)
        thumbnailUrl = `${MAIN_URL}/uploads/file/community-thumbnail/default-thumbnail.jpg`;
      }

      let attachmentUrls: string[] = [];

      // 첨부 파일 업로드
      if (attachments.length > 0) {
        const uploadPromises: Promise<string>[] = attachments.map((file: File) => uploadFile(file, 'community'));
        const uploadedUrls: string[] = await Promise.all(uploadPromises);
        // 업로드된 첨부 파일 URL들을 배열로 저장
        attachmentUrls = uploadedUrls.map((url: string) => `${MAIN_URL}${url}`);
      }

      const newCommunity = await createCommunity(
        title,
        content,
        thumbnailUrl,
        attachmentUrls
      );

      // 성공 시, 커뮤니티 상세 페이지로 이동
      navigate(`/community/${newCommunity.communityId}`);
    } catch (err: any) {
      console.error("커뮤니티 생성 실패:", err);
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
      <h1 className="community-create-title">댕소통 글쓰기</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="community-create-form">
        {/* 제목 입력 */}
        <div className="community-create-form-group">
          <label htmlFor="title" className="community-create-label">제목</label>
          <input
            type="text"
            id="title"
            className="community-create-input"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        {/* 내용 입력 */}
        <div className="community-create-form-group">
          <label htmlFor="content" className="community-create-label">내용</label>
          <textarea
            id="content"
            className="community-create-textarea"
            value={content}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={10}
            required
          ></textarea>
        </div>

        {/* 썸네일 이미지 입력 */}
        <div className="community-create-form-group">
          <label htmlFor="thumbnail" className="community-create-label">썸네일 이미지</label>
          <input
            type="file"
            id="thumbnail"
            className="community-create-input"
            onChange={handleThumbnailChange}
            accept="image/*"
          />
          {thumbnailFile && (
            <>
              <p className="community-create-attachment-name">선택된 썸네일: {thumbnailFile.name}</p>
              <img src={thumbnailPreview} alt="썸네일 미리보기" className="thumbnail-preview" />
            </>
          )}
        </div>

        {/* 첨부 파일 입력 */}
        <div className="community-create-form-group">
          <label htmlFor="attachments" className="community-create-label">첨부 파일</label>
          <input
            type="file"
            id="attachments"
            className="community-create-input"
            onChange={handleFileChange}
            multiple
            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" // 필요한 파일 타입 추가
          />
          {attachments.length > 0 && (
            <ul className="community-create-attachments-list">
              {attachments.map((file: File, index: number) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          )}
        </div>

        {/* 오류 메시지 표시 */}
        {error && <p className="community-create-error-message">{error}</p>}

        {/* 제출 버튼 */}
        <button
          type="submit"
          className="community-create-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "등록 중..." : "등록"}
        </button>
      </form>
    </div>
  );
}
