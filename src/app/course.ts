// types/index.ts - Main type definitions for E-Learning Platform

import { NextApiRequest } from "next";

// Enums for better type safety
export enum UserRole {
  STUDENT = 'STUDENT',
  TUTOR = 'TUTOR',
  ADMIN = 'ADMIN'
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentMethod {
  CREDIT_CARD = 'Credit Card',
  PAYPAL = 'PayPal',
  BANK_TRANSFER = 'Bank Transfer',
  STRIPE = 'Stripe'
}

export enum CourseCategory {
  FRONTEND_DEVELOPMENT = 'Frontend Development',
  BACKEND_DEVELOPMENT = 'Backend Development',
  FULLSTACK_DEVELOPMENT = 'Full-Stack Development',
  DATA_SCIENCE = 'Data Science',
  MOBILE_DEVELOPMENT = 'Mobile Development',
  DEVOPS = 'DevOps',
  UI_UX_DESIGN = 'UI/UX Design',
  CYBERSECURITY = 'Cybersecurity',
  CLOUD_COMPUTING = 'Cloud Computing',
  ARTIFICIAL_INTELLIGENCE = 'Artificial Intelligence'
}

// Base User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

// Extended User interfaces
export interface Student extends User {
  role: UserRole.STUDENT;
  purchasedCourses?: Course[];
  purchases?: Purchase[];
  reviews?: CourseReview[];
}

export interface Tutor extends User {
  role: UserRole.TUTOR;
  bio?: string;
  profileImage?: string;
  expertise?: string[];
  courses?: Course[];
  totalEarnings?: number;
  totalStudents?: number;
}

export interface Admin extends User {
  role: UserRole.ADMIN;
  permissions?: string[];
}

// Course interface - Main course type
export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  tutorId: string;
  duration?: number; // Duration in hours
  level?: CourseLevel;
  category?: CourseCategory;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  tutor?: Tutor;
  purchases?: Purchase[];
  reviews?: CourseReview[];
  
  // Computed fields
  totalPurchases?: number;
  averageRating?: number;
  totalRevenue?: number;
}


// Simplified course for cards/lists
export interface CourseCard {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  level?: CourseLevel;
  category?: CourseCategory;
  duration?: number;
  tutorName: string;
  averageRating?: number;
  totalPurchases?: number;
}

// Purchase interface
export interface Purchase {
  id: string;
  userId: string;
  courseId: string;
  amount: number;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  purchaseDate: Date;
  
  // Relations
  user?: Student;
  course?: Course;
}

// Course Review interface
export interface CourseReview {
  id: string;
  userId: string;
  courseId: string;
  rating: number; // 1-5
  reviewText?: string;
  createdAt: Date;
  
  // Relations
  user?: Student;
  course?: Course;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Dashboard types
export interface DashboardStats {
  totalTutors: number;
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  totalPurchases: number;
  averageRating: number;
}

export interface TutorWithCourses extends Tutor {
  courses: CourseWithStudents[];
}

export interface CourseWithStudents extends Course {
  students: StudentPurchase[];
}

export interface StudentPurchase {
  id: string;
  name: string;
  email: string;
  purchaseDate: Date;
  purchaseAmount: number;
}

export interface AdminDashboardData {
  stats: DashboardStats;
  tutors: TutorWithCourses[];
}

// Form types for creating/updating
export interface CreateCourseDto {
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  duration?: number;
  level?: CourseLevel;
  category?: CourseCategory;
}

export interface UpdateCourseDto extends Partial<CreateCourseDto> {
  id: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserDto {
  id: string;
  email?: string;
  name?: string;
  bio?: string;
  profileImage?: string;
}

export interface PurchaseCourseDto {
  courseId: string;
  paymentMethod: PaymentMethod;
  paymentToken?: string; // For Stripe or other payment processors
}

export interface CreateReviewDto {
  courseId: string;
  rating: number;
  reviewText?: string;
}

// Filter and search types
export interface CourseFilters {
  category?: CourseCategory;
  level?: CourseLevel;
  minPrice?: number;
  maxPrice?: number;
  tutorId?: string;
  search?: string;
  sortBy?: 'title' | 'price' | 'rating' | 'created' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

export interface UserFilters {
  role?: UserRole;
  search?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'email' | 'created';
  sortOrder?: 'asc' | 'desc';
}

// Authentication types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
  role?: UserRole;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

// Next.js API types
export interface NextApiRequestWithAuth extends NextApiRequest {
  user?: AuthUser;
}

// Course statistics
export interface CourseStats {
  courseId: string;
  courseTitle: string;
  tutorName: string;
  price: number;
  totalPurchases: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

// Tutor earnings
export interface TutorEarnings {
  tutorId: string;
  tutorName: string;
  coursesCreated: number;
  totalSales: number;
  totalEarnings: number;
  averageRating: number;
}

// Student activity
export interface StudentActivity {
  studentId: string;
  studentName: string;
  studentEmail: string;
  coursesPurchased: number;
  totalSpent: number;
  reviewsWritten: number;
  joinDate: Date;
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
}

// Utility types
export type CourseId = string;
export type UserId = string;
export type PurchaseId = string;

// Form validation schemas (can be used with libraries like Yup or Zod)
export interface CourseFormData {
  title: string;
  description: string;
  price: string; // String for form input, convert to number
  duration: string;
  level: CourseLevel;
  category: CourseCategory;
  imageFile?: File;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  bio?: string;
  profileImageFile?: File;
}

// Chart/Analytics data types
export interface RevenueData {
  date: string;
  revenue: number;
  courses: number;
  students: number;
}

export interface CategoryStats {
  category: CourseCategory;
  courseCount: number;
  revenue: number;
  studentCount: number;
}

export interface MonthlyStats {
  month: string;
  newCourses: number;
  newStudents: number;
  revenue: number;
  purchases: number;
}