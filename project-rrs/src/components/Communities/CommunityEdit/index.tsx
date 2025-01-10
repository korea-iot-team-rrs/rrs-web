import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../../../stores/auth.store";
import { getCommunityById, updateCommunity } from "../../../apis/communityApi";
import AttachmentsController from "../AttachmentsController";
import { communityAttachmentApi } from "../../../apis/communityAttachmentApi";
import "../../../styles/communities/CommunityEdit.css";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const BASE_FILE_URL = "http://localhost:4040/";

const ErrorMessages = {
  FETCH_FAILED: "게시글 정보를 가져오는 데 실패했습니다.",
  TITLE_TOO_SHORT: "제목은 3자 이상 입력해야 합니다.",
  CONTENT_TOO_SHORT: "내용은 10자 이상 입력해야 합니다.",
  FILE_TOO_LARGE: "파일 크기가 너무 큽니다. 최대 5MB까지 가능합니다.",
  INVALID_FILE_TYPE: "허용되지 않는 파일 형식입니다.",
  UPDATE_FAILED: "게시글 수정 중 오류가 발생했습니다.",
};

const removeUUIDFromFileName = (fileName: string): string => {
  return fileName.replace(/^[a-f0-9-]{36}_/, ""); // UUID 형식 제거
};

const extractFileName = (filePath: string): string => {
  const fullName = filePath.split("/").pop() || "알 수 없는 파일";
  return removeUUIDFromFileName(fullName);
};

export default function CommunityEdit() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { communityId } = useParams<{ communityId: string }>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communityThumbnailFile, setCommunityThumbnailFile] = useState<
    File | undefined
  >(undefined);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<
    { url: string; name: string }[]
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

  const communityIdNumber = communityId ? Number(communityId) : null;

  useEffect(() => {
    if (!isLoggedIn) navigate("/login", { replace: true });
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!communityIdNumber) {
      setError(ErrorMessages.FETCH_FAILED);
      return;
    }

    (async () => {
      try {
        const community = await getCommunityById(communityIdNumber);
        setTitle(community.communityTitle);
        setContent(community.communityContent);

        if (community.communityThumbnailFile) {
          const thumbnailUrl = `${BASE_FILE_URL}${community.communityThumbnailFile.replace(
            /\\/g,
            "/"
          )}`;
          setThumbnailPreview(thumbnailUrl);
        }

        if (community.attachments) {
          const attachmentUrls = community.attachments.map(
            (attachment: any) => {
              const filePath =
                typeof attachment === "string" ? attachment : attachment.url;
              return {
                url: `${BASE_FILE_URL}${filePath.replace(/\\/g, "/")}`,
                name: extractFileName(filePath),
              };
            }
          );
          setExistingAttachments(attachmentUrls);
        }
      } catch {
        setError(ErrorMessages.FETCH_FAILED);
      }
    })();
  }, [communityIdNumber]);

  const validateFile = (file: File): boolean => {
    const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      alert(ErrorMessages.INVALID_FILE_TYPE);
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert(ErrorMessages.FILE_TOO_LARGE);
      return false;
    }
    return true;
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    isThumbnail = false
  ) => {
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
      setAttachments((prev) => [
        ...prev,
        ...validFiles.filter((file) => !prev.includes(file)),
      ]);
    }
  };

  const handleRemoveAttachment = async (updatedUrls: string[]) => {
    const updatedAttachments = updatedUrls
      .map((url) => {
        const matchingAttachment = existingAttachments.find(
          (attachment) => attachment.url === url
        );
        return matchingAttachment ? { ...matchingAttachment } : null;
      })
      .filter(Boolean) as { url: string; name: string }[];
    setExistingAttachments(updatedAttachments);
  };

  const handleRemoveAllAttachments = async () => {
    const communityId = communityIdNumber;
    if (!communityId) return;

    try {
      await communityAttachmentApi.deleteAttachmentsByCommunityId(communityId);
      setExistingAttachments([]);
    } catch {
      alert("전체 첨부파일 삭제에 실패했습니다.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.trim().length < 3) {
      setError(ErrorMessages.TITLE_TOO_SHORT);
      return;
    }
    if (content.trim().length < 10) {
      setError(ErrorMessages.CONTENT_TOO_SHORT);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (communityIdNumber) {
        await updateCommunity(communityIdNumber, {
          communityTitle: title,
          communityContent: content,
          communityThumbnailFile,
          attachments,
          existingAttachments: existingAttachments.map(
            (attachment) => attachment.url
          ),
        });

        alert("게시글이 성공적으로 수정되었습니다!");
        navigate(`/community/${communityIdNumber}`);
      }
    } catch {
      setError(ErrorMessages.UPDATE_FAILED);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (communityIdNumber) {
      navigate(`/community/${communityIdNumber}`);
    }
  };

  return (
    <div className="community-edit-container">
      <h1 className="community-edit-title">게시글 수정</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="community-edit-form">
        <div className="form-group">
          <label htmlFor="title">제목</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="content">내용</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={10}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="thumbnail">썸네일 이미지</label>
          <input
            type="file"
            id="thumbnail"
            onChange={(e) => handleFileChange(e, true)}
            accept="image/*"
          />
          {thumbnailPreview && (
            <div>
              <p>현재 썸네일:</p>
              <img
                src={thumbnailPreview}
                alt="썸네일 미리보기"
                className="thumbnail-preview"
              />
            </div>
          )}
        </div>
        <div className="form-group">
          <AttachmentsController
            attachments={existingAttachments.map(
              (attachment) => attachment.url
            )}
            communityId={communityIdNumber!}
            onRemove={handleRemoveAttachment}
            onRemoveAll={handleRemoveAllAttachments}
          />
        </div>
        <div className="form-group">
          <label htmlFor="attachments">새 첨부 파일</label>
          <input
            type="file"
            id="attachments"
            onChange={handleFileChange}
            multiple
            accept="image/*,application/pdf"
            className="custom-file-input"
          />
          {attachments.length > 0 && (
            <ul className="file-list">
              {attachments.map((file, index) => (
                <li key={index} className="file-item">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="file-remove-button"
                    onClick={() =>
                      setAttachments((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="button-group">
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "수정 중..." : "수정"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="cancel-button"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
