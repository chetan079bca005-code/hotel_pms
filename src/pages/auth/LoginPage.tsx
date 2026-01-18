/**
 * Hotel PMS - Login Page
 * User authentication page with improved UX and role-based redirects
 * FULLY TRANSLATED - Example implementation for other pages
 */

import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, BedDouble, AlertCircle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next'; // TRANSLATION: Import hook
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';
import { mockUsers } from '@/data/mockData';

/**
 * Login form schema - validation messages will be translated
 */
const getLoginSchema = (t: any) => z.object({
  email: z.string().email(t('errors.invalidEmail')),
  password: z.string().min(1, t('errors.requiredField')),
  role: z.enum(['superadmin', 'manager', 'receptionist', 'housekeeping', 'kitchen', 'revenue']).optional(),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;

/**
 * LoginPage component
 */
export default function LoginPage() {
  const { t } = useTranslation(); // TRANSLATION: Use hook
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoggingIn, isAuthenticated, error } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loginError, setLoginError] = React.useState<string | null>(null);

  // Get redirect URL from location state
  const from = (location.state as any)?.from?.pathname || null;

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(from || '/admin');
    }
  }, [isAuthenticated, navigate, from]);

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(getLoginSchema(t)),
    defaultValues: {
      email: '',
      password: '',
      role: 'manager',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');
  const selectedRole = watch('role');

  // Demo credentials - translated descriptions
  const demoCredentials = [
    { email: 'superadmin@namastepms.com', role: 'Super Admin', description: t('auth.loginTitle') },
    { email: 'manager@namastepms.com', role: 'Manager', description: t('nav.dashboard') },
    { email: 'receptionist@namastepms.com', role: 'Receptionist', description: t('nav.bookings') },
    { email: 'housekeeping@namastepms.com', role: 'Housekeeping', description: t('nav.housekeeping') },
    { email: 'kitchen@namastepms.com', role: 'Kitchen', description: t('nav.orders') },
    { email: 'revenue@namastepms.com', role: 'Revenue Manager', description: t('nav.reports') },
  ];

  // Quick fill demo credentials
  const fillDemoCredentials = (email: string) => {
    setValue('email', email);
    setValue('password', 'demo123');

    // Auto-select role based on email
    if (email.includes('superadmin')) setValue('role', 'superadmin');
    else if (email.includes('manager')) setValue('role', 'manager');
    else if (email.includes('receptionist')) setValue('role', 'receptionist');
    else if (email.includes('housekeeping')) setValue('role', 'housekeeping');
    else if (email.includes('kitchen')) setValue('role', 'kitchen');
    else if (email.includes('revenue')) setValue('role', 'revenue');
  };

  // Handle form submission
  const onSubmit = async (data: LoginFormData) => {
    setLoginError(null);
    try {
      await login({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe,
        role: data.role as any,
      });
    } catch (err: any) {
      setLoginError(err.message || t('errors.invalidCredentials'));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
          <BedDouble className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{t('auth.loginTitle')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      {/* Error Alert */}
      {(loginError || error) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{loginError || error}</AlertDescription>
        </Alert>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            leftIcon={<Mail className="h-4 w-4" />}
            error={!!errors.email}
            errorMessage={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              {t('auth.forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder={t('auth.password')}
              leftIcon={<Lock className="h-4 w-4" />}
              error={!!errors.password}
              errorMessage={errors.password?.message}
              {...register('password')}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 px-3 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Role Selection (Simulation Mode) */}
        <div className="space-y-2">
          <Label>{t('auth.loginTitle')} ({t('common.role', { defaultValue: 'Role' })})</Label>
          <Select onValueChange={(val: any) => setValue('role', val)} value={selectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="superadmin">Super Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="receptionist">Receptionist</SelectItem>
              <SelectItem value="housekeeping">Housekeeping</SelectItem>
              <SelectItem value="kitchen">Kitchen</SelectItem>
              <SelectItem value="revenue">Revenue Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Remember Me */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setValue('rememberMe', !!checked)}
          />
          <label
            htmlFor="remember"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
          >
            {t('auth.rememberMe')}
          </label>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? t('common.loading') : t('auth.signIn')}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">
            {t('common.or', { defaultValue: 'or' })}
          </span>
        </div>
      </div>

      {/* Demo Credentials Dropdown */}
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <Info className="h-4 w-4 text-primary" />
          {t('common.demo', { defaultValue: 'Demo Credentials' })}
        </Label>
        <Select onValueChange={(email: string) => fillDemoCredentials(email)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={t('common.clickToFill', { defaultValue: 'Click to select and auto-fill' })} />
          </SelectTrigger>
          <SelectContent>
            {demoCredentials.map((cred) => (
              <SelectItem key={cred.email} value={cred.email}>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{cred.role}</span>
                  <span className="text-muted-foreground text-xs">({cred.email})</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          {t('common.password', { defaultValue: 'Password' })}: <code className="bg-muted px-1 py-0.5 rounded">demo123</code>
        </p>
      </div>

      {/* Sign Up Link */}
      <div className="text-center text-sm">
        <span className="text-muted-foreground">{t('auth.noAccount')} </span>
        <Link to="/register" className="text-primary hover:underline font-medium">
          {t('auth.signUp')}
        </Link>
      </div>
    </div>
  );
}
