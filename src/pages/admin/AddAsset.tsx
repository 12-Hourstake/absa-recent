import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Package, Save, ArrowLeft, Upload, MapPin, Calendar, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { useAssets } from "@/contexts/AssetContext";
import { AssetType, AssetCategory, AssetStatus, AssetPriority, CreateAssetData } from "@/types/asset";
import { getBranchNames } from "@/data/mockBranches";

const AddAsset = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { addAsset, isLoading, error } = useAssets();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    type: AssetType.OTHER,
    category: AssetCategory.OFFICE_EQUIPMENT,
    description: '',
    location: {
      branch: '',
      floor: '',
      room: '',
      specificLocation: ''
    },
    technicalDetails: {
      serialNumber: '',
      model: '',
      manufacturer: '',
      supplier: ''
    },
    financialDetails: {
      purchaseDate: '',
      purchasePrice: '',
      warrantyExpiry: ''
    },
    status: AssetStatus.ACTIVE,
    priority: AssetPriority.MEDIUM
  });

  const assetTypes = [
    { value: AssetType.HVAC_EQUIPMENT, label: 'HVAC Equipment' },
    { value: AssetType.ELECTRICAL_EQUIPMENT, label: 'Electrical Equipment' },
    { value: AssetType.IT_EQUIPMENT, label: 'IT Equipment' },
    { value: AssetType.FURNITURE, label: 'Furniture' },
    { value: AssetType.SECURITY_EQUIPMENT, label: 'Security Equipment' },
    { value: AssetType.PLUMBING_EQUIPMENT, label: 'Plumbing Equipment' },
    { value: AssetType.FIRE_SAFETY_EQUIPMENT, label: 'Fire Safety Equipment' },
    { value: AssetType.GENERATOR, label: 'Generator' },
    { value: AssetType.ELEVATOR, label: 'Elevator' },
    { value: AssetType.OTHER, label: 'Other' }
  ];

  const categories = [
    { value: AssetCategory.CRITICAL_INFRASTRUCTURE, label: 'Critical Infrastructure' },
    { value: AssetCategory.OFFICE_EQUIPMENT, label: 'Office Equipment' },
    { value: AssetCategory.MAINTENANCE_EQUIPMENT, label: 'Maintenance Equipment' },
    { value: AssetCategory.SAFETY_EQUIPMENT, label: 'Safety Equipment' },
    { value: AssetCategory.IT_INFRASTRUCTURE, label: 'IT Infrastructure' },
    { value: AssetCategory.BUILDING_SYSTEMS, label: 'Building Systems' }
  ];

  const branches = getBranchNames();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      console.log('📝 Submitting asset data:', formData);
      
      // Prepare the asset data for the context
      const assetData: CreateAssetData = {
        name: formData.name,
        type: formData.type,
        category: formData.category,
        description: formData.description || undefined,
        location: {
          branch: formData.location.branch,
          floor: formData.location.floor || undefined,
          room: formData.location.room || undefined,
          specificLocation: formData.location.specificLocation || undefined
        },
        technicalDetails: {
          serialNumber: formData.technicalDetails.serialNumber || undefined,
          model: formData.technicalDetails.model || undefined,
          manufacturer: formData.technicalDetails.manufacturer || undefined,
          supplier: formData.technicalDetails.supplier || undefined
        },
        financialDetails: {
          purchaseDate: formData.financialDetails.purchaseDate || undefined,
          purchasePrice: formData.financialDetails.purchasePrice ? parseFloat(formData.financialDetails.purchasePrice) : undefined,
          warrantyExpiry: formData.financialDetails.warrantyExpiry || undefined
        },
        status: formData.status,
        priority: formData.priority
      };

      await addAsset(assetData);
      setSuccess(true);
      console.log('✅ Asset added successfully!');

      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          name: '',
          type: AssetType.OTHER,
          category: AssetCategory.OFFICE_EQUIPMENT,
          description: '',
          location: {
            branch: '',
            floor: '',
            room: '',
            specificLocation: ''
          },
          technicalDetails: {
            serialNumber: '',
            model: '',
            manufacturer: '',
            supplier: ''
          },
          financialDetails: {
            purchaseDate: '',
            purchasePrice: '',
            warrantyExpiry: ''
          },
          status: AssetStatus.ACTIVE,
          priority: AssetPriority.MEDIUM
        });
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add asset';
      setFormError(errorMessage);
      console.log('❌ Error adding asset:', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => {
        const parentValue = prev[parent as keyof typeof prev];
        return {
          ...prev,
          [parent]: {
            ...(parentValue && typeof parentValue === 'object' ? parentValue as Record<string, any> : {}),
            [child]: value
          }
        };
      });
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Add New Asset</h1>
          </div>
          <p className="text-muted-foreground">
            Register a new asset in the system for tracking and maintenance management.
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
            ✅ Asset successfully registered in the system!
          </AlertDescription>
        </Alert>
      )}

      {(error || formError) && (
        <Alert variant="destructive">
          <AlertDescription>
            ❌ {error || formError}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Asset Name *</Label>
                <Input
                  id="name"
                  placeholder="e.g., Main Server Rack"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Asset Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset type" />
                    </SelectTrigger>
                    <SelectContent>
                      {assetTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>{category.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Detailed description of the asset..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    placeholder="Asset serial number"
                    value={formData.technicalDetails.serialNumber}
                    onChange={(e) => handleInputChange('technicalDetails.serialNumber', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    placeholder="Asset model"
                    value={formData.technicalDetails.model}
                    onChange={(e) => handleInputChange('technicalDetails.model', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer</Label>
                <Input
                  id="manufacturer"
                  placeholder="Manufacturer name"
                  value={formData.technicalDetails.manufacturer}
                  onChange={(e) => handleInputChange('technicalDetails.manufacturer', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier</Label>
                <Input
                  id="supplier"
                  placeholder="Supplier/Vendor name"
                  value={formData.technicalDetails.supplier}
                  onChange={(e) => handleInputChange('technicalDetails.supplier', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch *</Label>
                <Select value={formData.location.branch} onValueChange={(value) => handleInputChange('location.branch', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>{branch}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="floor">Floor</Label>
                  <Input
                    id="floor"
                    placeholder="e.g., Ground Floor"
                    value={formData.location.floor}
                    onChange={(e) => handleInputChange('location.floor', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room">Room/Area</Label>
                  <Input
                    id="room"
                    placeholder="e.g., Server Room A"
                    value={formData.location.room}
                    onChange={(e) => handleInputChange('location.room', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specificLocation">Specific Location</Label>
                <Input
                  id="specificLocation"
                  placeholder="Detailed location description"
                  value={formData.location.specificLocation}
                  onChange={(e) => handleInputChange('location.specificLocation', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Financial Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.financialDetails.purchaseDate}
                    onChange={(e) => handleInputChange('financialDetails.purchaseDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price (₵)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="0.00"
                    value={formData.financialDetails.purchasePrice}
                    onChange={(e) => handleInputChange('financialDetails.purchasePrice', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="warrantyExpiry">Warranty Expiry Date</Label>
                <Input
                  id="warrantyExpiry"
                  type="date"
                  value={formData.financialDetails.warrantyExpiry}
                  onChange={(e) => handleInputChange('financialDetails.warrantyExpiry', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Status & Priority
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AssetStatus.ACTIVE}>Active</SelectItem>
                      <SelectItem value={AssetStatus.INACTIVE}>Inactive</SelectItem>
                      <SelectItem value={AssetStatus.MAINTENANCE}>Under Maintenance</SelectItem>
                      <SelectItem value={AssetStatus.RETIRED}>Retired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={AssetPriority.LOW}>Low</SelectItem>
                      <SelectItem value={AssetPriority.MEDIUM}>Medium</SelectItem>
                      <SelectItem value={AssetPriority.HIGH}>High</SelectItem>
                      <SelectItem value={AssetPriority.CRITICAL}>Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Current Status</Label>
                <div className="flex gap-2">
                  <Badge variant={formData.status === AssetStatus.ACTIVE ? 'default' : 'secondary'}>
                    {formData.status.replace('_', ' ')}
                  </Badge>
                  <Badge variant={formData.priority === AssetPriority.CRITICAL ? 'destructive' : 'outline'}>
                    {formData.priority} priority
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
                Registering Asset...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Register Asset
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddAsset;
