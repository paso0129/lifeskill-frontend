export interface Participation {
  id: number;
  user: {
    id: number;
    name: string;
    school: string;
    grade: number;
    classNum: number;
    username: string;
  };
  activity: {
    id: number;
    name: string;
    category: {
      name: string;
      unit: {
        name: string;
      };
    };
  };
  fileUrl: string;
  reviewText: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
