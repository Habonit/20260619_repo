// 프로젝트 타입 정의
export interface Project {
  id: number;
  title: string;
  description: string;
  period: string;
  role: string;        // JSON 배열 문자열: '["Frontend Lead"]'
  tech_stack: string;  // JSON 배열 문자열
  content?: string;
  github_url?: string;
  demo_url?: string;
  thumbnail_url?: string;
  emoji: string;
  is_featured: boolean;
  order: number;
  created_at: string;
  updated_at: string;
}

// 업적/성과 타입 정의
export interface Achievement {
  emoji: string;
  label: string;
  description: string;
}

// 프로필 타입 정의
export interface Profile {
  id: number;
  name: string;
  title: string;
  bio: string;
  skills: string;       // JSON 배열 문자열
  achievements: string; // JSON 배열 문자열
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  resume_url?: string;
}
