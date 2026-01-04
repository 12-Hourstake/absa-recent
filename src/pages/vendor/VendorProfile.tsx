import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Wrench,
  Edit,
  Save,
  ArrowLeft,
  Star,
  Camera,
  Upload,
  AlertTriangle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { useAuth } from "@/contexts/AuthContext";
import { useSLA } from "@/contexts/SLAContext";

const VendorProfile = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { user } = useAuth();
  const { penalties } = useSLA();

  // Calculate vendor penalties
  const vendorPenalties = penalties?.filter(p => p.vendor === user?.name) || [];
  const totalPenalties = vendorPenalties.reduce((sum, p) => sum + (p.calculatedAmount || 0), 0);
  const pendingPenalties = vendorPenalties.filter(p => p.status === 'Pending Payment').length;

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string>("");
  const [isUploadingPicture, setIsUploadingPicture] = useState(false);

  const [profileData, setProfileData] = useState({
    companyName: user?.name || "",
    contactPerson: "John Doe",
    email: user?.email || "",
    phone: "+233 24 345 6789",
    address: "123 Industrial Road, Accra",
    city: "Accra",
    region: "Greater Accra",
    services: "Electrical installation, maintenance, and repairs",
    rating: "4.8",
    status: "Active",
    contractStartDate: "2024-02-01",
    contractEndDate: "2025-02-01",
    lastLogin: user?.lastLogin?.toLocaleDateString() || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log("Profile updated:", profileData);
      setSuccess(true);
      setIsEditing(false);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      setTimeout(() => setError(null), 3000);
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsUploadingPicture(true);
    setError(null);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfilePicture(event.target.result as string);
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      };
      reader.readAsDataURL(file);

      // Simulate API upload
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      setError('Failed to upload profile picture');
      setTimeout(() => setError(null), 3000);
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <User className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">
              Vendor Profile
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your company information and service details.
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Save className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backButtonText}
          </Button>
        </div>
      </div>

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ Profile updated successfully!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Company Overview */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Company Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profilePicture || "/placeholder-company.jpg"} />
                  <AvatarFallback className="text-lg">
                    {profileData.companyName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="vendor-profile-picture-upload"
                  className="absolute bottom-0 right-0 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors"
                  title="Upload company logo"
                >
                  {isUploadingPicture ? (
                    <Upload className="h-4 w-4 animate-spin" />
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </label>
                <input
                  id="vendor-profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureChange}
                  className="hidden"
                  disabled={isUploadingPicture}
                />
              </div>
              {profilePicture && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveProfilePicture}
                  className="text-xs"
                >
                  Remove Logo
                </Button>
              )}
              <div className="text-center">
                <h3 className="text-lg font-semibold">
                  {profileData.companyName}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profileData.contactPerson}
                </p>
                <div className="flex items-center justify-center gap-1 mt-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">
                    {profileData.rating}
                  </span>
                </div>
                <Badge className="mt-2" variant="outline">
                  <Wrench className="mr-1 h-3 w-3" />
                  {profileData.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>
                  {profileData.city}, {profileData.region}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  Contract: {profileData.contractStartDate} -{" "}
                  {profileData.contractEndDate}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last Login: {profileData.lastLogin}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Company Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={profileData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input
                  id="contactPerson"
                  value={profileData.contactPerson}
                  onChange={(e) =>
                    handleInputChange("contactPerson", e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={profileData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profileData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={profileData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="services">Services Offered</Label>
              <Textarea
                id="services"
                value={profileData.services}
                onChange={(e) => handleInputChange("services", e.target.value)}
                disabled={!isEditing}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold">156</div>
              <p className="text-sm text-muted-foreground">
                Work Orders Completed
              </p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-sm text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">12</div>
              <p className="text-sm text-muted-foreground">Active Contracts</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">98%</div>
              <p className="text-sm text-muted-foreground">
                On-Time Completion
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SLA Penalties */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            SLA Penalties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">
                GH₵ {totalPenalties.toLocaleString('en-GH', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-sm text-muted-foreground">Total Penalties</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingPenalties}</div>
              <p className="text-sm text-muted-foreground">Pending Payment</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-slate-600">{vendorPenalties.length}</div>
              <p className="text-sm text-muted-foreground">Total Breaches</p>
            </div>
          </div>
          
          {vendorPenalties.length > 0 ? (
            <div className="space-y-3">
              <h4 className="font-semibold text-sm">Recent Penalties</h4>
              {vendorPenalties.slice(0, 5).map((penalty) => (
                <div key={penalty.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{penalty.slaType}</p>
                    <p className="text-xs text-muted-foreground">
                      {penalty.createdAt.toLocaleDateString()} • {penalty.severityLevel}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">
                      GH₵ {(penalty.calculatedAmount || 0).toLocaleString('en-GH', { minimumFractionDigits: 2 })}
                    </p>
                    <Badge className={penalty.status === 'Pending Payment' ? 'bg-yellow-100 text-yellow-800' : penalty.status === 'Invoice Sent' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}>
                      {penalty.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <p>No SLA penalties recorded</p>
              <p className="text-sm mt-1">Maintain excellent service to avoid penalties</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorProfile;
