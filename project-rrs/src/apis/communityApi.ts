// apis

import axios from "axios";
import { CommunityData } from "../types/communityType";
import { MAIN_URL, USER_PATH } from "../constants";

const COMMUNITY_API_URL = `${MAIN_URL}${USER_PATH}/community`;

export const TOKEN: string =
  "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOjEsInJvbGVzIjoiUk9MRV9VU0VSIiwiaWF0IjoxNzM1MTk0NDEzLCJleHAiOjE3MzUyMzA0MTN9.z4gTrp_NFWDggrL3Uzf7nxKgScEE_UY7uZl2nR81dQw";

export const createCommunity = async (
  communityTitle: string,
  communityContent: string,
  communityThumbnailUrl: string,
  attachments: string,
  token: string
) => {
  const response = await axios.post<{ data: CommunityData }>(
    `${COMMUNITY_API_URL}`,
    {
      communityTitle,
      communityContent,
      communityThumbnailUrl,
      attachments
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

export const updateCommunity = async (
  communityId: number,
  data: Partial<{
    communityTitle: string,
    communityContent: string,
    communityThumbnailUrl: string,
    attachments: string,
    token: string
  }>,
  token: string
) => {
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

export const getCommunity = async () => {
  const response = await axios.get<{ data: CommunityData[] }>(
    COMMUNITY_API_URL
  );
  return response.data.data;
};

export const getCommunityById = async (communityId: number) => {
  const response = await axios.get<{ data: CommunityData }>(
    `${COMMUNITY_API_URL}/${communityId}`
  );
  return response.data.data;
};

export const deleteCommunity = async (communityId: number) => {
  await axios.delete(`${COMMUNITY_API_URL}/${communityId}`);
};
