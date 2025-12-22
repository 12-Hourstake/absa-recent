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
  AlertTriangle,
  Upload,
  MapPin,
  Calendar,
  ArrowLeft,
  Save,
  Camera,
  X,
  Users,
  Plus,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { useRequests } from "@/contexts/RequestContext";
import { IncidentType, IncidentSeverity, CreateIncidentData } from "@/types/request";

const ReportIncident = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const { addIncident, isLoading, error } = useRequests();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  // const [witnesses, setWitnesses] = useState<string[]>(['']);

  const [formData, setFormData] = useState<CreateIncidentData>({
    title: '',
    description: '',
    type: IncidentType.SAFETY,
    severity: IncidentSeverity.MEDIUM,
    location: {
      branch: '',
      floor: '',
      room: '',
      specificLocation: ''
    }
  });

  const incidentTypes = [
    { value: IncidentType.SAFETY, label: 'Safety Incident', description: 'Workplace safety issues' },
    { value: IncidentType.SECURITY, label: 'Security Breach', description: 'Security-related incidents' },
    { value: IncidentType.EMERGENCY, label: 'Emergency', description: 'Urgent emergency situations' },
    { value: IncidentType.EQUIPMENT_FAILURE, label: 'Equipment Failure', description: 'Equipment malfunction or failure' },
    { value: IncidentType.ENVIRONMENTAL, label: 'Environmental', description: 'Environmental hazards or issues' },
    { value: IncidentType.OTHER, label: 'Other', description: 'Other types of incidents' }
  ];

  const severityOptions = [
    { value: IncidentSeverity.LOW, label: 'Low', color: 'bg-green-100 text-green-800', description: 'Minor incident with no injuries' },
    { value: IncidentSeverity.MEDIUM, label: 'Medium', color: 'bg-yellow-100 text-yellow-800', description: 'Moderate incident with minor injuries' },
    { value: IncidentSeverity.HIGH, label: 'High', color: 'bg-orange-100 text-orange-800', description: 'Serious incident with injuries' },
    { value: IncidentSeverity.CRITICAL, label: 'Critical', color: 'bg-red-100 text-red-800', description: 'Critical incident requiring immediate attention' }
  ];

  const branches = [
    'Accra Main Branch',
    'Kumasi Branch',
    'Takoradi Branch',
    'Tamale Branch',
    'Cape Coast Branch',
    'Sunyani Branch'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);

    try {
      console.log('📝 Submitting incident data:', formData);

      const incidentData: CreateIncidentData = {
        ...formData,
        photos: photos.length > 0 ? photos : undefined //,
        //witnesses: witnesses.filter(w => w.trim() !== '')
      };

      await addIncident(incidentData);
      setSuccess(true);
      console.log('✅ Incident reported successfully!');

      // Reset form after success
      setTimeout(() => {
        setSuccess(false);
        setFormData({
          title: '',
          description: '',
          type: IncidentType.SAFETY,
          severity: IncidentSeverity.MEDIUM,
          location: {
            branch: '',
            floor: '',
            room: '',
            specificLocation: ''
          }
        });
        setPhotos([]);
        // setWitnesses(['']);
      }, 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to report incident';
      setFormError(errorMessage);
      console.log('❌ Error reporting incident:', errorMessage);
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

  // const addWitness = () => {
  //   setWitnesses(prev => [...prev, '']);
  // };

  // const removeWitness = (index: number) => {
  //   setWitnesses(prev => prev.filter((_, i) => i !== index));
  // };

  // const updateWitness = (index: number, value: string) => {
  //   setWitnesses(prev => prev.map((witness, i) => i === index ? value : witness));
  // };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <h1 className="text-3xl font-bold tracking-tight">Report Incident</h1>
          </div>
          <p className="text-muted-foreground">
            Report safety incidents or emergencies
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
            ✅ Incident reported successfully! Emergency services have been notified if required.
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
          {/* Incident Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Incident Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Incident Title *</Label>
                <Input
                  id="title"
                  placeholder="Brief description of the incident"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detailed Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Provide detailed information about what happened, when, and any immediate actions taken..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="type">Incident Type *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select incident type" />
                    </SelectTrigger>
                    <SelectContent>
                      {incidentTypes.map((type) => (
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
                  <Label htmlFor="severity">Severity Level *</Label>
                  <Select value={formData.severity} onValueChange={(value) => handleInputChange('severity', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select severity" />
                    </SelectTrigger>
                    <SelectContent>
                      {severityOptions.map((severity) => (
                        <SelectItem key={severity.value} value={severity.value}>
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className={severity.color}>
                                {severity.label}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">{severity.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
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

          {/* Witnesses */}
          {/* <Card> */}
          {/*   <CardHeader> */}
          {/*     <CardTitle className="flex items-center gap-2"> */}
          {/*       <Users className="h-5 w-5" /> */}
          {/*       Witnesses */}
          {/*     </CardTitle> */}
          {/*   </CardHeader> */}
          {/*   <CardContent className="space-y-4"> */}
          {/*     <div className="space-y-2"> */}
          {/*       <Label>Witness Information</Label> */}
          {/*       <p className="text-sm text-muted-foreground"> */}
          {/*         Add any witnesses to the incident (optional) */}
          {/*       </p> */}
          {/*     </div> */}
          {/**/}
          {/*     {witnesses.map((witness, index) => ( */}
          {/*       <div key={index} className="flex items-center gap-2"> */}
          {/*         <Input */}
          {/*           placeholder="Witness name and contact information" */}
          {/*           value={witness} */}
          {/*           onChange={(e) => updateWitness(index, e.target.value)} */}
          {/*         /> */}
          {/*         {witnesses.length > 1 && ( */}
          {/*           <Button */}
          {/*             type="button" */}
          {/*             variant="outline" */}
          {/*             size="sm" */}
          {/*             onClick={() => removeWitness(index)} */}
          {/*           > */}
          {/*             <Trash2 className="h-4 w-4" /> */}
          {/*           </Button> */}
          {/*         )} */}
          {/*       </div> */}
          {/*     ))} */}
          {/**/}
          {/*     <Button */}
          {/*       type="button" */}
          {/*       variant="outline" */}
          {/*       onClick={addWitness} */}
          {/*       className="w-full" */}
          {/*     > */}
          {/*       <Plus className="mr-2 h-4 w-4" /> */}
          {/*       Add Witness */}
          {/*     </Button> */}
          {/*   </CardContent> */}
          {/* </Card> */}

          {/* Photo Upload */}
          <Card>
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
                  Upload photos to document the incident (optional)
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
                          alt={`Incident photo ${index + 1}`}
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
                Reporting Incident...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Report Incident
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportIncident;
