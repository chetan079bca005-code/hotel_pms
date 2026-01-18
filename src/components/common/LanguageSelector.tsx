/**
 * Hotel PMS - Language Selector Component
 * Direct toggle button to switch between English and Nepali
 */

import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { changeLanguage } from '@/i18n';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

/**
 * LanguageSelector component
 * Direct button that toggles between English and Nepali
 */
export function LanguageSelector({
  variant = 'ghost',
  size = 'icon',
  showLabel = false,
  className,
}: LanguageSelectorProps) {
  const { i18n } = useTranslation();

  const currentLanguage = i18n.language;
  const isNepali = currentLanguage === 'ne';

  const toggleLanguage = () => {
    const newLang = isNepali ? 'en' : 'ne';
    changeLanguage(newLang);
  };

  if (showLabel) {
    return (
      <Button
        variant={variant}
        size={size}
        className={cn("gap-2", className)}
        onClick={toggleLanguage}
        title={isNepali ? 'Switch to English' : 'नेपालीमा स्विच गर्नुहोस्'}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {isNepali ? 'नेपाली' : 'English'}
        </span>
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={toggleLanguage}
      title={isNepali ? 'Switch to English' : 'नेपालीमा स्विच गर्नुहोस्'}
    >
      <Globe className="h-[1.2rem] w-[1.2rem]" />
      <span className="sr-only">Toggle language</span>
    </Button>
  );
}
