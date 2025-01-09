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
  comments?: CommunityComment[]; // 댓글 리스트
  attachments?: AttachmentData[]; // 첨부 파일 리스트로 명확화
  existingAttachments : File[];
  userLiked: number[]; // 좋아요 누른 사용자 ID 배열
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
