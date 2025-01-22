import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createCommunity } from "../../../apis/communityApi";
import "../../../styles/communities/CommunityCreate.css";
import useAuthStore from "../../../stores/useAuthStore";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const TITLE_MAX_LENGTH = 30;
const CONTENT_MAX_LENGTH = 1000;

export default function CommunityCreate() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [communityThumbnailFile, setCommunityThumbnailFile] =
    useState<File | null>(null);
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
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "title") {
      setTitle(value.slice(0, TITLE_MAX_LENGTH));
    }
    if (name === "content") {
      setContent(value.slice(0, CONTENT_MAX_LENGTH));
    }
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    isThumbnail = false
  ) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);

      if (isThumbnail) {
        const file = fileArray[0];
        if (file && file.size > MAX_FILE_SIZE) {
          alert("파일 크기가 너무 큽니다. 최대 5MB까지 가능합니다.");
          return;
        }
        setCommunityThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
      } else {
        const validFiles = fileArray.filter(
          (file) => file.size <= MAX_FILE_SIZE
        );

        if (validFiles.length !== fileArray.length) {
          alert("일부 파일이 너무 큽니다. 최대 5MB까지 업로드할 수 있습니다.");
        }

        setAttachments((prev) => [...prev, ...validFiles]);
      }
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      setError("제목은 최소 3자 이상 입력해야 합니다.");
      return;
    }
    if (content.trim().length < 10) {
      setError("내용은 최소 10자 이상 입력해야 합니다.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
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
        <div className="community-create-form-group">
          <label htmlFor="title" className="community-create-label">
            제목 (최대 {TITLE_MAX_LENGTH}자)
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
          <p className="character-counter">
            {title.length} / {TITLE_MAX_LENGTH}자
          </p>
        </div>

        <div className="community-create-form-group">
          <label htmlFor="content" className="community-create-label">
            내용 (최대 {CONTENT_MAX_LENGTH}자)
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
          <p className="character-counter">
            {content.length} / {CONTENT_MAX_LENGTH}자
          </p>
        </div>

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

        <button
          className="communityCreateSubmitButton"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "등록 중..." : "등록"}
        </button>
      </form>
    </div>
  );
}
