/**
 * Hotel PMS - Housekeeping Types
 * Types for housekeeping task management
 */

import { BaseEntity } from './common.types';
import { Room } from './room.types';
import { Staff } from './staff.types';

// Housekeeping task status
export type HousekeepingStatus = 
  | 'pending'
  | 'in-progress'
  | 'completed'
  | 'inspected'
  | 'issue-reported';

// Housekeeping task priority
export type TaskPriority = 'low' | 'normal' | 'high' | 'urgent';

// Housekeeping task type
export type TaskType = 
  | 'checkout-cleaning'
  | 'stayover-cleaning'
  | 'deep-cleaning'
  | 'turndown-service'
  | 'inspection'
  | 'maintenance-request'
  | 'amenity-restock'
  | 'laundry-pickup'
  | 'special-request';

// Housekeeping task
export interface HousekeepingTask extends BaseEntity {
  hotelId: string;
  roomId: string;
  room: Room;
  taskType: TaskType;
  priority: TaskPriority;
  status: HousekeepingStatus;
  assignedTo?: string;
  assignedStaff?: Staff;
  scheduledDate: string;
  scheduledTime?: string;
  startedAt?: string;
  completedAt?: string;
  inspectedBy?: string;
  inspectedAt?: string;
  notes?: string;
  checklist: TaskChecklistItem[];
  issues?: TaskIssue[];
  photos?: TaskPhoto[];
}

// Task checklist item
export interface TaskChecklistItem {
  id: string;
  item: string;
  isCompleted: boolean;
  completedAt?: string;
}

// Task issue
export interface TaskIssue {
  id: string;
  type: 'damage' | 'maintenance' | 'missing-item' | 'cleanliness' | 'other';
  description: string;
  severity: 'minor' | 'moderate' | 'major';
  photos?: string[];
  reportedAt: string;
  resolvedAt?: string;
  resolution?: string;
}

// Task photo
export interface TaskPhoto {
  id: string;
  url: string;
  caption?: string;
  type: 'before' | 'after' | 'issue';
  uploadedAt: string;
}

// Create housekeeping task request
export interface CreateHousekeepingTaskRequest {
  roomId: string;
  taskType: TaskType;
  priority?: TaskPriority;
  assignedTo?: string;
  scheduledDate: string;
  scheduledTime?: string;
  notes?: string;
  checklist?: string[];
}

// Update housekeeping task request
export interface UpdateHousekeepingTaskRequest {
  status?: HousekeepingStatus;
  assignedTo?: string;
  priority?: TaskPriority;
  notes?: string;
}

// Housekeeping search filters
export interface HousekeepingSearchFilters {
  search?: string;
  status?: HousekeepingStatus | HousekeepingStatus[];
  taskType?: TaskType;
  priority?: TaskPriority;
  assignedTo?: string;
  floor?: number;
  scheduledDate?: string;
}

// Room housekeeping status
export interface RoomHousekeepingStatus {
  roomId: string;
  roomNumber: string;
  floor: number;
  roomType: string;
  isClean: boolean;
  lastCleanedAt?: string;
  currentTask?: HousekeepingTask;
  occupancyStatus: 'vacant' | 'occupied' | 'checkout-today' | 'checkin-today';
}

// Housekeeping dashboard
export interface HousekeepingDashboard {
  totalRooms: number;
  cleanRooms: number;
  dirtyRooms: number;
  inProgressRooms: number;
  inspectionPending: number;
  pendingTasks: number;
  tasksToday: number;
  completedToday: number;
  staffOnDuty: number;
  avgCleaningTime: number; // in minutes
  roomsByFloor: {
    floor: number;
    total: number;
    clean: number;
    dirty: number;
  }[];
}

// Staff assignment
export interface StaffAssignment {
  staffId: string;
  staffName: string;
  assignedRooms: string[];
  tasksAssigned: number;
  tasksCompleted: number;
  currentTask?: string;
}

// Housekeeping checklist template
export interface ChecklistTemplate {
  id: string;
  name: string;
  taskType: TaskType;
  items: string[];
  isDefault: boolean;
}

// Bulk task assignment
export interface BulkTaskAssignment {
  taskIds: string[];
  assignedTo: string;
}

// Housekeeping report
export interface HousekeepingReport {
  date: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  avgCompletionTime: number;
  issuesReported: number;
  staffPerformance: {
    staffId: string;
    staffName: string;
    tasksCompleted: number;
    avgTime: number;
    rating: number;
  }[];
}

// Inventory item for housekeeping supplies
export interface HousekeepingInventory {
  id: string;
  name: string;
  category: 'cleaning' | 'amenities' | 'linen' | 'toiletries' | 'equipment';
  currentStock: number;
  minimumStock: number;
  unit: string;
  lastRestocked?: string;
  isLowStock: boolean;
}

// Inventory request
export interface InventoryRequest extends BaseEntity {
  requestedBy: string;
  items: {
    itemId: string;
    itemName: string;
    quantity: number;
  }[];
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  notes?: string;
}
