import axios from "axios";
import { CommunityComment } from "../types/commentType";
import { MAIN_URL, USER_PATH } from "../constants";
import { getToken } from "../utils/auth";

const COMMUNITY_COMMENT_API_URL = `${MAIN_URL}${USER_PATH}/community/comment`;

export const createComment = async (
  communityId: number,
  communityCommentContent: string
) => {
  const token = getToken();
  const response = await axios.post<{ data: CommunityComment }>(
    `${COMMUNITY_COMMENT_API_URL}/${communityId}`,
    {
      communityCommentContent,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data.data;
};

export const updateComment = async (
  communityId: number,
  commentId: number,
  data: Partial<{
    communityCommentContent: string;
    token: string;
  }>
) => {
  const token = getToken();
  const response = await axios.put<{ data: CommunityComment }>(
    `${COMMUNITY_COMMENT_API_URL}/${communityId}/${commentId}`,
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

export const getCommentsByCommunity = async (communityId: number) => {
  const token = getToken();
  const response = await axios.get<{ data: CommunityComment }>(
    `${COMMUNITY_COMMENT_API_URL}/${communityId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const deleteCommentFromCommunity = async (
  communityId: number,
  commentId: number
) => {
  const token = getToken();
  const response = await axios.delete(
    `${COMMUNITY_COMMENT_API_URL}/${communityId}/${commentId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
