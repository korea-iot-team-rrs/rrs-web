// 커뮤니티 API 응답 인터페이스
export interface CommunityApiResponse<T> {
  result: boolean;
  message: string;
  data: T;
}

export interface CommunityAttachmentData {
  attachmentId: number; // 첨부파일 ID
  communityAttachmentFile?:CommunityAttachment[]
}

// 커뮤니티 첨부파일 데이터 인터페이스
export interface CommunityAttachment {
  attachmentId: number; // 첨부파일 ID
  filePath: string;
  fileName: string;
  fileSize?: number | null;
}
