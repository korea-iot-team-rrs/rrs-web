export interface CommunityData {
  userId: number;
  communityId: number;
  nickname: string;
  communityTitle: string;
  communityCreatedAt: Date;
  communityUpdatedAt?: Date;
  communityLikeCount: number;
  communityContent: string;
  communityThumbnailFile?: string;
  comments?: CommunityComment[];
  attachments?: AttachmentData[];
  existingAttachments: File[];
  userLiked: number[];
}

export interface CommunityComment {
  commentId: number;
  nickname: string;
  communityContent: string;
}

export interface AttachmentData {
  filePath: string;
  fileName: string;
  fileSize?: number | null;
}

export interface CommunityLikes {
  likeId: number;
  communityId: number;
  userId: number;
}

// 커뮤니티 API 응답 인터페이스
export interface CommunityApiResponse<T> {
  result: boolean;
  message: string;
  data: T;
}

export interface CommunityAttachmentData {
  attachmentId: number; // 첨부파일 ID
  communityAttachmentFile?: CommunityAttachment[];
}

// 커뮤니티 첨부파일 데이터 인터페이스
export interface CommunityAttachment {
  attachmentId: number; // 첨부파일 ID
  filePath: string;
  fileName: string;
  fileSize?: number | null;
}
