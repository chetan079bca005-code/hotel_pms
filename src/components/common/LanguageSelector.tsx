/**
 * Hotel PMS - Language Selector Component
 * Dropdown component for switching between languages
 */

import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { languages, changeLanguage, type LanguageCode } from '@/i18n';
import { cn } from '@/lib/utils';

interface LanguageSelectorProps {
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
}

/**
 * LanguageSelector component
 * Provides a dropdown for users to switch between available languages
 */
export function LanguageSelector({
  variant = 'ghost',
  size = 'default',
  showLabel = true,
  className,
}: LanguageSelectorProps) {
  const { i18n } = useTranslation();
  
  // Get current language info
  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];
  
  // Handle language change
  const handleLanguageChange = (code: LanguageCode) => {
    changeLanguage(code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={cn('gap-2', className)}>
          <Globe className="h-4 w-4" />
          {showLabel && (
            <span className="hidden sm:inline-block">
              {currentLanguage.nativeName}
            </span>
          )}
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language.code)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">{language.flag}</span>
              <div className="flex flex-col">
                <span className="font-medium">{language.nativeName}</span>
                <span className="text-xs text-muted-foreground">{language.name}</span>
              </div>
            </div>
            {i18n.language === language.code && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
