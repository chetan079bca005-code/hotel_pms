/**
 * Hotel PMS - Auth Layout Component
 * Layout for authentication pages (login, register, forgot password)
 */

import { Outlet } from 'react-router-dom';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { LanguageSelector } from '@/components/common/LanguageSelector';

/**
 * AuthLayout component
 * "Floating Box" design centered on screen
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#002366] dark:bg-[#001a4d] transition-colors duration-300">
      {/* Header with Theme and Language toggles */}
      <div className="w-full flex justify-end items-center gap-2 p-4">
        <LanguageSelector 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/10 hover:text-white"
        />
        <ThemeToggle 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-white/10 hover:text-white"
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-[550px] animate-in fade-in zoom-in duration-500">
          <div className="bg-card/95 backdrop-blur-md shadow-[0_8px_40px_rgb(0,0,0,0.4)] rounded-2xl border border-white/10 overflow-hidden p-6 md:p-8">
            <Outlet />
          </div>

          <div className="mt-6 text-center">
            <p className="text-white/60 dark:text-white/40 text-xs">
              © {new Date().getFullYear()} Namaste PMS. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
