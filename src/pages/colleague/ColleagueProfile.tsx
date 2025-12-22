import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Phone, MapPin, Bell, Lock, CheckCircle, Edit2, Save, X, Shield } from "lucide-react";

const ColleagueProfile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [notifications, setNotifications] = useState({
    statusUpdate: true,
    maintenance: true,
    newsletter: false,
    smsAlerts: true,
  });

  const handleSave = () => {
    setSuccess("Profile updated successfully!");
    setIsEditing(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tight">My Profile</h1>
          <p className="text-muted-foreground mt-1">Manage your personal information and preferences</p>
        </div>
        <Badge className="w-fit" variant="outline">
          <Shield className="h-3 w-3 mr-1" />
          Verified Colleague
        </Badge>
      </div>

      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-3xl font-bold text-white">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{user?.name || "Adwoa Mensah"}</h2>
              <p className="text-muted-foreground">{user?.email || "adwoa.m@ABSA.com"}</p>
              <div className="flex gap-2 mt-2">
                <Badge>Colleague</Badge>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row justify-between items-center border-b">
          <div>
            <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Your contact details and address information</p>
          </div>
          {!isEditing ? (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent className="p-6">
          {isEditing ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" defaultValue={user?.name || "Adwoa Mensah"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Contact Number</Label>
                <Input id="phone" defaultValue="+233 24 123 4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" defaultValue={user?.email || "adwoa.m@ABSA.com"} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" defaultValue="Facilities Management" />
              </div>
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" defaultValue="15 Osu Avenue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" defaultValue="Accra" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input id="region" defaultValue="Greater Accra" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user?.name || "Adwoa Mensah"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contact Number</p>
                  <p className="font-medium">+233 24 123 4567</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-medium">{user?.email || "adwoa.m@ABSA.com"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Department</p>
                  <p className="font-medium">Facilities Management</p>
                </div>
              </div>
              <div className="md:col-span-2 flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">15 Osu Avenue, Accra, Greater Accra</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold">Notification Preferences</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Choose how you want to receive updates and alerts</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="status-update" className="font-medium cursor-pointer">Request Status Updates</Label>
              <p className="text-sm text-muted-foreground">Get notified when your request status changes</p>
            </div>
            <Switch
              id="status-update"
              checked={notifications.statusUpdate}
              onCheckedChange={(checked) => setNotifications({ ...notifications, statusUpdate: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="maintenance-update" className="font-medium cursor-pointer">Maintenance Announcements</Label>
              <p className="text-sm text-muted-foreground">Receive updates about scheduled maintenance</p>
            </div>
            <Switch
              id="maintenance-update"
              checked={notifications.maintenance}
              onCheckedChange={(checked) => setNotifications({ ...notifications, maintenance: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <Label htmlFor="newsletter-update" className="font-medium cursor-pointer">Monthly Newsletters</Label>
              <p className="text-sm text-muted-foreground">Get property updates and news</p>
            </div>
            <Switch
              id="newsletter-update"
              checked={notifications.newsletter}
              onCheckedChange={(checked) => setNotifications({ ...notifications, newsletter: checked })}
            />
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <Label htmlFor="sms-alerts" className="font-medium cursor-pointer">SMS Alerts</Label>
              <p className="text-sm text-muted-foreground">Receive urgent notifications via SMS</p>
            </div>
            <Switch
              id="sms-alerts"
              checked={notifications.smsAlerts}
              onCheckedChange={(checked) => setNotifications({ ...notifications, smsAlerts: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold">Security Settings</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Manage your password and account security</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Change Password</h3>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" placeholder="Enter current password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" placeholder="Enter new password" />
                <p className="text-xs text-muted-foreground">Must be at least 8 characters with uppercase, lowercase, and numbers</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" placeholder="Confirm new password" />
              </div>
              <Button className="bg-primary hover:bg-primary/90">
                <Lock className="h-4 w-4 mr-2" />
                Update Password
              </Button>
            </div>
          </div>
          <div className="pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Two-Factor Authentication</h3>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
              <div>
                <p className="font-medium">Enable 2FA</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Button variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Enable
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ColleagueProfile;
