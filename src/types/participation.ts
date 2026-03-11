export interface Participation {
  id: number;
  userId: number;
  activityId: number;
  fileUrl: string;
  reviewText: string;
  submittedAt: string;
  status: 'PENDING' | 'APPROVED';
  activityName?: string;
}
