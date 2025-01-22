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
  existingAttachments : File[];
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

