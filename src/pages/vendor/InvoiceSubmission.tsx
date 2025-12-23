import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Upload, FileText, Plus, Eye } from "lucide-react";

const completedWorkOrders = [
  {
    id: "WO-2024-0339",
    asset: "Elevator - Main Building",
    completedDate: "2025-03-18",
    amount: 2500,
  },
  {
    id: "WO-2024-0338",
    asset: "Vehicle Fleet Maintenance",
    completedDate: "2025-03-17",
    amount: 1800,
  },
  {
    id: "WO-2024-0337",
    asset: "HVAC System Repair",
    completedDate: "2025-03-15",
    amount: 3200,
  },
];

const mockInvoices = [
  {
    id: "INV-2024-001",
    workOrderId: "WO-2024-0335",
    amount: 2500,
    submittedDate: "2025-03-10",
    status: "Pending",
  },
  {
    id: "INV-2024-002",
    workOrderId: "WO-2024-0332",
    amount: 1800,
    submittedDate: "2025-03-08",
    status: "Approved",
  },
  {
    id: "INV-2024-003",
    workOrderId: "WO-2024-0330",
    amount: 3200,
    submittedDate: "2025-03-05",
    status: "Paid",
  },
];

const InvoiceSubmission = () => {
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [formData, setFormData] = useState({
    workOrderId: "",
    invoiceNumber: "",
    amount: "",
    invoiceDate: "",
    notes: "",
  });
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      "Pending": { className: "bg-yellow-100 text-yellow-800", label: "Pending" },
      "Approved": { className: "bg-green-100 text-green-800", label: "Approved" },
      "Rejected": { className: "bg-red-100 text-red-800", label: "Rejected" },
      "Paid": { className: "bg-blue-100 text-blue-800", label: "Paid" },
    };
    const config = variants[status] || variants["Pending"];
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleSubmitInvoice = () => {
    // Submit invoice logic here
    console.log("Submitting invoice:", formData);
    console.log("Uploaded file:", uploadedFile);
    setShowInvoiceModal(false);
    setFormData({
      workOrderId: "",
      invoiceNumber: "",
      amount: "",
      invoiceDate: "",
      notes: "",
    });
    setUploadedFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Invoice Submission</h1>
          <p className="text-muted-foreground">
            Submit invoices for completed work orders
          </p>
        </div>
        <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Submit Invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Submit New Invoice</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Work Order ID</Label>
                  <Select value={formData.workOrderId} onValueChange={(value) => setFormData({ ...formData, workOrderId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select completed work order" />
                    </SelectTrigger>
                    <SelectContent>
                      {completedWorkOrders.map((wo) => (
                        <SelectItem key={wo.id} value={wo.id}>
                          {wo.id} - {wo.asset}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Invoice Number</Label>
                  <Input 
                    placeholder="INV-2024-001"
                    value={formData.invoiceNumber}
                    onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Amount (GHS)</Label>
                  <Input 
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Invoice Date</Label>
                  <Input 
                    type="date"
                    value={formData.invoiceDate}
                    onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div>
                <Label>Upload Invoice</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {uploadedFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">{uploadedFile.name}</span>
                    </div>
                  ) : (
                    <div>
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF or Image files only</p>
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              </div>
              
              <div>
                <Label>Optional Notes</Label>
                <Textarea 
                  placeholder="Additional notes about the invoice..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowInvoiceModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitInvoice}
                  disabled={!formData.workOrderId || !formData.invoiceNumber || !formData.amount || !uploadedFile}
                >
                  Submit Invoice
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoice Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Work Order ID</TableHead>
                  <TableHead>Amount (GHS)</TableHead>
                  <TableHead>Submitted Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{invoice.id}</TableCell>
                    <TableCell className="font-mono text-sm">{invoice.workOrderId}</TableCell>
                    <TableCell className="font-medium">GH₵ {invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{invoice.submittedDate}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {mockInvoices.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No Invoices Submitted</h3>
              <p className="text-sm text-muted-foreground">Submit your first invoice for a completed work order.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Invoice Submission Guidelines</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• Only completed work orders are eligible for invoice submission</p>
            <p>• Upload clear, legible copies of your invoices (PDF preferred)</p>
            <p>• Include all relevant details: invoice number, amount, and date</p>
            <p>• Invoices are typically processed within 7-14 business days</p>
            <p>• You'll receive email notifications for status updates</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceSubmission;
