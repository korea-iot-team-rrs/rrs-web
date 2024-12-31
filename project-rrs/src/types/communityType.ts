export interface CommunityData {
  communityId: number;
  nickname: string;
  communityTitle: string;
  communityCreatedAt: Date;
  communityUpdatedAt?: Date;
  communityLikeCount?: number;
  communityContent: string;
  communityThumbnailUrl: string;
  comments?: CommunityComment[];
  attachments?: string[]
}
export interface CommunityComment {
  commentId: number;
  nickname: string;
  communityContent: string;
}
