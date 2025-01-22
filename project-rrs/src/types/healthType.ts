export interface HealthRecord {
  healthRecordId: number;
  petId: number;
  weight: number;
  petAge: number;
  abnormalSymptoms: string;
  memo?: string;
  createdAt: string;
  attachments?: HealthAttachmentData[];
}
export interface HealthRecordResponse {
  weight: number;
  petAge: number;
  healthRecordId: number;
  petId: number;
  abnormalSymptoms: string;
  memo?: string;
  createdAt: string;
  attachments?: HealthAttachmentData[];
}

export interface HealthAttachmentData {
  split: string;
  attachmentId: number;
  filePath: string;
  fileName: string;
  fileSize?: number | null;
}

// 삭제 요청의 응답 타입
export interface DeleteResponse {
  message: string; // 성공/실패 메시지
}
