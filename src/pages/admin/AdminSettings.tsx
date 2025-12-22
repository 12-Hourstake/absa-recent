import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Settings,
  Bell,
  Shield,
  Globe,
  Palette,
  Save,
  ArrowLeft,
  Key,
  Smartphone,
  Mail,
  Building2,
  Users,
  Database,
  Server,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { useTheme } from "@/contexts/ThemeContext";

const AdminSettings = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { theme, setTheme } = useTheme();
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: true,
    pushNotifications: true,
    workOrderAlerts: true,
    maintenanceReminders: true,
    vendorUpdates: false,
    systemAlerts: true,

    // Security
    twoFactorAuth: false,
    sessionTimeout: "30",
    passwordExpiry: "90",

    // System Preferences
    autoRefresh: true,
    defaultDashboard: "overview",
    itemsPerPage: "25",

    // Email Configuration
    smtpServer: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    senderEmail: "",
    senderName: "ABSA Asset Pulse",
  });

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Settings updated:", settings);
      console.log("Current theme:", theme);

      // Save theme to localStorage (already handled by ThemeContext)
      // The theme is automatically persisted when setTheme is called

      setSuccess(true);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleTestEmail = async () => {
    setIsSaving(true);
    try {
      // Simulate API call to test email
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to send test email");
    } finally {
      setIsSaving(false);
    }
  };

  const settingsCategories = [
    {
      id: "notifications",
      title: "Notifications",
      description: "Manage notification preferences and alerts",
      icon: Bell,
      color: "bg-blue-500",
    },
    {
      id: "security",
      title: "Security & Authentication",
      description: "Configure security settings and access control",
      icon: Shield,
      color: "bg-red-500",
    },
    {
      id: "system",
      title: "System Preferences",
      description: "Configure system-wide settings and defaults",
      icon: Globe,
      color: "bg-green-500",
    },
    {
      id: "email",
      title: "Email Configuration",
      description: "Set up SMTP server and email settings",
      icon: Mail,
      color: "bg-orange-500",
    },
    {
      id: "users",
      title: "User Management",
      description: "Manage users, roles, and permissions",
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      id: "branches",
      title: "Branch Management",
      description: "Manage ABSA Bank branches and locations",
      icon: Building2,
      color: "bg-red-500",
    },
    {
      id: "backup",
      title: "Backup & Data",
      description: "Configure backups and data management",
      icon: Database,
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>
          <p className="text-muted-foreground">
            Manage your system configuration and preferences.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backButtonText}
        </Button>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ Settings updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      )}

      {/* Settings Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {settingsCategories.map((category) => (
          <Card
            key={category.id}
            className="hover:shadow-md transition-all cursor-pointer group"
            onClick={() => {
              if (category.id === "branches") {
                navigate("/admin/manage-branches");
              } else {
                setActiveModal(category.id);
              }
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`h-12 w-12 rounded-lg ${category.color}/10 flex items-center justify-center`}
                  >
                    <category.icon
                      className={`h-6 w-6 ${category.color.replace(
                        "bg-",
                        "text-"
                      )}`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Notifications Modal */}
      <Dialog
        open={activeModal === "notifications"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Settings
            </DialogTitle>
            <DialogDescription>
              Configure how you receive notifications and alerts.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("emailNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser push notifications
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("pushNotifications", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="work-order-alerts">Work Order Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new work orders
                </p>
              </div>
              <Switch
                id="work-order-alerts"
                checked={settings.workOrderAlerts}
                onCheckedChange={(checked) =>
                  handleSettingChange("workOrderAlerts", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-reminders">
                  Maintenance Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded about upcoming maintenance
                </p>
              </div>
              <Switch
                id="maintenance-reminders"
                checked={settings.maintenanceReminders}
                onCheckedChange={(checked) =>
                  handleSettingChange("maintenanceReminders", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="vendor-updates">Vendor Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about vendor changes
                </p>
              </div>
              <Switch
                id="vendor-updates"
                checked={settings.vendorUpdates}
                onCheckedChange={(checked) =>
                  handleSettingChange("vendorUpdates", checked)
                }
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-alerts">System Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive critical system alerts
                </p>
              </div>
              <Switch
                id="system-alerts"
                checked={settings.systemAlerts}
                onCheckedChange={(checked) =>
                  handleSettingChange("systemAlerts", checked)
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleSave();
              setActiveModal(null);
            }}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Security Modal */}
      <Dialog
        open={activeModal === "security"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security Settings
            </DialogTitle>
            <DialogDescription>
              Configure security and authentication settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor-auth">
                  Two-Factor Authentication
                </Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch
                id="two-factor-auth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) =>
                  handleSettingChange("twoFactorAuth", checked)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) =>
                  handleSettingChange("sessionTimeout", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password-expiry">Password Expiry</Label>
              <Select
                value={settings.passwordExpiry}
                onValueChange={(value) =>
                  handleSettingChange("passwordExpiry", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleSave();
              setActiveModal(null);
            }}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {/* System Preferences Modal */}
      <Dialog
        open={activeModal === "system"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              System Preferences
            </DialogTitle>
            <DialogDescription>
              Configure system-wide settings and defaults.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-refresh">Auto Refresh</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically refresh dashboard data
                </p>
              </div>
              <Switch
                id="auto-refresh"
                checked={settings.autoRefresh}
                onCheckedChange={(checked) =>
                  handleSettingChange("autoRefresh", checked)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-dashboard">Default Dashboard</Label>
              <Select
                value={settings.defaultDashboard}
                onValueChange={(value) =>
                  handleSettingChange("defaultDashboard", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="assets">Assets</SelectItem>
                  <SelectItem value="workorders">Work Orders</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="items-per-page">Items Per Page</Label>
              <Select
                value={settings.itemsPerPage}
                onValueChange={(value) =>
                  handleSettingChange("itemsPerPage", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleSave();
              setActiveModal(null);
            }}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Email Configuration Modal */}
      <Dialog
        open={activeModal === "email"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email Configuration
            </DialogTitle>
            <DialogDescription>
              Configure SMTP server settings for sending emails.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smtp-server">SMTP Server</Label>
                <Input
                  id="smtp-server"
                  placeholder="smtp.gmail.com"
                  value={settings.smtpServer}
                  onChange={(e) =>
                    handleSettingChange("smtpServer", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp-port">SMTP Port</Label>
                <Input
                  id="smtp-port"
                  placeholder="587"
                  value={settings.smtpPort}
                  onChange={(e) =>
                    handleSettingChange("smtpPort", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-username">SMTP Username</Label>
              <Input
                id="smtp-username"
                placeholder="your-email@example.com"
                value={settings.smtpUsername}
                onChange={(e) =>
                  handleSettingChange("smtpUsername", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">SMTP Password</Label>
              <Input
                id="smtp-password"
                type="password"
                placeholder="••••••••"
                value={settings.smtpPassword}
                onChange={(e) =>
                  handleSettingChange("smtpPassword", e.target.value)
                }
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sender-email">Sender Email</Label>
                <Input
                  id="sender-email"
                  placeholder="noreply@absa.com.gh"
                  value={settings.senderEmail}
                  onChange={(e) =>
                    handleSettingChange("senderEmail", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sender-name">Sender Name</Label>
                <Input
                  id="sender-name"
                  placeholder="ABSA Asset Pulse"
                  value={settings.senderName}
                  onChange={(e) =>
                    handleSettingChange("senderName", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="pt-4 border-t">
              <Button
                variant="outline"
                className="w-full"
                onClick={handleTestEmail}
                disabled={isSaving}
              >
                <Server className="mr-2 h-4 w-4" />
                {isSaving ? "Sending..." : "Send Test Email"}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleSave();
              setActiveModal(null);
            }}>
              <Save className="mr-2 h-4 w-4" />
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Management Modal */}
      <Dialog
        open={activeModal === "users"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </DialogTitle>
            <DialogDescription>
              Manage users, roles, and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">User Management</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Navigate to the dedicated user management section to add, edit, or remove users.
              </p>
              <Button
                onClick={() => {
                  setActiveModal(null);
                  // Navigate to user management page when implemented
                  // navigate("/admin/users");
                }}
              >
                Go to User Management
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Backup & Data Modal */}
      <Dialog
        open={activeModal === "backup"}
        onOpenChange={(open) => !open && setActiveModal(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Backup & Data Management
            </DialogTitle>
            <DialogDescription>
              Configure automatic backups and data retention policies.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-semibold">Automatic Backups</h4>
                  <p className="text-sm text-muted-foreground">
                    Last backup: Today at 03:00 AM
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Backup Frequency</Label>
                <Select defaultValue="daily">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Data Retention Period</Label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-4 border-t flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Database className="mr-2 h-4 w-4" />
                  Create Backup Now
                </Button>
                <Button variant="outline" className="flex-1">
                  <Database className="mr-2 h-4 w-4" />
                  Restore from Backup
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button onClick={() => {
              handleSave();
              setActiveModal(null);
            }}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6 md:grid-cols-2" style={{display: "none"}}>
        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("emailNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-notifications">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive browser push notifications
                </p>
              </div>
              <Switch
                id="push-notifications"
                checked={settings.pushNotifications}
                onCheckedChange={(checked) =>
                  handleSettingChange("pushNotifications", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="work-order-alerts">Work Order Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about new work orders
                </p>
              </div>
              <Switch
                id="work-order-alerts"
                checked={settings.workOrderAlerts}
                onCheckedChange={(checked) =>
                  handleSettingChange("workOrderAlerts", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="maintenance-reminders">
                  Maintenance Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded about upcoming maintenance
                </p>
              </div>
              <Switch
                id="maintenance-reminders"
                checked={settings.maintenanceReminders}
                onCheckedChange={(checked) =>
                  handleSettingChange("maintenanceReminders", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="vendor-updates">Vendor Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified about vendor changes
                </p>
              </div>
              <Switch
                id="vendor-updates"
                checked={settings.vendorUpdates}
                onCheckedChange={(checked) =>
                  handleSettingChange("vendorUpdates", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="system-alerts">System Alerts</Label>
                <p className="text-sm text-muted-foreground">
                  Receive critical system alerts
                </p>
              </div>
              <Switch
                id="system-alerts"
                checked={settings.systemAlerts}
                onCheckedChange={(checked) =>
                  handleSettingChange("systemAlerts", checked)
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="two-factor-auth">
                  Two-Factor Authentication
                </Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security
                </p>
              </div>
              <Switch
                id="two-factor-auth"
                checked={settings.twoFactorAuth}
                onCheckedChange={(checked) =>
                  handleSettingChange("twoFactorAuth", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
              <Select
                value={settings.sessionTimeout}
                onValueChange={(value) =>
                  handleSettingChange("sessionTimeout", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                  <SelectItem value="120">2 hours</SelectItem>
                  <SelectItem value="480">8 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password-expiry">Password Expiry (days)</Label>
              <Select
                value={settings.passwordExpiry}
                onValueChange={(value) =>
                  handleSettingChange("passwordExpiry", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="60">60 days</SelectItem>
                  <SelectItem value="90">90 days</SelectItem>
                  <SelectItem value="180">180 days</SelectItem>
                  <SelectItem value="365">1 year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Key className="mr-2 h-4 w-4" />
                Change Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        {/* <Card> */}
        {/*   <CardHeader> */}
        {/*     <CardTitle className="flex items-center gap-2"> */}
        {/*       <Palette className="h-5 w-5" /> */}
        {/*       Appearance */}
        {/*     </CardTitle> */}
        {/*   </CardHeader> */}
        {/*   <CardContent className="space-y-4"> */}
        {/*     <div className="space-y-2"> */}
        {/*       <div className="flex items-center gap-2"> */}
        {/*         <Label>Accent Color</Label> */}
        {/*         <span className="text-xs text-muted-foreground bg-blue-50 px-2 py-1 rounded-full"> */}
        {/*           Saved with settings */}
        {/*         </span> */}
        {/*       </div> */}
        {/*       <div className="flex flex-wrap gap-2"> */}
        {/*         {( */}
        {/*           [ */}
        {/*             { key: "turquoise", label: "Turquoise" }, */}
        {/*             { key: "blue", label: "Blue" }, */}
        {/*             { key: "green", label: "Green" }, */}
        {/*             { key: "purple", label: "Purple" }, */}
        {/*             { key: "red", label: "Red" }, */}
        {/*           ] as const */}
        {/*         ).map((preset) => ( */}
        {/*           <button */}
        {/*             key={preset.key} */}
        {/*             type="button" */}
        {/*             onClick={() => { */}
        {/*               console.log("🎨 Theme button clicked:", preset.key); */}
        {/*               setTheme(preset.key); */}
        {/*             }} */}
        {/*             className={`h-9 px-3 rounded-full border transition-colors ${ */}
        {/*               theme === preset.key */}
        {/*                 ? "border-foreground" */}
        {/*                 : "border-border" */}
        {/*             }`} */}
        {/*             style={{ */}
        {/*               background: */}
        {/*                 theme === preset.key */}
        {/*                   ? "var(--gradient-primary)" */}
        {/*                   : undefined, */}
        {/*             }} */}
        {/*           > */}
        {/*             {preset.label} */}
        {/*           </button> */}
        {/*         ))} */}
        {/*       </div> */}
        {/*       <p className="text-xs text-muted-foreground"> */}
        {/*         Changes apply instantly and affect all dashboards. Theme will be */}
        {/*         saved with other settings. */}
        {/*       </p> */}
        {/*     </div> */}
        {/*     <div className="space-y-2"> */}
        {/*       <Label htmlFor="theme">Theme</Label> */}
        {/*       <Select */}
        {/*         value={settings.theme} */}
        {/*         onValueChange={(value) => handleSettingChange("theme", value)} */}
        {/*       > */}
        {/*         <SelectTrigger> */}
        {/*           <SelectValue /> */}
        {/*         </SelectTrigger> */}
        {/*         <SelectContent> */}
        {/*           <SelectItem value="light">Light</SelectItem> */}
        {/*           <SelectItem value="dark">Dark</SelectItem> */}
        {/*           <SelectItem value="system">System</SelectItem> */}
        {/*         </SelectContent> */}
        {/*       </Select> */}
        {/*     </div> */}
        {/**/}
        {/*     <div className="space-y-2"> */}
        {/*       <Label htmlFor="language">Language</Label> */}
        {/*       <Select */}
        {/*         value={settings.language} */}
        {/*         onValueChange={(value) => */}
        {/*           handleSettingChange("language", value) */}
        {/*         } */}
        {/*       > */}
        {/*         <SelectTrigger> */}
        {/*           <SelectValue /> */}
        {/*         </SelectTrigger> */}
        {/*         <SelectContent> */}
        {/*           <SelectItem value="en">English</SelectItem> */}
        {/*           <SelectItem value="fr">Français</SelectItem> */}
        {/*           <SelectItem value="es">Español</SelectItem> */}
        {/*           <SelectItem value="de">Deutsch</SelectItem> */}
        {/*         </SelectContent> */}
        {/*       </Select> */}
        {/*     </div> */}
        {/**/}
        {/*     <div className="space-y-2"> */}
        {/*       <Label htmlFor="timezone">Timezone</Label> */}
        {/*       <Select */}
        {/*         value={settings.timezone} */}
        {/*         onValueChange={(value) => */}
        {/*           handleSettingChange("timezone", value) */}
        {/*         } */}
        {/*       > */}
        {/*         <SelectTrigger> */}
        {/*           <SelectValue /> */}
        {/*         </SelectTrigger> */}
        {/*         <SelectContent> */}
        {/*           <SelectItem value="GMT">GMT (UTC+0)</SelectItem> */}
        {/*           <SelectItem value="GMT+1">GMT+1 (UTC+1)</SelectItem> */}
        {/*           <SelectItem value="GMT+2">GMT+2 (UTC+2)</SelectItem> */}
        {/*           <SelectItem value="GMT+3">GMT+3 (UTC+3)</SelectItem> */}
        {/*         </SelectContent> */}
        {/*       </Select> */}
        {/*     </div> */}
        {/*   </CardContent> */}
        {/* </Card> */}

        {/* System Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              System Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-refresh">Auto Refresh</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically refresh dashboard data
                </p>
              </div>
              <Switch
                id="auto-refresh"
                checked={settings.autoRefresh}
                onCheckedChange={(checked) =>
                  handleSettingChange("autoRefresh", checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-dashboard">Default Dashboard</Label>
              <Select
                value={settings.defaultDashboard}
                onValueChange={(value) =>
                  handleSettingChange("defaultDashboard", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overview">Overview</SelectItem>
                  <SelectItem value="assets">Assets</SelectItem>
                  <SelectItem value="workorders">Work Orders</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="items-per-page">Items Per Page</Label>
              <Select
                value={settings.itemsPerPage}
                onValueChange={(value) =>
                  handleSettingChange("itemsPerPage", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default AdminSettings;
