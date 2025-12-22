import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Briefcase, CreditCard, Bell, Shield, CheckCircle, Edit2, Save, X } from "lucide-react";

const VendorProfileSettings = () => {
  const [activeSection, setActiveSection] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [success, setSuccess] = useState("");
  const [notifications, setNotifications] = useState({
    emailInvoice: true,
    emailWorkOrder: true,
    emailPayment: true,
    smsReminders: false,
  });

  const handleSave = () => {
    setSuccess("Profile updated successfully!");
    setIsEditing(false);
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div>
        <h1 className="text-3xl font-bold">Profile & Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-12 gap-8">
        <aside className="col-span-12 md:col-span-3">
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  AS
                </div>
                <div>
                  <h2 className="font-semibold">Ama Serwaa</h2>
                  <p className="text-sm text-muted-foreground">ama.serwaa@example.com</p>
                  <Badge className="mt-1" variant="outline">Verified Vendor</Badge>
                </div>
              </div>
              <div className="space-y-1">
                <button onClick={() => setActiveSection("personal")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeSection === "personal" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <User className="h-4 w-4" />
                  <p className="text-sm font-medium">Personal Information</p>
                </button>
                <button onClick={() => setActiveSection("business")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeSection === "business" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <Briefcase className="h-4 w-4" />
                  <p className="text-sm font-medium">Business Details</p>
                </button>
                <button onClick={() => setActiveSection("payment")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeSection === "payment" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <CreditCard className="h-4 w-4" />
                  <p className="text-sm font-medium">Payment Information</p>
                </button>
                <button onClick={() => setActiveSection("notifications")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeSection === "notifications" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <Bell className="h-4 w-4" />
                  <p className="text-sm font-medium">Notifications</p>
                </button>
                <button onClick={() => setActiveSection("security")} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${activeSection === "security" ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}>
                  <Shield className="h-4 w-4" />
                  <p className="text-sm font-medium">Security</p>
                </button>
              </div>
            </CardContent>
          </Card>
        </aside>

        <div className="col-span-12 md:col-span-9 space-y-6">
          {activeSection === "personal" && (
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage your personal details and contact information</p>
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
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditing ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input defaultValue="Ama Serwaa" />
                    </div>
                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input type="email" defaultValue="ama.serwaa@example.com" />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input defaultValue="+233 24 123 4567" />
                    </div>
                    <div className="space-y-2">
                      <Label>Digital Address</Label>
                      <Input defaultValue="GA-123-4567" />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label>Street Address</Label>
                      <Textarea defaultValue="15 Osu Badu Street, Accra, Ghana" rows={2} />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Full Name</p>
                      <p className="font-medium">Ama Serwaa</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Email Address</p>
                      <p className="font-medium">ama.serwaa@example.com</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Phone Number</p>
                      <p className="font-medium">+233 24 123 4567</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Digital Address</p>
                      <p className="font-medium">GA-123-4567</p>
                    </div>
                    <div className="sm:col-span-2 space-y-1">
                      <p className="text-sm text-muted-foreground">Street Address</p>
                      <p className="font-medium">15 Osu Badu Street, Accra, Ghana</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeSection === "business" && (

            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold">Business Details</CardTitle>
                    <p className="text-sm text-muted-foreground">Update your company information and services offered</p>
                  </div>
                  <Button variant="outline"><Edit2 className="h-4 w-4 mr-2" />Edit</Button>
                </div>
              </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Business Name</p>
                <p className="font-medium">Kojo's Plumbing Works</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Business Registration Number</p>
                <p className="font-medium">CS123452024</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Tax Identification Number (TIN)</p>
                <p className="font-medium">GHA1234567890</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Services Offered</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge>Plumbing</Badge>
                  <Badge>Electrical</Badge>
                  <Badge>Carpentry</Badge>
                </div>
              </div>
            </CardContent>
            </Card>
          )}

          {activeSection === "payment" && (
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-2xl font-bold">Payment Information</CardTitle>
                    <p className="text-sm text-muted-foreground">Manage your bank details for receiving payments</p>
                  </div>
                  <Button variant="outline"><Edit2 className="h-4 w-4 mr-2" />Edit</Button>
                </div>
              </CardHeader>
            <CardContent className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Bank Name</p>
                <p className="font-medium">GCB Bank</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Account Holder Name</p>
                <p className="font-medium">Kojo's Plumbing Works</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Account Number</p>
                <p className="font-medium">**** **** **** 1234</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Currency</p>
                <p className="font-medium">GHS (Ghanaian Cedi)</p>
              </div>
            </CardContent>
            </Card>
          )}

          {activeSection === "notifications" && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-2xl font-bold">Notification Preferences</CardTitle>
                <p className="text-sm text-muted-foreground">Manage how you receive updates and alerts</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Invoice Status Updates</p>
                    <p className="text-sm text-muted-foreground">Get notified when invoice status changes</p>
                  </div>
                  <Switch checked={notifications.emailInvoice} onCheckedChange={(checked) => setNotifications({...notifications, emailInvoice: checked})} />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Work Order Assignments</p>
                    <p className="text-sm text-muted-foreground">Receive alerts for new work orders</p>
                  </div>
                  <Switch checked={notifications.emailWorkOrder} onCheckedChange={(checked) => setNotifications({...notifications, emailWorkOrder: checked})} />
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <div>
                    <p className="font-medium">Payment Confirmations</p>
                    <p className="text-sm text-muted-foreground">Get notified when payments are processed</p>
                  </div>
                  <Switch checked={notifications.emailPayment} onCheckedChange={(checked) => setNotifications({...notifications, emailPayment: checked})} />
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium">SMS Reminders</p>
                    <p className="text-sm text-muted-foreground">Receive text message reminders</p>
                  </div>
                  <Switch checked={notifications.smsReminders} onCheckedChange={(checked) => setNotifications({...notifications, smsReminders: checked})} />
                </div>
              </CardContent>
            </Card>
          )}

          {activeSection === "security" && (
            <Card>
              <CardHeader className="border-b">
                <CardTitle className="text-2xl font-bold">Security Settings</CardTitle>
                <p className="text-sm text-muted-foreground">Manage your password and account security</p>
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>New Password</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Confirm New Password</Label>
                      <Input type="password" />
                    </div>
                    <Button>Update Password</Button>
                  </div>
                </div>
                <div className="pt-6 border-t">
                  <h3 className="font-semibold mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Enable 2FA</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Button variant="outline">Enable</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorProfileSettings;
