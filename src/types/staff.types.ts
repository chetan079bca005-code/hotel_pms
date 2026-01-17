/**
 * Hotel PMS - Staff Types
 * Types for hotel staff management
 */

import { BaseEntity, ContactInfo } from './common.types';
import { UserRole } from './auth.types';

// Staff entity
export interface Staff extends BaseEntity {
  hotelId: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  avatar?: string;
  role: StaffRole;
  department: Department;
  position: string;
  dateOfBirth?: string;
  dateOfJoining: string;
  address?: string;
  emergencyContact?: EmergencyContact;
  salary?: number;
  bankDetails?: BankDetails;
  documents?: StaffDocument[];
  isActive: boolean;
  permissions: string[];
  schedule?: WorkSchedule;
  performance?: StaffPerformance;
}

// Staff roles (more granular than user roles)
export type StaffRole = 
  | 'general-manager'
  | 'front-desk-manager'
  | 'front-desk-agent'
  | 'housekeeping-manager'
  | 'housekeeper'
  | 'restaurant-manager'
  | 'chef'
  | 'kitchen-staff'
  | 'waiter'
  | 'maintenance'
  | 'security'
  | 'accountant'
  | 'other';

// Departments
export type Department = 
  | 'management'
  | 'front-office'
  | 'housekeeping'
  | 'food-beverage'
  | 'kitchen'
  | 'maintenance'
  | 'security'
  | 'finance'
  | 'hr'
  | 'other';

// Emergency contact
export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

// Bank details
export interface BankDetails {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  branchName?: string;
  ifscCode?: string;
}

// Staff document
export interface StaffDocument {
  id: string;
  type: 'id-proof' | 'address-proof' | 'certificate' | 'contract' | 'other';
  name: string;
  url: string;
  uploadedAt: string;
}

// Work schedule
export interface WorkSchedule {
  monday?: Shift;
  tuesday?: Shift;
  wednesday?: Shift;
  thursday?: Shift;
  friday?: Shift;
  saturday?: Shift;
  sunday?: Shift;
}

// Shift
export interface Shift {
  startTime: string;
  endTime: string;
  isOff: boolean;
}

// Staff performance
export interface StaffPerformance {
  rating: number;
  tasksCompleted: number;
  tasksAssigned: number;
  attendanceRate: number;
  lastReviewDate?: string;
  notes?: string;
}

// Create staff request
export interface CreateStaffRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: Department;
  position: string;
  dateOfBirth?: string;
  dateOfJoining: string;
  address?: string;
  salary?: number;
  permissions?: string[];
}

// Update staff request
export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
  isActive?: boolean;
  emergencyContact?: EmergencyContact;
  bankDetails?: BankDetails;
  schedule?: WorkSchedule;
}

// Staff search filters
export interface StaffSearchFilters {
  search?: string;
  department?: Department;
  role?: StaffRole;
  isActive?: boolean;
}

// Staff list item
export interface StaffListItem {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  phone: string;
  department: Department;
  role: StaffRole;
  position: string;
  isActive: boolean;
  avatar?: string;
}

// Attendance record
export interface AttendanceRecord extends BaseEntity {
  staffId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave';
  workHours?: number;
  overtime?: number;
  notes?: string;
}

// Leave request
export interface LeaveRequest extends BaseEntity {
  staffId: string;
  staffName: string;
  leaveType: 'annual' | 'sick' | 'emergency' | 'unpaid' | 'other';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}
