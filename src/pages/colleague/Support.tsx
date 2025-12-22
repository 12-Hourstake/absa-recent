import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HelpCircle, Phone, Mail, Clock, Search, ChevronDown } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Support = () => {
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSuccess(true);
    setIsSubmitting(false);
    setFormData({ category: "", subject: "", description: "" });
    setTimeout(() => setSuccess(false), 3000);
  };

  const faqs = [
    {
      question: "How do I track my request status?",
      answer: "You can track the status of all your submitted requests in the 'My Requests' section of the portal. Each request will have a status like 'Pending', 'In Progress', or 'Completed'.",
    },
    {
      question: "How do I update payment details for my East Legon property?",
      answer: "To update your payment details, navigate to your Profile settings, select the 'Payment Methods' tab, and add or edit your information securely.",
    },
    {
      question: "Are payments accepted in GHS via Mobile Money?",
      answer: "Yes, we accept payments in Ghanaian Cedis (GHS) through all major Mobile Money providers, including MTN Mobile Money, Vodafone Cash, and AirtelTigo Money.",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-6 w-6 text-primary" />
          <h1 className="text-4xl font-black tracking-tight">ABSA Support Center</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="text-[22px] font-bold">Submit a New Support Request</CardTitle>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">
                    ✅ Support request submitted successfully!
                  </AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="portal">Portal Access Issue</SelectItem>
                      <SelectItem value="payment">Payment Query</SelectItem>
                      <SelectItem value="request">Request Clarification</SelectItem>
                      <SelectItem value="technical">Technical Problem</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="e.g., Unable to submit payment"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Describe your issue</Label>
                  <Textarea
                    id="description"
                    placeholder="Please provide as much detail as possible..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Attach a file (Optional)</Label>
                  <div className="relative flex items-center justify-center w-full h-24 border-2 border-dashed rounded-lg hover:border-primary transition-colors cursor-pointer">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Click to browse or drag file here</p>
                    </div>
                    <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  </div>
                </div>

                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search FAQs..." className="pl-10" />
              </div>

              <div className="space-y-2">
                {faqs.map((faq, index) => (
                  <div key={index} className="border rounded-md">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex justify-between items-center w-full p-3 text-left hover:bg-muted/50 transition-colors"
                    >
                      <span className="font-medium text-sm">{faq.question}</span>
                      <ChevronDown className={`h-4 w-4 transition-transform ${openFaq === index ? "rotate-180" : ""}`} />
                    </button>
                    {openFaq === index && (
                      <div className="p-3 text-sm text-muted-foreground border-t">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Contact Us Directly</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <a href="tel:+233302123456" className="flex items-center gap-4 group">
                <Phone className="h-5 w-5 text-primary" />
                <span className="font-medium group-hover:underline">+233 30 212 3456</span>
              </a>
              <a href="mailto:support.gh@absa.com" className="flex items-center gap-4 group">
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-medium group-hover:underline">support.gh@ABSA.com</span>
              </a>
              <div className="pt-4 border-t space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-medium">Support Hours:</p>
                </div>
                <p className="text-sm text-muted-foreground">Monday - Friday, 8:00 AM - 5:00 PM (GMT)</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Support;
