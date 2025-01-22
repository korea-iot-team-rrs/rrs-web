import React from "react";
import {
  fetchAttachmentsByHealthRecordId,
  healthRecordAttachmentApi,
} from "../../../../../apis/healthRecordAttachment";

const removeUUIDFromFileName = (fileName: string): string => {
  return fileName.replace(/^[a-f0-9-]{36}_/, "");
};

interface HealthAttachmentsControllerProps {
  attachments: string[];
  healthRecordId: number;
  onRemove: (updatedAttachments: string[]) => void;
  onRemoveAll: () => void;
}

export default function HealthAttachmentsController({
  attachments,
  healthRecordId,
  onRemove,
  onRemoveAll,
}: HealthAttachmentsControllerProps) {
  const handleRemove = async (index: number) => {
    const attachmentUrl = attachments[index];
    if (!attachmentUrl) {
      alert("잘못된 첨부파일 URL입니다.");
      return;
    }

    const fileName = attachmentUrl.split("/").pop();
    if (!fileName) {
      alert("파일 이름을 추출할 수 없습니다.");
      return;
    }

    try {
      const serverAttachments = await fetchAttachmentsByHealthRecordId(
        healthRecordId
      );

      const matchingAttachment = serverAttachments.find(
        (attachment) =>
          removeUUIDFromFileName(attachment.fileName) ===
          removeUUIDFromFileName(fileName)
      );

      if (!matchingAttachment) {
        alert("서버에서 해당 첨부파일을 찾을 수 없습니다.");
        return;
      }

      const message = await healthRecordAttachmentApi.deleteAttachmentById(
        matchingAttachment.attachmentId
      );
      console.log(message);

      const updatedAttachments = attachments.filter((_, i) => i !== index);
      onRemove(updatedAttachments);
    } catch (error) {
      console.error("첨부파일 삭제에 실패했습니다:", error);
      alert("첨부파일 삭제에 실패했습니다.");
    }
  };

  const handleRemoveAll = async () => {
    try {
      const message =
        await healthRecordAttachmentApi.deleteAttachmentsByHealthRecordId(
          healthRecordId
        );
      console.log(message);
      onRemoveAll();
    } catch (error) {
      console.error("첨부파일 전체 삭제에 실패했습니다:", error);
      alert("첨부파일 전체 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="attachments-controller">
      <h3>첨부 파일</h3>
      {attachments.length > 0 ? (
        <>
          <ul className="attachments-list">
            {attachments.map((attachment, index) => {
              if (!attachment) return null; // 방어 코드 추가

              const fileName = attachment.split("/").pop();
              const displayName = fileName
                ? removeUUIDFromFileName(fileName)
                : "알 수 없는 파일";

              return (
                <li key={index} className="attachment-item">
                  <a
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {displayName}
                  </a>
                  <button
                    type="button"
                    className="remove-button"
                    onClick={() => handleRemove(index)}
                  >
                    삭제
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="remove-all-button"
            onClick={handleRemoveAll}
          >
            전체 삭제
          </button>
        </>
      ) : (
        <p>첨부파일이 없습니다.</p>
      )}
    </div>
  );
}
