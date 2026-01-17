/**
 * Hotel PMS - Login Page
 * User authentication page with improved UX and role-based redirects
 */

import * as React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, BedDouble, AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from '@/hooks/useAuth';
import { mockUsers } from '@/data/mockData';

/**
 * Login form schema
 */
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  role: z.enum(['superadmin', 'manager', 'receptionist', 'housekeeping', 'kitchen', 'revenue']).optional(),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Demo credentials for quick access
 */
const demoCredentials = [
  { email: 'superadmin@namastepms.com', role: 'Super Admin', description: 'Full system access' },
  { email: 'manager@namastepms.com', role: 'Manager', description: 'Hotel management' },
  { email: 'receptionist@namastepms.com', role: 'Receptionist', description: 'Front desk operations' },
  { email: 'housekeeping@namastepms.com', role: 'Housekeeping', description: 'Room management' },
  { email: 'kitchen@namastepms.com', role: 'Kitchen', description: 'Restaurant orders' },
  { email: 'revenue@namastepms.com', role: 'Revenue Manager', description: 'Financial reports' },
];

/**
 * LoginPage component
 */
export default function LoginPage() {
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
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'manager',
      rememberMe: false,
    },
  });

  const rememberMe = watch('rememberMe');
  const selectedRole = watch('role');

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
      setLoginError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-2">
          <BedDouble className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your Namaste PMS account
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
          <Label htmlFor="email">Email address</Label>
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
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-xs text-primary hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
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
          <Label>Login As (Role)</Label>
          <Select onValueChange={(val: any) => setValue('role', val)} value={selectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Manager</span>
                  <span className="text-xs text-muted-foreground">- Operations Hub</span>
                </div>
              </SelectItem>
              <SelectItem value="receptionist">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Receptionist</span>
                  <span className="text-xs text-muted-foreground">- Front Desk</span>
                </div>
              </SelectItem>
              <SelectItem value="housekeeping">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Housekeeping</span>
                  <span className="text-xs text-muted-foreground">- Room Staff</span>
                </div>
              </SelectItem>
              <SelectItem value="kitchen">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Kitchen</span>
                  <span className="text-xs text-muted-foreground">- Restaurant Staff</span>
                </div>
              </SelectItem>
              <SelectItem value="revenue">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Revenue Manager</span>
                  <span className="text-xs text-muted-foreground">- Financial</span>
                </div>
              </SelectItem>
              <SelectItem value="superadmin">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Super Admin</span>
                  <span className="text-xs text-muted-foreground">- Multi-Property</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">
            * Select the role you want to simulate for this demo session
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setValue('rememberMe', checked as boolean)}
          />
          <Label htmlFor="remember" className="text-sm font-normal cursor-pointer text-muted-foreground">
            Remember me for 30 days
          </Label>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isLoggingIn}>
          Sign in
        </Button>
      </form>

      {/* Demo Credentials Section */}
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="demo" className="border rounded-lg">
          <AccordionTrigger className="px-4 hover:no-underline">
            <div className="flex items-center gap-2 text-sm">
              <Info className="h-4 w-4 text-primary" />
              <span>Demo Mode - Quick Access</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-4 pb-4">
            <p className="text-xs text-muted-foreground mb-3">
              Click on any account below to auto-fill credentials. Password: <code className="bg-muted px-1 rounded">demo123</code>
            </p>
            <div className="grid gap-2">
              {demoCredentials.map((cred) => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => fillDemoCredentials(cred.email)}
                  className="flex items-center justify-between p-2 text-left text-sm border rounded-md hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <p className="font-medium">{cred.role}</p>
                    <p className="text-xs text-muted-foreground">{cred.description}</p>
                  </div>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{cred.email}</code>
                </button>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Separator />

      <div className="text-center text-sm">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
