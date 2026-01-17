/**
 * Hotel PMS - Menu Types
 * Types for restaurant menu, categories, and items
 */

import { BaseEntity, Image } from './common.types';

// Menu category
export interface MenuCategory extends BaseEntity {
  hotelId: string;
  name: string;
  nameNe?: string; // Nepali name
  slug: string;
  description?: string;
  descriptionNe?: string;
  image?: string;
  icon?: string;
  sortOrder: number;
  isActive: boolean;
  itemCount: number;
  availableFrom?: string; // Time (HH:mm)
  availableTo?: string; // Time (HH:mm)
  daysAvailable?: number[]; // 0-6 (Sunday-Saturday)
}

// Menu item
export interface MenuItem extends BaseEntity {
  hotelId: string;
  categoryId: string;
  category?: MenuCategory;
  name: string;
  nameNe?: string; // Nepali name
  slug: string;
  description: string;
  descriptionNe?: string;
  images: Image[];
  price: number;
  discountPrice?: number;
  currency: string;
  preparationTime: number; // in minutes
  calories?: number;
  servingSize?: string;
  isVegetarian: boolean;
  isVegan: boolean;
  isGlutenFree: boolean;
  isSpicy: boolean;
  spiceLevel?: 1 | 2 | 3; // 1=mild, 2=medium, 3=hot
  allergens: Allergen[];
  ingredients?: string[];
  customizations: MenuItemCustomization[];
  addons: MenuItemAddon[];
  tags: string[];
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  sortOrder: number;
  averageRating: number;
  totalOrders: number;
}

// Food allergens
export type Allergen = 
  | 'milk'
  | 'eggs'
  | 'fish'
  | 'shellfish'
  | 'tree-nuts'
  | 'peanuts'
  | 'wheat'
  | 'soybeans'
  | 'sesame';

// Menu item customization (e.g., size, cooking preference)
export interface MenuItemCustomization {
  id: string;
  name: string;
  nameNe?: string;
  type: 'single' | 'multiple';
  required: boolean;
  options: CustomizationOption[];
}

// Customization option
export interface CustomizationOption {
  id: string;
  name: string;
  nameNe?: string;
  priceModifier: number; // Additional price
  isDefault: boolean;
}

// Menu item addon
export interface MenuItemAddon {
  id: string;
  name: string;
  nameNe?: string;
  price: number;
  isAvailable: boolean;
}

// Menu QR code
export interface MenuQRCode extends BaseEntity {
  hotelId: string;
  type: 'room' | 'table' | 'general';
  identifier: string; // Room number or table number
  code: string; // Unique code for URL
  isActive: boolean;
  scanCount: number;
  lastScannedAt?: string;
}

// Create menu category request
export interface CreateMenuCategoryRequest {
  name: string;
  nameNe?: string;
  description?: string;
  descriptionNe?: string;
  image?: string;
  icon?: string;
  sortOrder?: number;
  availableFrom?: string;
  availableTo?: string;
  daysAvailable?: number[];
}

// Update menu category request
export interface UpdateMenuCategoryRequest extends Partial<CreateMenuCategoryRequest> {
  isActive?: boolean;
}

// Create menu item request
export interface CreateMenuItemRequest {
  categoryId: string;
  name: string;
  nameNe?: string;
  description: string;
  descriptionNe?: string;
  price: number;
  discountPrice?: number;
  preparationTime: number;
  calories?: number;
  servingSize?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isSpicy?: boolean;
  spiceLevel?: 1 | 2 | 3;
  allergens?: Allergen[];
  ingredients?: string[];
  customizations?: MenuItemCustomization[];
  addons?: MenuItemAddon[];
  tags?: string[];
}

// Update menu item request
export interface UpdateMenuItemRequest extends Partial<CreateMenuItemRequest> {
  isAvailable?: boolean;
  isPopular?: boolean;
  isNew?: boolean;
  sortOrder?: number;
}

// Menu search filters
export interface MenuSearchFilters {
  search?: string;
  categoryId?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  minPrice?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  isPopular?: boolean;
}

// Menu view for guests (mobile)
export interface GuestMenuView {
  hotelId: string;
  hotelName: string;
  hotelLogo?: string;
  categories: MenuCategory[];
  popularItems: MenuItem[];
  newItems: MenuItem[];
}

// Bulk availability update
export interface BulkMenuAvailabilityUpdate {
  itemIds: string[];
  isAvailable: boolean;
}

// Menu import/export
export interface MenuExportData {
  categories: MenuCategory[];
  items: MenuItem[];
  exportedAt: string;
  hotelId: string;
}
