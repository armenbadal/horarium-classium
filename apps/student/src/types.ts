export interface Lesson {
  start: string;
  end: string;
  lesson: string;
  teacher?: string;
  note?: string;
}

export type Schedule = Record<string, Lesson[]>;