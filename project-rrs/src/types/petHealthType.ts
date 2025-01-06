export interface HealthRecordCreateRequest {
  recordDate: string; // 기록 날짜
  description: string; // 기록 설명
  file?: File; // 첨부 파일 (선택적)
}

export interface HealthRecordUpdateRequest {
  recordDate?: string; // 기록 날짜 (선택적)
  description?: string; // 기록 설명 (선택적)
  file?: File; // 첨부 파일 (선택적)
}

// Health Record 응답 데이터 타입
export interface HealthRecordResponse {
  healthRecordId: number; // Health Record ID
  petId: number; // 반려동물 ID
  userId: number; // 사용자 ID
  recordDate: string; // 기록 날짜
  description: string; // 기록 설명
  attachmentUrl?: string; // 첨부 파일 URL (선택적)
}

// Health Record 전체 목록 응답 타입
export interface HealthRecordListResponse {
  healthRecords: HealthRecordResponse[]; // Health Record 배열
}

// 삭제 요청의 응답 타입
export interface DeleteResponse {
  message: string; // 성공/실패 메시지
}
