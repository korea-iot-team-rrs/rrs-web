import React from "react";
import { fetchAttachmentsByCommunityId, communityAttachmentApi } from "../../../apis/communityAttachmentApi";

interface AttachmentsControllerProps {
  attachments: string[]; // 로컬 첨부파일 URL 목록
  communityId: number; // 커뮤니티 ID
  onRemove: (updatedAttachments: string[]) => void; // 특정 파일 삭제 후 업데이트된 목록 콜백
  onRemoveAll: () => void; // 전체 파일 삭제 콜백
}

export default function AttachmentsController({
  attachments,
  communityId,
  onRemove,
  onRemoveAll,
}: AttachmentsControllerProps) {
  const handleRemove = async (index: number) => {
    const attachmentUrl = attachments[index];
    const fileName = attachmentUrl.split("/").pop(); // URL에서 파일 이름 추출

    try {
      // 서버에서 첨부파일 목록 가져오기
      const serverAttachments = await fetchAttachmentsByCommunityId(communityId);

      // 서버에서 이름이 일치하는 첨부파일 찾기
      const matchingAttachment = serverAttachments.find(
        (attachment) => attachment.fileName === fileName
      );

      if (!matchingAttachment) {
        throw new Error("해당 첨부파일을 서버에서 찾을 수 없습니다.");
      }

      // ID를 기반으로 첨부파일 삭제
      const message = await communityAttachmentApi.deleteAttachmentById(matchingAttachment.attachmentId);
      console.log(message);

      // 로컬 목록 업데이트
      const updatedAttachments = attachments.filter((_, i) => i !== index);
      onRemove(updatedAttachments);
    } catch (error) {
      console.error("첨부파일 삭제에 실패했습니다:", error);
      alert("첨부파일 삭제에 실패했습니다.");
    }
  };

  const handleRemoveAll = async () => {
    try {
      const message = await communityAttachmentApi.deleteAttachmentsByCommunityId(communityId);
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
                  {attachment.split("/").pop()}
                </a>
                <button
                  type="button"
                  className="remove-button"
                  onClick={() => handleRemove(index)}
                >
                  삭제
                </button>
              </li>
            ))}
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
