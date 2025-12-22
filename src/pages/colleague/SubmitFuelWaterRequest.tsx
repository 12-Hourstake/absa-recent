import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Save, Fuel, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { FuelWaterRequest, FuelWaterRequestType, CreateFuelWaterRequestData } from "@/types/request";

const REQUESTS_CACHE_KEY = "REQUESTS_CACHE_V1";

const SubmitFuelWaterRequest = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateFuelWaterRequestData>({
    requestType: "GEN_FUEL",
    name: "",
    assetName: "",
    customAssetName: "",
    description: "",
    quantity: "",
    createdBy: "Facility Manager"
  });

  const requestTypes = [
    { value: "GEN_FUEL" as FuelWaterRequestType, label: "Generator Fuel", icon: Fuel },
    { value: "CAR_FUEL" as FuelWaterRequestType, label: "Car Fuel", icon: Fuel },
    { value: "WATER" as FuelWaterRequestType, label: "Water", icon: Droplets }
  ];

  const assetOptions = [
    "Generator 1", "Generator 2", "Generator 3",
    "Company Car 1", "Company Car 2", "Company Car 3",
    "Water Tank 1", "Water Tank 2", "Custom Asset"
  ];

  const createdByOptions = [
    "Facility Manager",
    "Head of Facilities", 
    "Custom"
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }
      if (!formData.quantity.trim()) {
        throw new Error("Quantity is required");
      }
      if (formData.assetName === "Custom Asset" && !formData.customAssetName?.trim()) {
        throw new Error("Custom asset name is required");
      }

      // Create new request
      const newRequest: FuelWaterRequest = {
        requestId: `REQ-${Date.now()}`,
        requestType: formData.requestType,
        name: formData.name,
        assetName: formData.assetName === "Custom Asset" ? undefined : formData.assetName,
        customAssetName: formData.assetName === "Custom Asset" ? formData.customAssetName : undefined,
        description: formData.description,
        quantity: formData.quantity,
        mode: "CARD_AND_PIN",
        createdBy: formData.createdBy,
        createdOn: new Date().toISOString(),
        status: "PENDING"
      };

      // Load existing requests
      const existingRequests = JSON.parse(localStorage.getItem(REQUESTS_CACHE_KEY) || "[]");
      
      // Add new request
      const updatedRequests = [...existingRequests, newRequest];
      
      // Save to cache
      localStorage.setItem(REQUESTS_CACHE_KEY, JSON.stringify(updatedRequests));

      setSuccess(true);
      console.log('✅ Fuel/Water request submitted successfully!', newRequest);

      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          requestType: "GEN_FUEL",
          name: "",
          assetName: "",
          customAssetName: "",
          description: "",
          quantity: "",
          createdBy: "Facility Manager"
        });
      }, 3000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit request';
      setError(errorMessage);
      console.error('❌ Error submitting fuel/water request:', errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof CreateFuelWaterRequestData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Fuel className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Submit Fuel/Water Request</h1>
          </div>
          <p className="text-muted-foreground">
            Request fuel or water supplies for facility operations
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
            ✅ Request submitted successfully! It will be reviewed by the admin team.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            ❌ {error}
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fuel className="h-5 w-5" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="requestType">Request Type *</Label>
                <Select 
                  value={formData.requestType} 
                  onValueChange={(value) => handleInputChange('requestType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select request type" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Requester Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assetName">Asset Name</Label>
                <Select 
                  value={formData.assetName} 
                  onValueChange={(value) => handleInputChange('assetName', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select asset" />
                  </SelectTrigger>
                  <SelectContent>
                    {assetOptions.map((asset) => (
                      <SelectItem key={asset} value={asset}>{asset}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.assetName === "Custom Asset" && (
                <div className="space-y-2">
                  <Label htmlFor="customAssetName">Custom Asset Name *</Label>
                  <Input
                    id="customAssetName"
                    placeholder="Enter custom asset name"
                    value={formData.customAssetName}
                    onChange={(e) => handleInputChange('customAssetName', e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity / Volume *</Label>
                <Input
                  id="quantity"
                  placeholder="e.g., 100 liters, 50 gallons"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="createdBy">Created By *</Label>
                <Select 
                  value={formData.createdBy} 
                  onValueChange={(value) => handleInputChange('createdBy', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    {createdByOptions.map((option) => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description / Reason</Label>
                <Textarea
                  id="description"
                  placeholder="Provide additional details about the request..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm font-medium">Card & PIN</p>
                  <p className="text-xs text-muted-foreground">Default payment method</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/colleague/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Save className="mr-2 h-4 w-4 animate-spin" />
                Submitting Request...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SubmitFuelWaterRequest;