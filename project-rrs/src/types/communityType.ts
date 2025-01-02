export interface CommunityData {
  userId: number;
  communityId: number;
  nickname: string;
  communityTitle: string;
  communityCreatedAt: Date;
  communityUpdatedAt?: Date;
  communityLikeCount: number;
  communityContent: string;
  communityThumbnailUrl: string;
  comments?: CommunityComment[];
  attachments?: string[]
  userLiked: number[];
}
export interface CommunityComment {
  commentId: number;
  nickname: string;
  communityContent: string;
}

export interface CommunityLikes {
  likeId: number;
  communityId: number;
  userId: number
}