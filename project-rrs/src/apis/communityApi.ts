import axios from "axios";
import { CommunityData } from "../types/communityType";
import { MAIN_URL, USER_PATH } from "../constants";
import { getToken } from "../utils/auth";

const COMMUNITY_API_URL = `${MAIN_URL}${USER_PATH}/community`;

export const createCommunity = async (
  communityTitle: string,
  communityContent: string,
  communityThumbnailFile: File | null,
  attachments: File[]
): Promise<CommunityData> => {
  const token = getToken();

  if (!token) {
    throw new Error('인증 토큰이 없습니다. 로그인을 먼저 해주세요.');
  }

  try {
    const formData = new FormData();

    formData.append('communityTitle', communityTitle);
    formData.append('communityContent', communityContent);

    if (communityThumbnailFile) {
      formData.append('communityThumbnailFile', communityThumbnailFile);
    }

    attachments.forEach((file) => {
      formData.append('attachments', file);
    });

    const response = await axios.post<{ data: CommunityData }>(
      `${COMMUNITY_API_URL}/write`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
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

    return response.data.data;
  } catch (error: any) {
    console.error("좋아요 토글 실패:", error.response?.data || error.message);
    throw error.response?.data?.message || "좋아요 토글 중 오류가 발생했습니다.";
  }
};

export const updateCommunity = async (
  communityId: number,
  data: {
    communityTitle?: string;
    communityContent?: string;
    communityThumbnailFile?: File;
    attachments?: File[];
  }
): Promise<CommunityData> => {
  const token = getToken();

  const formData = new FormData();
  if (data.communityTitle) formData.append("communityTitle", data.communityTitle);
  if (data.communityContent) formData.append("communityContent", data.communityContent);
  if (data.communityThumbnailFile) {
    formData.append("communityThumbnailFile", data.communityThumbnailFile);
  }
  if (data.attachments && data.attachments.length > 0) {
    data.attachments.forEach((file, index) => {
      formData.append(`attachments[${index}]`, file);
    });
  }

  try {
    const response = await axios.put<{ data: CommunityData }>(
      `${COMMUNITY_API_URL}/edit/${communityId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error updating community:", error);
    throw new Error("게시글을 수정하는데 실패하였습니다.");
  }
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
  const response = await axios.delete(`${COMMUNITY_API_URL}/delete/${communityId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
