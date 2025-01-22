import axios from "axios";
import {
  ToggleLikeData,
  CommunityLikeResponseDto,
} from "../types/toggleLikeType";
import { MAIN_URL, USER_PATH } from "../constants/index";
import { getToken } from "../utils/auth";

const COMMUNITY_LIKE_API_URL = `${MAIN_URL}${USER_PATH}/community`;

export const toggleLike = async (communityId: number) => {
  const token = getToken();
  const response = await axios.post<{ data: ToggleLikeData }>(
    `${COMMUNITY_LIKE_API_URL}/like/${communityId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const getUsersWhoLikedCommunity = async (communityId: number) => {
  const token = getToken();
  const response = await axios.get<{ data: CommunityLikeResponseDto[] }>(
    `${COMMUNITY_LIKE_API_URL}/like/${communityId}/likes`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};
