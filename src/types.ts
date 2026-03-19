export interface Topic {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Master';
  description: string;
  concepts: string[];
}
