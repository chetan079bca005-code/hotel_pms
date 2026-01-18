/**
 * Hotel PMS - Theme Toggle Component
 * Direct toggle button to switch between light and dark themes
 */

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/providers/ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

/**
 * ThemeToggle component
 * Direct button that toggles between light and dark themes
 */
export function ThemeToggle({
  variant = 'ghost',
  size = 'icon',
  className,
}: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={toggleTheme}
      title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
