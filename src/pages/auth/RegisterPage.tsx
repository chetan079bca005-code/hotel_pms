/**
 * Hotel PMS - Register Page
 * User registration page with improved UX and password strength indicator
 */

import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, BedDouble, AlertCircle, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

/**
 * Registration form schema
 */
const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  role: z.enum(['superadmin', 'manager', 'receptionist', 'housekeeping', 'kitchen', 'revenue']),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

/**
 * Password strength calculator
 */
function calculatePasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 10;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 15;
  if (/[0-9]/.test(password)) score += 15;
  if (/[^A-Za-z0-9]/.test(password)) score += 15;
  
  if (score <= 25) return { score, label: 'Weak', color: 'bg-red-500' };
  if (score <= 50) return { score, label: 'Fair', color: 'bg-orange-500' };
  if (score <= 75) return { score, label: 'Good', color: 'bg-yellow-500' };
  return { score: Math.min(score, 100), label: 'Strong', color: 'bg-green-500' };
}

/**
 * Password requirements checker
 */
function getPasswordRequirements(password: string) {
  return [
    { met: password.length >= 8, label: 'At least 8 characters' },
    { met: /[A-Z]/.test(password), label: 'One uppercase letter' },
    { met: /[a-z]/.test(password), label: 'One lowercase letter' },
    { met: /[0-9]/.test(password), label: 'One number' },
  ];
}

/**
 * RegisterPage component
 */
export default function RegisterPage() {
  const navigate = useNavigate();
  const { register: registerUser, isRegistering, isAuthenticated, error } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [registerError, setRegisterError] = React.useState<string | null>(null);

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  // Form handling
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: 'manager',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const acceptTerms = watch('acceptTerms');
  const password = watch('password');
  const selectedRole = watch('role');

  // Password strength
  const passwordStrength = React.useMemo(() => calculatePasswordStrength(password || ''), [password]);
  const passwordRequirements = React.useMemo(() => getPasswordRequirements(password || ''), [password]);

  // Handle form submission
  const onSubmit = async (data: RegisterFormData) => {
    setRegisterError(null);
    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password,
        confirmPassword: data.confirmPassword,
        acceptTerms: data.acceptTerms,
      });
    } catch (err: any) {
      setRegisterError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
          <BedDouble className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Create an account</h1>
        <p className="text-sm text-muted-foreground">
          Join Namaste PMS to manage your property
        </p>
      </div>

      {/* Error Alert */}
      {(registerError || error) && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{registerError || error}</AlertDescription>
        </Alert>
      )}

      {/* Registration Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              placeholder="First Name"
              leftIcon={<User className="h-4 w-4" />}
              error={!!errors.firstName}
              errorMessage={errors.firstName?.message}
              {...register('firstName')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              placeholder="Last Name"
              error={!!errors.lastName}
              errorMessage={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
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

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+977-98XXXXXXXX"
            leftIcon={<Phone className="h-4 w-4" />}
            error={!!errors.phone}
            errorMessage={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        {/* Role Selection */}
        <div className="space-y-2">
          <Label>Select Your Role</Label>
          <Select onValueChange={(val: any) => setValue('role', val)} value={selectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">
                <div className="flex flex-col">
                  <span className="font-medium">Manager</span>
                  <span className="text-xs text-muted-foreground">Operations Hub - Full hotel management</span>
                </div>
              </SelectItem>
              <SelectItem value="receptionist">
                <div className="flex flex-col">
                  <span className="font-medium">Receptionist</span>
                  <span className="text-xs text-muted-foreground">Front Desk - Check-in/out, bookings</span>
                </div>
              </SelectItem>
              <SelectItem value="housekeeping">
                <div className="flex flex-col">
                  <span className="font-medium">Housekeeping</span>
                  <span className="text-xs text-muted-foreground">Room Staff - Cleaning & maintenance</span>
                </div>
              </SelectItem>
              <SelectItem value="kitchen">
                <div className="flex flex-col">
                  <span className="font-medium">Kitchen Staff</span>
                  <span className="text-xs text-muted-foreground">Restaurant - Order management</span>
                </div>
              </SelectItem>
              <SelectItem value="revenue">
                <div className="flex flex-col">
                  <span className="font-medium">Revenue Manager</span>
                  <span className="text-xs text-muted-foreground">Financial - Reports & analytics</span>
                </div>
              </SelectItem>
              <SelectItem value="superadmin">
                <div className="flex flex-col">
                  <span className="font-medium">Super Admin / Owner</span>
                  <span className="text-xs text-muted-foreground">Multi-Property - Complete access</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.role && <p className="text-xs text-destructive">{errors.role.message}</p>}
        </div>

        {/* Password Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={!!errors.password}
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
            
            {/* Password Strength Indicator */}
            {password && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Progress value={passwordStrength.score} className="h-2 flex-1" />
                  <span className={cn(
                    "text-xs font-medium",
                    passwordStrength.score <= 25 && "text-red-500",
                    passwordStrength.score > 25 && passwordStrength.score <= 50 && "text-orange-500",
                    passwordStrength.score > 50 && passwordStrength.score <= 75 && "text-yellow-500",
                    passwordStrength.score > 75 && "text-green-500"
                  )}>
                    {passwordStrength.label}
                  </span>
                </div>
                
                {/* Password Requirements */}
                <div className="grid grid-cols-2 gap-1">
                  {passwordRequirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs">
                      {req.met ? (
                        <Check className="h-3 w-3 text-green-500" />
                      ) : (
                        <X className="h-3 w-3 text-muted-foreground" />
                      )}
                      <span className={req.met ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                leftIcon={<Lock className="h-4 w-4" />}
                error={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-10 px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 pt-2">
          <Checkbox
            id="terms"
            checked={acceptTerms}
            onCheckedChange={(checked) => setValue('acceptTerms', checked as boolean)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="text-sm font-normal cursor-pointer leading-relaxed">
            I agree to the{' '}
            <Link to="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
        {errors.acceptTerms && (
          <p className="text-xs text-destructive">{errors.acceptTerms.message}</p>
        )}

        <Button type="submit" className="w-full" size="lg" loading={isRegistering}>
          Create Account
        </Button>
      </form>

      <div className="relative">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          OR
        </span>
      </div>

      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
