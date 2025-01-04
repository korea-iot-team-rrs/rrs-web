import axios from "axios";
import { CommunityData } from "../types/communityType";
import { MAIN_URL, USER_PATH } from "../constants";
import { getToken } from "../utils/auth";

const COMMUNITY_API_URL = `${MAIN_URL}${USER_PATH}/community`;

export const createCommunity = async (
  title: string,
  content: string,
  thumbnailUrl: string,
  attachmentUrls: string[]
): Promise<CommunityData> => {
  const token = getToken();

  if (!token) {
    throw new Error('인증 토큰이 없습니다. 로그인을 먼저 해주세요.');
  }

  try {
    const response = await axios.post<{ data: CommunityData }>(
      `${COMMUNITY_API_URL}/create`,
      {
        communityTitle: title,
        communityContent: content,
        communityThumbnailUrl: thumbnailUrl,
        attachmentUrls: attachmentUrls,
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

export const toggleLike = async (
  communityId: number
): Promise<number> => {
  const token = getToken();

  if (!token) {
    throw new Error('인증 토큰이 없습니다. 로그인을 먼저 해주세요.');
  }

  try {
    const response = await axios.post<{ data: number }>(
      `${COMMUNITY_API_URL}/like/${communityId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data; // 최신 좋아요 수 반환
  } catch (error: any) {
    console.error('좋아요 토글 실패:', error);
    throw error;
  }
};

export const updateCommunity = async (
  communityId: number,
  data: Partial<{
    communityTitle: string;
    communityContent: string;
    communityThumbnailUrl: string;
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

export const getCommunity = async (): Promise<CommunityData[]> => {
  const response = await axios.get<{ data: CommunityData[] }>(
    COMMUNITY_API_URL
  );
  return response.data.data;
};

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

export const deleteCommunity = async (communityId: number) => {
  const token = getToken();
  const response = await axios.delete(`${COMMUNITY_API_URL}/${communityId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
