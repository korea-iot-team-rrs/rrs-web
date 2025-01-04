export interface CustomerSupport {
    reviewId: number;
    userId: number; // FK
    customerSupportTitle: string;
    customerSupportContent: string;
    customerSupportStatus: number;
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

export interface fetchCSList {
    reviewId: number;
    customerSupportTitle: string;
    customerSupportContent: string;
    customerSupportStatus: number;
    customerSupportCreateAt: Date;
    customerSupportCategory: string;
}