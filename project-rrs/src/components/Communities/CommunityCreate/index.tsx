import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../../../stores/auth.store";
import { createCommunity } from "../../../apis/communityApi";
import "../../../styles/CommunityCreate.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 최대 파일 크기: 5MB

export default function CommunityCreate() {
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
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview); // 메모리 누수 방지
      }
    };
  }, [thumbnailPreview]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "content") setContent(value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, isThumbnail = false) => {
    const files = e.target.files; // FileList | null 타입
    if (files) {
      const fileArray = Array.from(files); // FileList를 배열로 변환

      // 썸네일 파일 처리
      if (isThumbnail) {
        const file = fileArray[0];
        if (file && file.size > MAX_FILE_SIZE) {
          alert("파일 크기가 너무 큽니다. 최대 5MB까지 가능합니다.");
          return;
        }
        setCommunityThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
      } else {
        // 첨부 파일 처리
        const validFiles = fileArray.filter((file) => file.size <= MAX_FILE_SIZE);

        if (validFiles.length !== fileArray.length) {
          alert("일부 파일이 너무 큽니다. 최대 5MB까지 업로드할 수 있습니다.");
        }

        setAttachments((prev) => [...prev, ...validFiles]);
      }
    }
  };

  // 파일 삭제 핸들러
  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // 서버에 커뮤니티 생성 요청
      const newCommunity = await createCommunity(
        title,
        content,
        communityThumbnailFile,
        attachments
      );

      alert("커뮤니티 게시글이 성공적으로 생성되었습니다!");
      navigate(`/community/${newCommunity.communityId}`);
    } catch (err: any) {
      console.error("커뮤니티 생성 실패:", err);
      setError("게시글 생성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="community-create-container">
      <h1 className="community-create-title">댕소통 글쓰기</h1>
      <form onSubmit={handleSubmit} className="community-create-form">
        {/* 제목 입력 */}
        <div className="community-create-form-group">
          <label htmlFor="title" className="community-create-label">
            제목
          </label>
          <input
            type="text"
            id="title"
            name="title"
            className="community-create-input"
            value={title}
            onChange={handleInputChange}
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
            name="content"
            className="community-create-textarea"
            value={content}
            onChange={handleInputChange}
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
            onChange={(e) => handleFileChange(e, true)}
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
            onChange={(e) => handleFileChange(e)}
            multiple
            accept="image/*,application/pdf"
          />
          {attachments.length > 0 && (
            <ul>
              {attachments.map((file, index) => (
                <li key={index}>
                  {file.name}{" "}
                  <button type="button" onClick={() => removeFile(index)}>
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "등록 중..." : "등록"}
        </button>
      </form>
    </div>
  );
}
