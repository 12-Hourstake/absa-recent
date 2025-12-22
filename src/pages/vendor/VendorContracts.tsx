import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Calendar,
  DollarSign,
  Clock,
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  Download,
  Edit,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useBackButtonText } from "@/hooks/useBackButtonText";

const mockContract = {
  id: "CONTRACT-2024-001",
  vendorName: "Premier Facilities Management",
  contractType: "Maintenance Services",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  value: 150000,
  currency: "GHS",
  status: "active",
  renewalDate: "2024-11-01",
  contactPerson: "John Smith",
  contactEmail: "john.smith@premierfm.com",
  contactPhone: "+233 24 123 4567",
  services: [
    "HVAC Maintenance",
    "Electrical Repairs",
    "Plumbing Services",
    "Generator Maintenance",
    "Elevator Inspections",
    "General Building Maintenance",
  ],
  sla: {
    responseTime: "4 hours",
    resolutionTime: "24 hours",
    availability: "24/7",
  },
  terms: {
    paymentTerms: "Net 30 days",
    penaltyClause: "5% per day for SLA violations",
    terminationNotice: "90 days",
  },
};

const VendorContracts = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const [success, setSuccess] = useState("");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "expired":
        return <Badge variant="destructive">Expired</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleDownloadContract = () => {
    setSuccess("Contract document downloaded successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleRequestAmendment = () => {
    setSuccess("Amendment request submitted successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleContactSupport = () => {
    setSuccess("Support ticket created successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Contract Details
          </h1>
          <p className="text-muted-foreground">
            View your contract terms and service level agreements.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {backButtonText}
        </Button>
      </div>

      {/* Success Message */}
      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      {/* Contract Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Contract Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleDownloadContract}>
              <Download className="h-4 w-4 mr-2" />
              Download Contract
            </Button>
            <Button variant="outline" onClick={handleRequestAmendment}>
              <Edit className="h-4 w-4 mr-2" />
              Request Amendment
            </Button>
            <Button variant="outline" onClick={handleContactSupport}>
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contract Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contract Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Contract ID
                </p>
                <p className="text-lg font-semibold">{mockContract.id}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <div className="mt-1">
                  {getStatusBadge(mockContract.status)}
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contract Type
              </p>
              <p className="text-lg font-semibold">
                {mockContract.contractType}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Start Date
                </p>
                <p className="text-lg font-semibold">
                  {mockContract.startDate}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  End Date
                </p>
                <p className="text-lg font-semibold">{mockContract.endDate}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contract Value
              </p>
              <p className="text-lg font-semibold">
                {mockContract.currency} {mockContract.value.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contact Person
              </p>
              <p className="text-lg font-semibold">
                {mockContract.contactPerson}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{mockContract.contactEmail}</p>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{mockContract.contactPhone}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services & SLA */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Services Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {mockContract.services.map((service, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="h-2 w-2 bg-primary rounded-full"></div>
                  <span className="text-sm">{service}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Service Level Agreement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Response Time
              </p>
              <p className="text-lg font-semibold">
                {mockContract.sla.responseTime}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Resolution Time
              </p>
              <p className="text-lg font-semibold">
                {mockContract.sla.resolutionTime}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Availability
              </p>
              <p className="text-lg font-semibold">
                {mockContract.sla.availability}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Terms & Conditions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Terms & Conditions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Payment Terms
              </p>
              <p className="text-lg font-semibold">
                {mockContract.terms.paymentTerms}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Penalty Clause
              </p>
              <p className="text-lg font-semibold">
                {mockContract.terms.penaltyClause}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Termination Notice
              </p>
              <p className="text-lg font-semibold">
                {mockContract.terms.terminationNotice}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Important Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contract Renewal Date
              </p>
              <p className="text-lg font-semibold">
                {mockContract.renewalDate}
              </p>
              <p className="text-sm text-muted-foreground">
                90 days before contract expiry
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Contract Expiry
              </p>
              <p className="text-lg font-semibold">{mockContract.endDate}</p>
              <p className="text-sm text-muted-foreground">
                End of current term
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorContracts;
