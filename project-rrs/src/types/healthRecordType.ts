// 건강 기록 API 응답 인터페이스
export interface HealthRecordApiResponse<T> {
  result: boolean;
  message: string;
  data: T;
}

// 건강 기록 첨부파일 데이터 인터페이스
export interface HealthRecordAttachmentData {
  attachmentId: number; // 첨부파일 ID
  healthRecordAttachments?: HealthRecordAttachment[];
}

// 건강 기록 첨부파일 인터페이스
export interface HealthRecordAttachment {
  replace: string;
  attachmentId: number; // 첨부파일 ID
  filePath: string; // 파일 경로
  fileName: string; // 파일 이름
  fileSize?: number | null; // 파일 크기 (선택적)
}
