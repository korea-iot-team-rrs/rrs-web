export interface HealthRecord {
  healthRecordId: number;
  petId: number;
  weight: number;
  petAge: number;
  abnormalSymptoms: string;
  createdAt: string;
  memo?: string;
  attachments: HealthRecordAttachment[];
  userId?: number;
}

export interface HealthRecordAttachment {
  attachmentId: number;
  healthRecordId: number;
  healthRecordAttachmentFile: string;
}
