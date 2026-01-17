/**
 * Hotel PMS - Admin Settings Page
 * Hotel configuration and system settings
 */

import * as React from 'react';
import {
  Settings,
  Hotel,
  Bell,
  Lock,
  CreditCard,
  Mail,
  Globe,
  Palette,
  Database,
  Users,
  Shield,
  Printer,
  QrCode,
  Save,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/common';
import { cn } from '@/lib/utils';

/**
 * AdminSettingsPage component
 */
export default function AdminSettingsPage() {
  // State
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('general');
  
  // Form states
  const [hotelName, setHotelName] = React.useState('Grand Hotel Nepal');
  const [hotelEmail, setHotelEmail] = React.useState('info@grandhotelnepal.com');
  const [hotelPhone, setHotelPhone] = React.useState('+977-1-4567890');
  const [hotelAddress, setHotelAddress] = React.useState('Durbar Marg, Kathmandu, Nepal');
  const [checkInTime, setCheckInTime] = React.useState('14:00');
  const [checkOutTime, setCheckOutTime] = React.useState('12:00');
  const [currency, setCurrency] = React.useState('NPR');
  const [timezone, setTimezone] = React.useState('Asia/Kathmandu');
  const [language, setLanguage] = React.useState('en');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = React.useState(true);
  const [smsNotifications, setSmsNotifications] = React.useState(false);
  const [newBookingAlert, setNewBookingAlert] = React.useState(true);
  const [cancellationAlert, setCancellationAlert] = React.useState(true);
  const [lowInventoryAlert, setLowInventoryAlert] = React.useState(true);
  const [reviewAlert, setReviewAlert] = React.useState(true);
  
  // Payment settings
  const [esewaEnabled, setEsewaEnabled] = React.useState(true);
  const [khaltiEnabled, setKhaltiEnabled] = React.useState(true);
  const [cardEnabled, setCardEnabled] = React.useState(true);
  const [cashEnabled, setCashEnabled] = React.useState(true);
  
  // Handle save
  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage hotel configuration and system preferences"
        actions={
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        }
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="general">
            <Hotel className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="payment">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment
          </TabsTrigger>
          <TabsTrigger value="security">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="integrations">
            <Database className="h-4 w-4 mr-2" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="h-4 w-4 mr-2" />
            Appearance
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hotel Information</CardTitle>
              <CardDescription>
                Basic information about your hotel
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hotelName">Hotel Name</Label>
                  <Input
                    id="hotelName"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelEmail">Email</Label>
                  <Input
                    id="hotelEmail"
                    type="email"
                    value={hotelEmail}
                    onChange={(e) => setHotelEmail(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelPhone">Phone</Label>
                  <Input
                    id="hotelPhone"
                    value={hotelPhone}
                    onChange={(e) => setHotelPhone(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotelWebsite">Website</Label>
                  <Input
                    id="hotelWebsite"
                    placeholder="https://www.yourhotel.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="hotelAddress">Address</Label>
                <Textarea
                  id="hotelAddress"
                  value={hotelAddress}
                  onChange={(e) => setHotelAddress(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
              <CardDescription>
                Configure check-in/check-out times and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkInTime">Check-in Time</Label>
                  <Input
                    id="checkInTime"
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOutTime">Check-out Time</Label>
                  <Input
                    id="checkOutTime"
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Cancellation Policy</Label>
                  <Select defaultValue="24h">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="free">Free Cancellation</SelectItem>
                      <SelectItem value="24h">24 Hours Notice</SelectItem>
                      <SelectItem value="48h">48 Hours Notice</SelectItem>
                      <SelectItem value="7d">7 Days Notice</SelectItem>
                      <SelectItem value="non-refundable">Non-refundable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Max Advance Booking</Label>
                  <Select defaultValue="365">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 Days</SelectItem>
                      <SelectItem value="90">90 Days</SelectItem>
                      <SelectItem value="180">180 Days</SelectItem>
                      <SelectItem value="365">365 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Min Stay (Nights)</Label>
                  <Select defaultValue="1">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Night</SelectItem>
                      <SelectItem value="2">2 Nights</SelectItem>
                      <SelectItem value="3">3 Nights</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>
                Regional settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NPR">NPR - Nepali Rupee</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                      <SelectItem value="INR">INR - Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Kathmandu">Asia/Kathmandu (UTC+5:45)</SelectItem>
                      <SelectItem value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Default Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ne">नेपाली (Nepali)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Channels</CardTitle>
              <CardDescription>
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alert Types</CardTitle>
              <CardDescription>
                Choose which events trigger notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Booking</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when a new booking is made
                  </p>
                </div>
                <Switch
                  checked={newBookingAlert}
                  onCheckedChange={setNewBookingAlert}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Cancellation</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when a booking is cancelled
                  </p>
                </div>
                <Switch
                  checked={cancellationAlert}
                  onCheckedChange={setCancellationAlert}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Low Room Inventory</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when available rooms are low
                  </p>
                </div>
                <Switch
                  checked={lowInventoryAlert}
                  onCheckedChange={setLowInventoryAlert}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>New Review</Label>
                  <p className="text-sm text-muted-foreground">
                    Alert when a guest leaves a review
                  </p>
                </div>
                <Switch
                  checked={reviewAlert}
                  onCheckedChange={setReviewAlert}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Settings */}
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure accepted payment methods
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-700 font-bold text-sm">eSewa</span>
                  </div>
                  <div>
                    <p className="font-medium">eSewa</p>
                    <p className="text-sm text-muted-foreground">
                      Digital wallet payments
                    </p>
                  </div>
                </div>
                <Switch
                  checked={esewaEnabled}
                  onCheckedChange={setEsewaEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-700 font-bold text-sm">K</span>
                  </div>
                  <div>
                    <p className="font-medium">Khalti</p>
                    <p className="text-sm text-muted-foreground">
                      Digital wallet payments
                    </p>
                  </div>
                </div>
                <Switch
                  checked={khaltiEnabled}
                  onCheckedChange={setKhaltiEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-muted-foreground">
                      Visa, Mastercard, etc.
                    </p>
                  </div>
                </div>
                <Switch
                  checked={cardEnabled}
                  onCheckedChange={setCardEnabled}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-700 text-lg">💵</span>
                  </div>
                  <div>
                    <p className="font-medium">Cash</p>
                    <p className="text-sm text-muted-foreground">
                      Pay at hotel
                    </p>
                  </div>
                </div>
                <Switch
                  checked={cashEnabled}
                  onCheckedChange={setCashEnabled}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>
                Configure tax rates and service charges
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>VAT Rate (%)</Label>
                  <Input type="number" defaultValue="13" />
                </div>
                <div className="space-y-2">
                  <Label>Service Charge (%)</Label>
                  <Input type="number" defaultValue="10" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password Policy</CardTitle>
              <CardDescription>
                Set requirements for user passwords
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Minimum 8 characters</Label>
                  <p className="text-sm text-muted-foreground">
                    Passwords must be at least 8 characters
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require uppercase & lowercase</Label>
                  <p className="text-sm text-muted-foreground">
                    Mix of uppercase and lowercase letters
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require numbers</Label>
                  <p className="text-sm text-muted-foreground">
                    At least one number required
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require special characters</Label>
                  <p className="text-sm text-muted-foreground">
                    At least one special character (!@#$%^&*)
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session Settings</CardTitle>
              <CardDescription>
                Configure user session behavior
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Session Timeout</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                    <SelectItem value="120">2 hours</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Require 2FA for admin accounts
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations */}
        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Third-Party Integrations</CardTitle>
              <CardDescription>
                Connect with external services
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-blue-700" />
                  </div>
                  <div>
                    <p className="font-medium">Email Service (SMTP)</p>
                    <p className="text-sm text-muted-foreground">
                      Send transactional emails
                    </p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center">
                    <Globe className="h-5 w-5 text-orange-700" />
                  </div>
                  <div>
                    <p className="font-medium">Channel Manager</p>
                    <p className="text-sm text-muted-foreground">
                      Sync with OTAs (Booking.com, etc.)
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Printer className="h-5 w-5 text-green-700" />
                  </div>
                  <div>
                    <p className="font-medium">POS System</p>
                    <p className="text-sm text-muted-foreground">
                      Restaurant point of sale
                    </p>
                  </div>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <QrCode className="h-5 w-5 text-purple-700" />
                  </div>
                  <div>
                    <p className="font-medium">QR Menu System</p>
                    <p className="text-sm text-muted-foreground">
                      Digital menu for restaurant
                    </p>
                  </div>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Branding</CardTitle>
              <CardDescription>
                Customize your hotel's branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    Drop a logo here or click to upload
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG up to 2MB (recommended: 200x50px)
                  </p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#2563eb" className="w-12 h-10 p-1" />
                    <Input defaultValue="#2563eb" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Accent Color</Label>
                  <div className="flex gap-2">
                    <Input type="color" defaultValue="#f59e0b" className="w-12 h-10 p-1" />
                    <Input defaultValue="#f59e0b" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Theme</CardTitle>
              <CardDescription>
                Choose your preferred theme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <button className="p-4 border-2 border-primary rounded-lg text-center">
                  <div className="h-20 bg-white border rounded mb-2" />
                  <span className="text-sm font-medium">Light</span>
                </button>
                <button className="p-4 border-2 rounded-lg text-center hover:border-primary">
                  <div className="h-20 bg-gray-900 rounded mb-2" />
                  <span className="text-sm font-medium">Dark</span>
                </button>
                <button className="p-4 border-2 rounded-lg text-center hover:border-primary">
                  <div className="h-20 bg-gradient-to-b from-white to-gray-900 rounded mb-2" />
                  <span className="text-sm font-medium">System</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
