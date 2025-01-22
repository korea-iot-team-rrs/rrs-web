export interface CustomerSupport {
  customerSupportId: number;
  userId: number; // FK
  customerSupportTitle: string;
  customerSupportContent: string;
  customerSupportStatus: string;
  customerSupportCreateAt: Date;
  customerSupportCategory: string;
}

export interface CustomerSupportAttachment {
  customerSupportAttachmentId: number;
  customerSupportId: number; // FK
  customerAttachmentFile: string;
}

export interface CreateCS {
  customerSupportTitle: string;
  customerSupportContent: string;
  customerSupportCategory: string;
  files: File[];
  path: string;
}
export interface UpdateCS {
  customerSupportTitle: string;
  customerSupportContent: string;
  files: File[];
}

export interface FetchCSList {
  customerSupportId: number;
  customerSupportTitle: string;
  customerSupportContent: string;
  customerSupportStatus: string;
  customerSupportCreateAt: Date;
  customerSupportCategory: string;
}
export interface FetchCS {
  customerSupportId: number;
  customerSupportTitle: string;
  customerSupportContent: string;
  customerSupportStatus: string;
  customerSupportCreateAt: Date;
  customerSupportCategory: string;
  fileInfos: FileInfos[];
}

export interface FileInfos {
  filePath: string;
  fileName: string;
  fileSize?: number | null;
}

export interface EditedCS {
  customerSupportId: number;
  customerSupportTitle: string;
  customerSupportContent: string;
  customerSupportCategory: string;
  fileInfos: FileInfos[];
}