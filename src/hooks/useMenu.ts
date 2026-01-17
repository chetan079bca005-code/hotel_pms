/**
 * Hotel PMS - useMenu Hook
 * Restaurant menu management hook with React Query
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { menuService } from '@/services/menuService';
import { toastSuccess, toastError } from '@/hooks/use-toast';
import type {
  MenuItem,
  CreateMenuItemRequest,
  UpdateMenuItemRequest,
  CreateMenuCategoryRequest,
  UpdateMenuCategoryRequest,
  MenuSearchFilters,
} from '@/types';

/**
 * Query keys for menu data
 */
export const menuKeys = {
  all: ['menu'] as const,
  categories: (hotelId: string) => [...menuKeys.all, 'categories', hotelId] as const,
  items: () => [...menuKeys.all, 'items'] as const,
  itemList: (hotelId: string, filters?: MenuSearchFilters) => [...menuKeys.items(), hotelId, filters] as const,
  itemDetail: (id: string) => [...menuKeys.items(), 'detail', id] as const,
  popular: (hotelId: string) => [...menuKeys.items(), 'popular', hotelId] as const,
};

/**
 * useMenuCategories - Fetch all menu categories for a hotel
 */
export function useMenuCategories(hotelId: string) {
  return useQuery({
    queryKey: menuKeys.categories(hotelId),
    queryFn: () => menuService.getCategories(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * useMenuItems - Fetch menu items with filters
 */
export function useMenuItems(hotelId: string, filters?: MenuSearchFilters) {
  const combinedFilters = { ...filters, hotelId };
  return useQuery({
    queryKey: menuKeys.itemList(hotelId, filters),
    queryFn: () => menuService.getItems(combinedFilters),
    enabled: !!hotelId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * useMenuItem - Fetch single menu item
 */
export function useMenuItem(itemId: string) {
  return useQuery({
    queryKey: menuKeys.itemDetail(itemId),
    queryFn: () => menuService.getItem(itemId),
    enabled: !!itemId,
  });
}

/**
 * usePopularItems - Fetch popular menu items
 */
export function usePopularItems(hotelId: string) {
  return useQuery({
    queryKey: menuKeys.popular(hotelId),
    queryFn: () => menuService.getPopularItems(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * useCreateCategory - Create new menu category
 */
export function useCreateCategory(hotelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuCategoryRequest) => 
      menuService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.categories(hotelId) });
      toastSuccess('Category created', 'New menu category has been added');
    },
    onError: (error: Error) => {
      toastError('Failed to create category', error.message || 'Please try again');
    },
  });
}

/**
 * useUpdateCategory - Update menu category
 */
export function useUpdateCategory(hotelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuCategoryRequest }) =>
      menuService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.categories(hotelId) });
      toastSuccess('Category updated', 'Changes have been saved');
    },
    onError: (error: Error) => {
      toastError('Failed to update category', error.message || 'Please try again');
    },
  });
}

/**
 * useDeleteCategory - Delete menu category
 */
export function useDeleteCategory(hotelId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.categories(hotelId) });
      toastSuccess('Category deleted', 'Menu category has been removed');
    },
    onError: (error: Error) => {
      toastError('Failed to delete category', error.message || 'Please try again');
    },
  });
}

/**
 * useCreateMenuItem - Create new menu item
 */
export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateMenuItemRequest) => 
      menuService.createItem(data),
    onSuccess: (item: MenuItem) => {
      queryClient.invalidateQueries({ queryKey: menuKeys.items() });
      toastSuccess('Item created', `${item.name} has been added to the menu`);
    },
    onError: (error: Error) => {
      toastError('Failed to create item', error.message || 'Please try again');
    },
  });
}

/**
 * useUpdateMenuItem - Update menu item
 */
export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMenuItemRequest }) =>
      menuService.updateItem(id, data),
    onSuccess: (item: MenuItem) => {
      queryClient.setQueryData(menuKeys.itemDetail(item.id), item);
      queryClient.invalidateQueries({ queryKey: menuKeys.items() });
      toastSuccess('Item updated', 'Changes have been saved');
    },
    onError: (error: Error) => {
      toastError('Failed to update item', error.message || 'Please try again');
    },
  });
}

/**
 * useDeleteMenuItem - Delete menu item
 */
export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => menuService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: menuKeys.items() });
      toastSuccess('Item deleted', 'Menu item has been removed');
    },
    onError: (error: Error) => {
      toastError('Failed to delete item', error.message || 'Please try again');
    },
  });
}

/**
 * useToggleItemAvailability - Toggle menu item availability
 */
export function useToggleItemAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isAvailable }: { id: string; isAvailable: boolean }) =>
      menuService.updateItem(id, { isAvailable }),
    onSuccess: (item: MenuItem) => {
      queryClient.setQueryData(menuKeys.itemDetail(item.id), item);
      queryClient.invalidateQueries({ queryKey: menuKeys.items() });
      toastSuccess(
        item.isAvailable ? 'Item available' : 'Item unavailable',
        `${item.name} is now ${item.isAvailable ? 'available' : 'unavailable'}`
      );
    },
    onError: (error: Error) => {
      toastError('Failed to update availability', error.message || 'Please try again');
    },
  });
}

/**
 * useGuestMenuView - Fetch guest menu view (for QR code access)
 */
export function useGuestMenuView(hotelId: string) {
  return useQuery({
    queryKey: ['guestMenu', hotelId],
    queryFn: () => menuService.getGuestMenuView(hotelId),
    enabled: !!hotelId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * useSearchMenuItems - Search menu items
 */
export function useSearchMenuItems(hotelId: string, query: string) {
  return useQuery({
    queryKey: ['menuSearch', hotelId, query],
    queryFn: () => menuService.searchItems(hotelId, query),
    enabled: !!hotelId && query.length >= 2,
    staleTime: 1 * 60 * 1000,
  });
}
