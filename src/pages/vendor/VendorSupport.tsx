import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Mail, Clock, Upload, MessageSquare, FileText, CheckCircle, HelpCircle, ExternalLink } from "lucide-react";

const VendorSupport = () => {
  const [formData, setFormData] = useState({ subject: "", description: "", priority: "medium", category: "" });
  const [success, setSuccess] = useState("");
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess("Support ticket submitted successfully! Ticket #SUP-2024-0156 has been created.");
    setTimeout(() => setSuccess(""), 5000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setUploadedFile(file.name);
  };

  const recentTickets = [
    { id: "SUP-2024-0155", subject: "Invoice payment delay", status: "In Progress", date: "2024-01-14" },
    { id: "SUP-2024-0148", subject: "Work order clarification", status: "Resolved", date: "2024-01-10" },
    { id: "SUP-2024-0142", subject: "Profile update request", status: "Resolved", date: "2024-01-08" },
  ];

  const faqs = [
    { q: "How long does invoice approval take?", a: "Invoice approval typically takes 3-5 business days after submission. You'll receive email notifications at each stage." },
    { q: "How do I update my payment information?", a: "Go to Profile & Settings > Payment Information and click the Edit button to update your bank details." },
    { q: "What documents are required for invoice submission?", a: "You need to upload the original invoice, receipts, and any supporting documentation related to the service provided." },
    { q: "How can I track my work orders?", a: "Navigate to Work Orders from the main menu to view all assigned work orders and their current status." },
  ];

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Support & Help Center</h1>
        <p className="text-muted-foreground">Get the help you need. Submit a ticket, browse FAQs, or contact us directly.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <MessageSquare className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Open Tickets</p>
                <p className="text-2xl font-bold">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Response</p>
                <p className="text-2xl font-bold">4h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-2xl font-bold">Submit a Support Ticket</CardTitle>
              <p className="text-sm text-muted-foreground">Our support team typically responds within 4-6 hours during business hours</p>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="invoice">Invoice & Payments</SelectItem>
                        <SelectItem value="workorder">Work Orders</SelectItem>
                        <SelectItem value="account">Account & Profile</SelectItem>
                        <SelectItem value="technical">Technical Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority *</Label>
                    <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })} required>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" placeholder="Brief description of your issue" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea id="description" placeholder="Please provide detailed information about your issue..." rows={6} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Attach File (Optional)</Label>
                  <div className="relative flex items-center justify-center w-full px-6 py-10 border-2 border-dashed rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                    <div className="text-center">
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">Drag & drop a file here or <span className="font-medium text-primary">browse files</span></p>
                      <p className="mt-1 text-xs text-muted-foreground">Screenshots, documents, or images (Max 10MB)</p>
                      <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleFileUpload} />
                    </div>
                  </div>
                  {uploadedFile && (
                    <div className="flex items-center gap-2 p-3 border rounded-lg bg-muted/50">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm flex-1">{uploadedFile}</span>
                      <Button type="button" variant="ghost" size="sm" onClick={() => setUploadedFile(null)}>Remove</Button>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button type="button" variant="outline">Save as Draft</Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Submit Ticket
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle className="text-xl font-bold">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{faq.q}</h4>
                        <p className="text-sm text-muted-foreground">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" className="gap-2">
                  View All FAQs
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Recent Tickets</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <div key={ticket.id} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-sm">{ticket.id}</p>
                      <Badge variant={ticket.status === "Resolved" ? "default" : "secondary"}>
                        {ticket.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{ticket.subject}</p>
                    <p className="text-xs text-muted-foreground">{ticket.date}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">View All Tickets</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="border-b">
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Email Support</p>
                    <a href="mailto:vendor.support@absa.com" className="text-sm text-primary hover:underline">vendor.support@absa.com</a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Phone Support</p>
                    <a href="tel:+233241234567" className="text-sm text-primary hover:underline">+233 24 123 4567</a>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Business Hours</p>
                    <p className="text-sm text-muted-foreground">Mon-Fri: 8:00 AM - 5:00 PM</p>
                    <p className="text-sm text-muted-foreground">Sat: 9:00 AM - 1:00 PM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Need Urgent Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">For critical issues that require immediate attention, please call our emergency hotline.</p>
              <Button className="w-full" variant="default">
                <Phone className="h-4 w-4 mr-2" />
                Emergency Hotline
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorSupport;
