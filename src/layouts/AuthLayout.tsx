/**
 * Hotel PMS - Auth Layout Component
 * Layout for authentication pages (login, register, forgot password)
 */

import { Outlet } from 'react-router-dom';

/**
 * AuthLayout component
 * "Floating Box" design centered on screen
 */
export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1e3a8a] via-[#002366] to-[#0d1b3e] p-4">
      {/* 
        Background effects or "water" feel could be enhanced here with CSS patterns 
        For now, a deep blue radial gradient gives a premium "deep water" feel.
      */}

      <div className="w-full max-w-[550px] animate-in fade-in zoom-in duration-500">
        <div className="bg-card/95 backdrop-blur-md shadow-[0_8px_40px_rgb(0,0,0,0.4)] rounded-2xl border border-white/10 overflow-hidden p-6 md:p-8">
          <Outlet />
        </div>

        <div className="mt-6 text-center">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Namaste PMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
