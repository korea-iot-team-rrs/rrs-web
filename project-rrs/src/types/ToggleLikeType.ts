export interface ToggleLikeData {
  likeCount: number;    // 현재 좋아요 수
  userLiked: boolean;   // 사용자가 좋아요를 했는지 여부
  nickname: string;     // 사용자 닉네임
}

export interface CommunityLikeResponseDto {
  communityId: number; // 커뮤니티 ID
  nickname: string;    // 사용자 닉네임
}
