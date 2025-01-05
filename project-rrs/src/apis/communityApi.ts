import axios from "axios";
import { CommunityData } from "../types/communityType";
import { MAIN_URL, USER_PATH } from "../constants";
import { getToken } from "../utils/auth";

const COMMUNITY_API_URL = `${MAIN_URL}${USER_PATH}/community`;

// 커뮤니티 생성
export const createCommunity = async (
  communityTitle: string,       // 변경된 부분
  communityContent: string,     // 변경된 부분
  communityThumbnailFile: string,
  attachments: string[]
): Promise<CommunityData> => {
  const token = getToken();

  if (!token) {
    throw new Error('인증 토큰이 없습니다. 로그인을 먼저 해주세요.');
  }

  try {
    const response = await axios.post<{ data: CommunityData }>(
      `${COMMUNITY_API_URL}/write`,
      {
        communityTitle: communityTitle,         // 변경된 부분
        communityContent: communityContent,     // 변경된 부분
        communityThumbnailFile: communityThumbnailFile,
        attachmentUrls: attachments,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error('커뮤니티 생성 실패:', error);
    throw error;
  }
};

// 좋아요 토글
export const toggleLike = async (
  communityId: number
): Promise<{ likeCount: number; userLiked: boolean; userId: number }> => {
  const token = getToken();

  if (!token) {
    throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
  }

  try {
    const response = await axios.post<{
      data: { likeCount: number; userLiked: boolean; userId: number };
    }>(
      `${COMMUNITY_API_URL}/like/${communityId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data; // 좋아요 상태와 최신 좋아요 수 반환
  } catch (error: any) {
    console.error("좋아요 토글 실패:", error.response?.data || error.message);
    throw error.response?.data?.message || "좋아요 토글 중 오류가 발생했습니다.";
  }
};

// 커뮤니티 업데이트
export const updateCommunity = async (
  communityId: number,
  data: Partial<{
    communityTitle: string;           // 변경된 부분
    communityContent: string;         // 변경된 부분
    communityThumbnailFile: string;
    attachments: string;
  }>
): Promise<CommunityData> => {
  const token = getToken();
  const response = await axios.put<{ data: CommunityData }>(
    `${COMMUNITY_API_URL}/${communityId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

// 모든 커뮤니티 가져오기
export const getCommunity = async (): Promise<CommunityData[]> => {
  const response = await axios.get<{ data: CommunityData[] }>(
    COMMUNITY_API_URL
  );
  return response.data.data;
};

// ID로 특정 커뮤니티 가져오기
export const getCommunityById = async (communityId: number): Promise<CommunityData> => {
  const token = getToken();
  const response = await axios.get<{ data: CommunityData }>(
    `${COMMUNITY_API_URL}/${communityId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

// 커뮤니티 삭제
export const deleteCommunity = async (communityId: number) => {
  const token = getToken();
  const response = await axios.delete(`${COMMUNITY_API_URL}/${communityId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
