export interface Grade {
  id: number;
  name: string;
  orderNum: number;
}

export interface Unit {
  id: number;
  gradeId: number;
  name: string;
  description: string;
  orderNum: number;
}

export interface Category {
  id: number;
  unitId: number;
  name: string;
  type: 'HOME' | 'FITNESS' | 'CLASS' | 'ASSESSMENT' | 'GAME';
  orderNum: number;
}

export interface Activity {
  id: number;
  categoryId: number;
  name: string;
  description: string;
  targetGrade: string;
  unitLabel: string;
  guideText: string;
  imageUrl: string;
  orderNum: number;
  categoryName: string;
  unitName: string;
}
