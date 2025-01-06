import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../stores/auth.store";
import { getCommunityById, updateCommunity } from "../../../apis/communityApi";
import "../../../styles/CommunityEdit.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 최대 파일 크기: 5MB

export default function CommunityEdit() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { communityId } = useParams<{ communityId: string }>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communityThumbnailFile, setCommunityThumbnailFile] = useState<File | null>(null);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  
  
  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (communityId) {
      (async () => {
        try {
          const community = await getCommunityById(Number(communityId));
          console.log(community)
          setTitle(community.communityTitle);
          setContent(community.communityContent);
          if (community.communityThumbnailFile) {
            setThumbnailPreview(community.communityThumbnailFile);
          }
        } catch (err) {
          console.error("Failed to fetch community details:", err);
          setError("게시글 정보를 가져오는 데 실패했습니다.");
        }
      })();
    }
  }, [communityId]);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "title") setTitle(value);
    if (name === "content") setContent(value);
  };

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) {
      alert("파일 크기가 너무 큽니다. 최대 5MB까지 가능합니다.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, isThumbnail = false) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);

    if (isThumbnail) {
      const file = fileArray[0];
      if (file && validateFile(file)) {
        setCommunityThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
      }
    } else {
      const validFiles = fileArray.filter(validateFile);
      setAttachments((prev) => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim().length < 3 || content.trim().length < 10) {
      setError("제목은 3자 이상, 내용은 10자 이상 입력해야 합니다.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (communityId) {
        await updateCommunity(Number(communityId), {
          communityTitle: title,
          communityContent: content,
          communityThumbnailFile: communityThumbnailFile || undefined,
          attachments,
        });

        alert("게시글이 성공적으로 수정되었습니다!");
        navigate(`/community/${communityId}`);
      }
    } catch (err: any) {
      console.error("게시글 수정 실패:", err);
      setError("게시글 수정 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="community-edit-container">
      <h1 className="community-edit-title">게시글 수정</h1>
      <form onSubmit={handleSubmit} className="community-edit-form">
        {/* 제목 입력 */}
        <div className="community-edit-form-group">
          <label htmlFor="title" className="community-edit-label">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            className="community-edit-input"
            value={title}
            onChange={handleInputChange}
            placeholder="제목을 입력하세요"
            required
          />
        </div>

        {/* 내용 입력 */}
        <div className="community-edit-form-group">
          <label htmlFor="content" className="community-edit-label">내용</label>
          <textarea
            id="content"
            name="content"
            className="community-edit-textarea"
            value={content}
            onChange={handleInputChange}
            placeholder="내용을 입력하세요"
            rows={10}
            required
          ></textarea>
        </div>

        {/* 썸네일 입력 */}
        <div className="community-edit-form-group">
          <label htmlFor="thumbnail" className="community-edit-label">썸네일 이미지</label>
          <input
            type="file"
            id="thumbnail"
            className="community-edit-input"
            onChange={(e) => handleFileChange(e, true)}
            accept="image/*"
          />
          {thumbnailPreview && (
            <div>
              <p>현재 썸네일:</p>
              <img src={thumbnailPreview} alt="썸네일 미리보기" />
            </div>
          )}
        </div>

        {/* 첨부 파일 입력 */}
        <div className="community-edit-form-group">
          <label htmlFor="attachments" className="community-edit-label">첨부 파일</label>
          <input
            type="file"
            id="attachments"
            className="community-edit-input"
            onChange={handleFileChange}
            multiple
            accept="image/*,application/pdf"
          />
          {attachments.length > 0 && (
            <ul>
              {attachments.map((file, index) => (
                <li key={index}>
                  {file.name}
                  <button type="button" onClick={() => removeFile(index)}>삭제</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "수정 중..." : "수정"}
        </button>
      </form>
    </div>
  );
}
