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
}

export interface EditedCS {
  customerSupportId: number;
  customerSupportTitle: string;
  customerSupportContent: string;
  customerSupportCategory: string;
  fileInfos: FileInfos[];
}

export interface UpdateCS {
  customerSupportTitle: string;
  customerSupportContent: string;
  customerSupportCategory: string;
  files: File[];
  path: string;
}

export interface UpdateCSRequest {
  customerSupportTitle?: string;
  customerSupportContent?: string;
  customerSupportCategory?: string;
  files?: File[];
  path?: string;
}

export const createFormData = (data: Partial<UpdateCSRequest>): FormData => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (key === "files" && Array.isArray(value)) {
      value.forEach((file) => formData.append("files", file));
    } else if (value !== null && value !== undefined) {
      formData.append(key, value.toString());
    }
  });

  return formData;
};
