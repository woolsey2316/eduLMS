export type Role = 'student' | 'instructor' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  bio: string;
  avatar_url: string;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  price: string;
  thumbnail_url: string;
  category: string;
  is_published: boolean;
  instructor: number;
  instructor_name: string;
  average_rating: number | null;
  enrollment_count: number;
  created_at: string;
  modules?: Module[];
  updated_at?: string;
}

export interface Module {
  id: number;
  course: number;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  module: number;
  title: string;
  content: string;
  video_url: string;
  order: number;
  duration_minutes: number;
}

export interface Enrollment {
  id: number;
  student: number;
  course: number;
  course_title: string;
  course_thumbnail: string;
  enrolled_at: string;
  is_completed: boolean;
}

export interface Grade {
  id: number;
  student: number;
  student_username: string;
  lesson: number;
  lesson_title: string;
  graded_by: number;
  score: number;
  feedback: string;
  graded_at: string;
}

export interface Rating {
  id: number;
  student: number;
  student_username: string;
  course: number;
  rating: number;
  review: string;
  created_at: string;
}

export interface CartItem {
  id: number;
  course: number;
  course_title: string;
  course_price: string;
  course_thumbnail: string;
  added_at: string;
}

export interface Cart {
  id: number;
  student: number;
  items: CartItem[];
  total: string;
  created_at: string;
}
