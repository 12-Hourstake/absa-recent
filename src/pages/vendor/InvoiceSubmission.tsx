import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, X, CheckCircle, Calendar, DollarSign, Clock, TrendingUp, AlertCircle, Save, Send, Eye, Copy, History } from "lucide-react";

const InvoiceSubmission = () => {
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    vendorName: "",
    service: "",
    property: "",
    amount: "",
    dueDate: "",
    category: "",
    taxAmount: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [success, setSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [savedDrafts, setSavedDrafts] = useState([
    { id: 1, invoiceNumber: "INV-2024-045", amount: "2,500", date: "2024-01-15", property: "East Legon Residence" },
    { id: 2, invoiceNumber: "INV-2024-042", amount: "1,800", date: "2024-01-12", property: "Osu Commercial Plaza" },
  ]);
  const [recentInvoices, setRecentInvoices] = useState([
    { id: "INV-2024-044", amount: "GHS 3,200", status: "Approved", date: "2024-01-14" },
    { id: "INV-2024-043", amount: "GHS 1,500", status: "Pending", date: "2024-01-13" },
    { id: "INV-2024-041", amount: "GHS 4,800", status: "Paid", date: "2024-01-11" },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileNames = Array.from(files).map(f => f.name);
      setUploadedFiles([...uploadedFiles, ...fileNames]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("Invoice submitted successfully! You'll receive a confirmation email shortly.");
    setTimeout(() => setSuccess(""), 5000);
  };

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="space-y-6 p-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">Invoice Submission</h1>
          <p className="text-muted-foreground text-lg">Submit invoices quickly and track payment status in real-time</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            History
          </Button>
          <Button variant="outline" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pending Review</p>
                <p className="text-3xl font-bold mt-1">8</p>
                <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Paid This Month</p>
                <p className="text-3xl font-bold mt-1">GHS 45.2K</p>
                <p className="text-xs text-green-600 mt-1">↑ +18% vs last month</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Avg. Payment Time</p>
                <p className="text-3xl font-bold mt-1">12 days</p>
                <p className="text-xs text-muted-foreground mt-1">Industry standard</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Overdue</p>
                <p className="text-3xl font-bold mt-1">2</p>
                <p className="text-xs text-red-600 mt-1">Requires attention</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">New Invoice Submission</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">Step {currentStep} of {totalSteps} - Complete all required fields</p>
                </div>
                <Badge variant="outline" className="text-lg px-4 py-1">
                  Draft
                </Badge>
              </div>
              <div className="mt-4">
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number *</Label>
                <Input id="invoiceNumber" placeholder="INV-2024-001" value={formData.invoiceNumber} onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vendorName">Vendor/Company Name *</Label>
                <Input id="vendorName" placeholder="Kofi Mensah Plumbing" value={formData.vendorName} onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service/Product Description *</Label>
              <Textarea id="service" placeholder="Provide detailed description of services rendered or products supplied..." rows={4} value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} required />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="property">Associated Property/Unit *</Label>
                <Select value={formData.property} onValueChange={(value) => setFormData({ ...formData, property: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="property1">East Legon Residence, Apt 5B</SelectItem>
                    <SelectItem value="property2">Osu Commercial Plaza, Suite 204</SelectItem>
                    <SelectItem value="property3">Adom Heights, Unit 101</SelectItem>
                    <SelectItem value="property4">Villaggio Vista, Unit 302</SelectItem>
                    <SelectItem value="property5">The Lennox, Penthouse A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Service Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="plumbing">Plumbing</SelectItem>
                    <SelectItem value="electrical">Electrical</SelectItem>
                    <SelectItem value="hvac">HVAC</SelectItem>
                    <SelectItem value="carpentry">Carpentry</SelectItem>
                    <SelectItem value="painting">Painting</SelectItem>
                    <SelectItem value="cleaning">Cleaning</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="landscaping">Landscaping</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Subtotal Amount (GHS) *</Label>
                <Input id="amount" type="number" placeholder="450.00" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="taxAmount">Tax/VAT Amount (GHS)</Label>
                <Input id="taxAmount" type="number" placeholder="0.00" step="0.01" value={formData.taxAmount} onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Total Amount (GHS)</Label>
                <div className="h-10 px-3 py-2 border rounded-md bg-muted flex items-center">
                  <span className="font-bold">{(parseFloat(formData.amount || "0") + parseFloat(formData.taxAmount || "0")).toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Payment Due Date *</Label>
              <Input id="dueDate" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required className="max-w-xs" />
            </div>

            <div className="space-y-4">
              <Label>Supporting Documents *</Label>
              <div className="relative flex items-center justify-center w-full px-6 py-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-3 text-sm text-muted-foreground"><span className="font-semibold text-primary">Click to upload</span> or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, JPG, PNG, or DOCX (MAX. 10MB per file)</p>
                </div>
                <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} />
              </div>
              {uploadedFiles.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</p>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm">{file}</span>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-6 border-t bg-muted/30 -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <p className="text-sm text-muted-foreground">Auto-saved 2 minutes ago</p>
              </div>
              <div className="flex gap-3">
                <Button type="button" variant="outline" className="gap-2">
                  <Save className="h-4 w-4" />
                  Save Draft
                </Button>
                <Button type="button" variant="outline" className="gap-2">
                  <Copy className="h-4 w-4" />
                  Duplicate
                </Button>
                <Button type="submit" className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 px-8 gap-2">
                  <Send className="h-4 w-4" />
                  Submit Invoice
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Invoice Submission Guidelines</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Ensure all invoice details match supporting documents</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Upload clear copies of invoices and receipts (PDF preferred)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Payment processing: 7-14 business days after approval</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span>Email notifications sent at each approval stage</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <Save className="h-5 w-5" />
                Saved Drafts
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {savedDrafts.map((draft) => (
                  <div key={draft.id} className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-card">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm">{draft.invoiceNumber}</p>
                      <Badge variant="secondary" className="text-xs">Draft</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{draft.property}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>GHS {draft.amount}</span>
                      <span>{draft.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">View All Drafts</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Recent Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="p-3 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-sm">{invoice.id}</p>
                      <Badge variant={invoice.status === "Paid" ? "default" : invoice.status === "Approved" ? "secondary" : "outline"}>
                        {invoice.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="font-medium">{invoice.amount}</span>
                      <span>{invoice.date}</span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">View All Invoices</Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-lg">Quick Stats</p>
                  <p className="text-xs text-muted-foreground">This month</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Submitted:</span>
                  <span className="font-semibold">12 invoices</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Approved:</span>
                  <span className="font-semibold text-green-600">10 invoices</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Value:</span>
                  <span className="font-semibold">GHS 52,400</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InvoiceSubmission;
