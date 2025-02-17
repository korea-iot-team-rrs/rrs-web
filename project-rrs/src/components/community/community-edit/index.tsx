import { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCommunityById, updateCommunity } from "../../../apis/communityApi";
import { communityAttachmentApi, fetchAttachmentsByCommunityId } from "../../../apis/communityAttachmentApi";
import "../../../styles/community/communityEdit.css";
import useAuthStore from "../../../stores/useAuth.store";
import { FaTrash } from "react-icons/fa";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_TITLE_LENGTH = 30;
const MAX_CONTENT_LENGTH = 1000;
const BASE_FILE_URL = "http://localhost:4040/";

const ErrorMessages = {
  FETCH_FAILED: "게시글 정보를 가져오는 데 실패했습니다.",
  TITLE_TOO_SHORT: "제목은 3자 이상 입력해야 합니다.",
  TITLE_TOO_LONG: "제목은 최대 30자까지 입력할 수 있습니다.",
  CONTENT_TOO_SHORT: "내용은 10자 이상 입력해야 합니다.",
  CONTENT_TOO_LONG: "내용은 최대 1000자까지 입력할 수 있습니다.",
  FILE_TOO_LARGE: "파일 크기가 너무 큽니다. 최대 5MB까지 가능합니다.",
  INVALID_FILE_TYPE: "허용되지 않는 파일 형식입니다.",
  UPDATE_FAILED: "게시글 수정 중 오류가 발생했습니다.",
};

const removeUUIDFromFileName = (fileName: string): string => {
  return fileName.replace(/^[a-f0-9-]{36}_/, ""); // UUID 형식 제거
};

export default function CommunityEdit() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuthStore();
  const { communityId } = useParams<{ communityId: string }>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [communityThumbnailFile, setCommunityThumbnailFile] = useState<File | undefined>(undefined);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [existingAttachments, setExistingAttachments] = useState<
    { attachmentId: number; url: string; name: string }[]
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
          const thumbnailUrl = `${BASE_FILE_URL}${community.communityThumbnailFile.replace(/\\/g, "/")}`;
          setThumbnailPreview(thumbnailUrl);
        }

        const attachments = await fetchAttachmentsByCommunityId(communityIdNumber);
        const attachmentUrls = attachments.map((attachment) => ({
          attachmentId: attachment.attachmentId,
          url: `${BASE_FILE_URL}${attachment.filePath}`,
          name: attachment.fileName,
        }));
        setExistingAttachments(attachmentUrls);
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
      setAttachments((prev) => [...prev, ...validFiles.filter((file) => !prev.includes(file))]);
    }
  };

  const handleRemoveExistingAttachment = async (attachmentId: number) => {
    try {
      await communityAttachmentApi.deleteAttachmentById(attachmentId);
      setExistingAttachments((prev) => prev.filter((attachment) => attachment.attachmentId !== attachmentId));
      alert("첨부파일이 삭제되었습니다.");
    } catch {
      alert("첨부파일 삭제에 실패했습니다.");
    }
  };

  const handleRemoveAllExistingAttachments = async () => {
    const communityId = communityIdNumber;
    if (!communityId) return;

    try {
      await communityAttachmentApi.deleteAttachmentsByCommunityId(communityId);
      setExistingAttachments([]);
      alert("전체 첨부파일이 삭제되었습니다.");
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
    if (title.trim().length > MAX_TITLE_LENGTH) {
      setError(ErrorMessages.TITLE_TOO_LONG);
      return;
    }
    if (content.trim().length < 10) {
      setError(ErrorMessages.CONTENT_TOO_SHORT);
      return;
    }
    if (content.trim().length > MAX_CONTENT_LENGTH) {
      setError(ErrorMessages.CONTENT_TOO_LONG);
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
          existingAttachments: existingAttachments.map((attachment) => attachment.url),
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
    <div className="communityEditContainer">
      <h1 className="communityEditTitle">댕소통 수정</h1>
      {error && <p className="communityEditErrorMessage">{error}</p>}
      <form onSubmit={handleSubmit} className="communityEditForm">
        <div className="communityEditFormGroup">
          <label htmlFor="title">제목 (최대 30자)</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={MAX_TITLE_LENGTH}
            required
          />
        </div>
        <div className="communityEditFormGroup">
          <label htmlFor="content">내용 (최대 1000자)</label>
          <textarea
            id="content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="내용을 입력하세요"
            rows={10}
            maxLength={MAX_CONTENT_LENGTH}
            required
          />
        </div>
        <div className="communityEditFormGroup">
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
                className="communityEditThumbnailPreview"
              />
            </div>
          )}
        </div>
        <div className="communityEditFormGroup">
          <label>기존 첨부 파일</label>
          <ul className="communityEditFileList">
            {existingAttachments.map((attachment) => (
              <li key={attachment.attachmentId} className="communityEditFileItem">
                <span>{attachment.name}</span>
                <button
                  type="button"
                  className="communityEditFileRemoveButton"
                  onClick={() => handleRemoveExistingAttachment(attachment.attachmentId)}
                >
                  <FaTrash />
                </button>
              </li>
            ))}
          </ul>
          {existingAttachments.length > 0 && (
            <button
              type="button"
              className="communityEditFileRemoveButton"
              onClick={handleRemoveAllExistingAttachments}
            >
              <FaTrash /> 전체 삭제
            </button>
          )}
        </div>
        <div className="communityEditFormGroup">
          <label htmlFor="attachments">새 첨부 파일</label>
          <input
            type="file"
            id="attachments"
            onChange={handleFileChange}
            multiple
            accept="image/*,application/pdf"
            className="communityEditCustomFileInput"
          />
          {attachments.length > 0 && (
            <ul className="communityEditFileList">
              {attachments.map((file, index) => (
                <li key={index} className="communityEditFileItem">
                  <span>{file.name}</span>
                  <button
                    type="button"
                    className="communityEditFileRemoveButton"
                    onClick={() =>
                      setAttachments((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="communityEditButtonGroup">
          <button
            type="submit"
            className="communityEditSubmitButton"
            disabled={isSubmitting}
          >
            {isSubmitting ? "수정 중..." : "수정"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="communityEditCancelButton"
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
}
