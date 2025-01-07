export interface HealthRecord {
  healthRecordId: string;
  createdAt: string;
  abnormalSymptoms: string;
  weight: number;
  petAge: number;
  memo?: string;
  attachments?: File[];
}
export interface HealthRecordResponse {
  healthRecordId: number;
  petId: number;
  weight: number;
  petAge: number;
  abnormalSymptoms: string;
  memo?: string;
  createdAt: string;
  attachments?: string[];
}

// 삭제 요청의 응답 타입
export interface DeleteResponse {
  message: string; // 성공/실패 메시지
}
