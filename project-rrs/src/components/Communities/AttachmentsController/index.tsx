import React from "react";
import {
  fetchAttachmentsByCommunityId,
  communityAttachmentApi,
} from "../../../apis/communityAttachmentApi";
import { FaTrash } from "react-icons/fa"; // 삭제 아이콘 추가

const removeUUIDFromFileName = (fileName: string): string => {
  return fileName.replace(/^[a-f0-9-]{36}_/, "");
};

interface AttachmentsControllerProps {
  attachments: string[];
  communityId: number;
  onRemove: (updatedAttachments: string[]) => void;
  onRemoveAll: () => void;
}

export default function AttachmentsController({
  attachments,
  communityId,
  onRemove,
  onRemoveAll,
}: AttachmentsControllerProps) {
  const handleRemove = async (index: number) => {
    const attachmentUrl = attachments[index];
    const fileName = attachmentUrl.split("/").pop();

    try {
      const serverAttachments = await fetchAttachmentsByCommunityId(
        communityId
      );

      const matchingAttachment = serverAttachments.find(
        (attachment) =>
          removeUUIDFromFileName(attachment.fileName) ===
          removeUUIDFromFileName(fileName || "")
      );

      if (!matchingAttachment) {
        throw new Error("해당 첨부파일을 서버에서 찾을 수 없습니다.");
      }

      const message = await communityAttachmentApi.deleteAttachmentById(
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
        await communityAttachmentApi.deleteAttachmentsByCommunityId(
          communityId
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
            {attachments.map((attachment, index) => (
              <li key={index} className="attachment-item">
                <a href={attachment} target="_blank" rel="noopener noreferrer">
                  {removeUUIDFromFileName(
                    attachment.split("/").pop() || "알 수 없는 파일"
                  )}
                </a>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemove(index)}
                >
                  <FaTrash /> {/* 삭제 아이콘 */}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="remove-all-button"
            onClick={handleRemoveAll}
          >
            <FaTrash /> 전체 삭제 {/* 전체 삭제 아이콘 추가 */}
          </button>
        </>
      ) : (
        <p>첨부파일이 없습니다.</p>
      )}
    </div>
  );
}
