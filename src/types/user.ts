export interface User {
  id: number;
  username: string;
  name: string;
  gender: string;
  birthDate: string;
  school: string;
  grade: number;
  classNum: number;
  role: 'STUDENT' | 'TEACHER';
  provider: 'LOCAL' | 'KAKAO';
  profileComplete: boolean;
}
