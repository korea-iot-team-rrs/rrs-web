// apis

import axios from "axios";
import { CommunityComment } from "../types/commentType";
import { MAIN_URL, USER_PATH } from "../constants";

const COMMUNITY_COMMENT_API_URL = `${MAIN_URL}${USER_PATH}/community/comment`;

export const TOKEN: string =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVzIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM1NjAzMzkxLCJleHAiOjE3MzU2MzkzOTF9.thuuJITGeagXvPcMHp2LZ7Q92HsmAgGulijp-2pO5fc";

export const createComment = async (
  communityId: number,
  communityCommentContent: string,
  token: string
) => {
  const response = await axios.post<{ data: CommunityComment }>(
    `${COMMUNITY_COMMENT_API_URL}/${communityId}`,
    {
      communityCommentContent
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
  data: Partial<{
    communityCommentContent: string,
    token: string
  }>,
  token: string
) => {
  const response = await axios.put<{ data: CommunityComment }>(
    `${COMMUNITY_COMMENT_API_URL}/${communityId}`,
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

export const getCommentsByCommunity = async (
  communityId: number,
  token:string
) => {
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

export const deleteCommentFromCommunity = async (communityId: number, token: string) => {
  const response = await axios.delete(`${COMMUNITY_COMMENT_API_URL}/${communityId}}`,
    {headers: {
      Authorization: `Berarer ${token}`
    }}
  );
  return response.data;
};
