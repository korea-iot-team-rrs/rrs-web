// src/apis/CommunityUploadFile/uploadFile.ts
import axios from 'axios';
import { getToken } from '../../utils/auth';
import { MAIN_URL, USER_PATH } from '../../constants';

const UPLOAD_FILE_API_URL = `${MAIN_URL}${USER_PATH}/upload`; // 파일 업로드 API URL

/**
 * 파일을 서버에 업로드하고 파일 URL을 반환하는 함수
 * @param file 업로드할 파일
 * @param path 파일 저장 경로 (예: "community-thumbnail", "community")
 * @returns 업로드된 파일의 URL
 */
export const uploadFile = async (file: File, path: string): Promise<string> => {
  const token = getToken();

  if (!token) {
    throw new Error('인증 토큰이 없습니다. 로그인을 먼저 해주세요.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('path', path); // 'path' 매개변수 추가

  try {
    const response = await axios.post<string>(
      UPLOAD_FILE_API_URL,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    return response.data; // 서버가 반환한 파일 URL (예: /uploads/file/community/uniqueFileName.jpg)
  } catch (error: any) {
    console.error('파일 업로드 실패:', error);
    throw error;
  }
};
