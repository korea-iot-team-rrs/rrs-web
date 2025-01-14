import axios from "axios";
import { HealthRecordApiResponse } from "../types/healthRecordIntefaces";
import { getToken } from "../utils/auth";

const API_BASE_URL = "http://localhost:4040/api/v1/health-attachments";

export const fetchAttachmentsByHealthRecordId = async (
  healthRecordId: number
): Promise<
  Array<{
    attachmentId: number;
    filePath: string;
    fileName: string;
    fileSize?: number | null;
  }>
> => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
    }

    const response = await axios.get<
      HealthRecordApiResponse<
        Array<{ attachmentId: number; healthRecordAttachmentFile: string }>
      >
    >(`${API_BASE_URL}/health-record/${healthRecordId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.data.result) {
      console.log("Attachments fetched successfully:", response.data.data);

      return response.data.data.map((attachment) => ({
        attachmentId: attachment.attachmentId,
        filePath: attachment.healthRecordAttachmentFile,
        fileName: attachment.healthRecordAttachmentFile.split("/").pop() || "",
        fileSize: null,
      }));
    } else {
      throw new Error(response.data.message || "Failed to fetch attachments.");
    }
  } catch (error) {
    console.error("Error fetching attachments:", error);
    throw error;
  }
};

export const healthRecordAttachmentApi = {
  async deleteAttachmentById(attachmentId: number): Promise<string> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
      }

      const response = await axios.delete<HealthRecordApiResponse<string>>(
        `${API_BASE_URL}/${attachmentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.message;
    } catch (error) {
      console.error("Error deleting attachment:", error);
      throw error;
    }
  },

  async deleteAttachmentsByHealthRecordId(
    healthRecordId: number
  ): Promise<string> {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("인증 토큰이 없습니다. 로그인을 먼저 해주세요.");
      }

      const response = await axios.delete<HealthRecordApiResponse<string>>(
        `${API_BASE_URL}/health-record/${healthRecordId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.message;
    } catch (error) {
      console.error("Error deleting all attachments for health record:", error);
      throw error;
    }
  },
};
