/**
 * Hotel PMS - Validators
 * Zod validation schemas for form validation
 */

import { z } from 'zod';

// ==================== Common Validators ====================

/**
 * Email validation
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .email('Please enter a valid email address');

/**
 * Phone number validation (Nepal format)
 */
export const phoneSchema = z
  .string()
  .min(1, 'Phone number is required')
  .regex(/^(\+977)?[9][6-9]\d{8}$/, 'Please enter a valid Nepal phone number');

/**
 * Password validation
 */
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

/**
 * Name validation
 */
export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must not exceed 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

// ==================== Auth Schemas ====================

/**
 * Login form schema
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Registration form schema
 */
export const registerSchema = z
  .object({
    firstName: nameSchema,
    lastName: nameSchema,
    email: emailSchema,
    phone: phoneSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Forgot password schema
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

/**
 * Reset password schema
 */
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

/**
 * Change password schema
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: 'New password must be different from current password',
    path: ['newPassword'],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// ==================== Booking Schemas ====================

/**
 * Guest details schema for booking
 */
export const guestDetailsSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export type GuestDetailsFormData = z.infer<typeof guestDetailsSchema>;

/**
 * Booking search schema
 */
export const bookingSearchSchema = z.object({
  location: z.string().min(1, 'Please enter a location'),
  checkIn: z.string().min(1, 'Check-in date is required'),
  checkOut: z.string().min(1, 'Check-out date is required'),
  adults: z.number().min(1, 'At least 1 adult required').max(10),
  children: z.number().min(0).max(10).optional(),
  rooms: z.number().min(1).max(10).optional(),
});

export type BookingSearchFormData = z.infer<typeof bookingSearchSchema>;

// ==================== Menu & Order Schemas ====================

/**
 * Menu category schema
 */
export const menuCategorySchema = z.object({
  name: z.string().min(2, 'Category name is required'),
  nameNe: z.string().optional(),
  description: z.string().optional(),
  descriptionNe: z.string().optional(),
  image: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().optional(),
  availableFrom: z.string().optional(),
  availableTo: z.string().optional(),
  daysAvailable: z.array(z.number()).optional(),
});

export type MenuCategoryFormData = z.infer<typeof menuCategorySchema>;

/**
 * Menu item schema
 */
export const menuItemSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
  name: z.string().min(2, 'Item name is required'),
  nameNe: z.string().optional(),
  description: z.string().min(10, 'Please add a description (min 10 characters)'),
  descriptionNe: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  discountPrice: z.number().optional(),
  preparationTime: z.number().min(1, 'Preparation time is required'),
  calories: z.number().optional(),
  servingSize: z.string().optional(),
  isVegetarian: z.boolean().optional(),
  isVegan: z.boolean().optional(),
  isGlutenFree: z.boolean().optional(),
  isSpicy: z.boolean().optional(),
  spiceLevel: z.number().min(1).max(3).optional(),
  allergens: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
});

export type MenuItemFormData = z.infer<typeof menuItemSchema>;

/**
 * Order placement schema
 */
export const placeOrderSchema = z.object({
  guestName: z.string().min(2, 'Name is required'),
  guestPhone: phoneSchema,
  guestEmail: emailSchema.optional().or(z.literal('')),
  roomNumber: z.string().optional(),
  tableNumber: z.string().optional(),
  specialInstructions: z.string().optional(),
});

export type PlaceOrderFormData = z.infer<typeof placeOrderSchema>;

// ==================== Room Schemas ====================

/**
 * Room type schema
 */
export const roomTypeSchema = z.object({
  name: z.string().min(2, 'Room type name is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  shortDescription: z.string().min(10, 'Short description is required'),
  maxOccupancy: z.number().min(1).max(10),
  maxAdults: z.number().min(1).max(10),
  maxChildren: z.number().min(0).max(10),
  size: z.number().min(1, 'Room size is required'),
  sizeUnit: z.enum(['sqm', 'sqft']),
  basePrice: z.number().min(0, 'Base price is required'),
  amenities: z.array(z.string()),
});

export type RoomTypeFormData = z.infer<typeof roomTypeSchema>;

/**
 * Room schema
 */
export const roomSchema = z.object({
  roomTypeId: z.string().min(1, 'Please select a room type'),
  roomNumber: z.string().min(1, 'Room number is required'),
  floor: z.number().min(0, 'Floor is required'),
  notes: z.string().optional(),
});

export type RoomFormData = z.infer<typeof roomSchema>;

// ==================== Review Schema ====================

/**
 * Review submission schema
 */
export const reviewSchema = z.object({
  ratings: z.object({
    cleanliness: z.number().min(1).max(5),
    comfort: z.number().min(1).max(5),
    location: z.number().min(1).max(5),
    facilities: z.number().min(1).max(5),
    staff: z.number().min(1).max(5),
    valueForMoney: z.number().min(1).max(5),
    food: z.number().min(1).max(5).optional(),
  }),
  title: z.string().optional(),
  comment: z.string().min(20, 'Please write at least 20 characters'),
  tripType: z.enum(['business', 'leisure', 'family', 'couple', 'solo', 'group']),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// ==================== Staff Schema ====================

/**
 * Staff member schema
 */
export const staffSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  role: z.string().min(1, 'Please select a role'),
  department: z.string().min(1, 'Please select a department'),
  position: z.string().min(1, 'Position is required'),
  dateOfBirth: z.string().optional(),
  dateOfJoining: z.string().min(1, 'Joining date is required'),
  address: z.string().optional(),
  salary: z.number().optional(),
});

export type StaffFormData = z.infer<typeof staffSchema>;

// ==================== Hotel Schema ====================

/**
 * Hotel creation/update schema
 */
export const hotelSchema = z.object({
  name: z.string().min(2, 'Hotel name is required'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  shortDescription: z.string().min(20, 'Short description is required'),
  starRating: z.number().min(1).max(5),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State/Province is required'),
    country: z.string().min(1, 'Country is required'),
    zipCode: z.string().optional(),
  }),
  contactInfo: z.object({
    email: emailSchema,
    phone: phoneSchema,
    alternatePhone: z.string().optional(),
  }),
  checkInTime: z.string().min(1, 'Check-in time is required'),
  checkOutTime: z.string().min(1, 'Check-out time is required'),
  amenities: z.array(z.string()),
});

export type HotelFormData = z.infer<typeof hotelSchema>;

// ==================== Utility Functions ====================

/**
 * Validate a single field
 */
export const validateField = <T extends z.ZodSchema>(
  schema: T,
  value: unknown
): { isValid: boolean; error?: string } => {
  const result = schema.safeParse(value);
  
  if (result.success) {
    return { isValid: true };
  }
  
  return {
    isValid: false,
    error: result.error.errors[0]?.message,
  };
};

/**
 * Get all validation errors from a Zod error
 */
export const getValidationErrors = (
  error: z.ZodError
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!errors[path]) {
      errors[path] = err.message;
    }
  });
  
  return errors;
};
