import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FilePlus,
  Upload,
  MapPin,
  Calendar,
  ArrowLeft,
  Save,
  Camera,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { useRequests } from "@/contexts/RequestContext";
import { RequestType, RequestPriority, CreateRequestData } from "@/types/request";
import { getBranchNames } from "@/data/mockBranches";

const SubmitRequest = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { addRequest, isLoading, error } = useRequests();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);

  const [formData, setFormData] = useState<CreateRequestData>({
    title: '',
    description: '',
    type: RequestType.MAINTENANCE,
    priority: RequestPriority.MEDIUM,
    location: {
      branch: '',
      floor: '',
      room: '',
      specificLocation: ''
    },
    notes: ''
  });

  const requestTypes = [
    { value: RequestType.MAINTENANCE, label: 'Maintenance', description: 'Equipment repair and maintenance' },
    { value: RequestType.CLEANING, label: 'Cleaning', description: 'Cleaning services and janitorial' },
    { value: RequestType.SECURITY, label: 'Security', description: 'Security-related issues' },
    { value: RequestType.IT_SUPPORT, label: 'IT Support', description: 'Computer and technology issues' },
    { value: RequestType.FACILITIES, label: 'Facilities', description: 'Building and facility issues' },
    { value: RequestType.OTHER, label: 'Other', description: 'Other service requests' }
  ];

  const priorityOptions = [
    { value: RequestPriority.LOW, label: 'Low', color: 'bg-green-100 text-green-800' },
    { value: RequestPriority.MEDIUM, label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { value: RequestPriority.HIGH, label: 'High', color: 'bg-orange-100 text-orange-800' },
    { value: RequestPriority.URGENT, label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  const branches = getBranchNames();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      console.log('📝 Submitting request data:', formData);

      const requestData: CreateRequestData = {
        ...formData,
        photos: photos.length > 0 ? photos : undefined
      };

      await addRequest(requestData);
      setSuccess(true);
      console.log('✅ Request submitted successfully!');

      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          title: '',
          description: '',
          type: RequestType.MAINTENANCE,
          priority: RequestPriority.MEDIUM,
          location: {
            branch: '',
            floor: '',
            room: '',
            specificLocation: ''
          },
          notes: ''
        });
        setPhotos([]);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit request';
      setFormError(errorMessage);
      console.log('❌ Error submitting request:', errorMessage);
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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setPhotos(prev => [...prev, event.target!.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FilePlus className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Submit Request</h1>
          </div>
          <p className="text-muted-foreground">
            Report maintenance issues or request services
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
            ✅ Request submitted successfully! You will receive updates via email.
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
          {/* Request Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilePlus className="h-5 w-5" />
                Request Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Request Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the issue"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about the issue or service needed..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Request Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select request type" />
                    </SelectTrigger>
                    <SelectContent>
                      {requestTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={priority.color}>
                              {priority.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any additional information or special instructions..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
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
                    placeholder="e.g., Ground Floor, 1st Floor"
                    value={formData.location.floor}
                    onChange={(e) => handleInputChange('location.floor', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="room">Room/Area</Label>
                  <Input
                    id="room"
                    placeholder="e.g., Conference Room A, Reception"
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

          {/* Photo Upload */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Upload Photo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="photos">Upload Photos</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="photos"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="flex-1"
                  />
                  <Button type="button" variant="outline" onClick={() => document.getElementById('photos')?.click()}>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose Files
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload photos to help describe the issue (optional)
                </p>
              </div>

              {photos.length > 0 && (
                <div className="space-y-2">
                  <Label>Uploaded Photos ({photos.length})</Label>
                  <div className="grid gap-4 md:grid-cols-3">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 h-6 w-6 p-0"
                          onClick={() => removePhoto(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/colleague/dashboard')}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || isLoading}>
            {isSubmitting || isLoading ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-spin" />
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

export default SubmitRequest;