import { useState, useEffect } from "react";
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
import { toast } from "sonner";
const InvoiceSubmission = () => {
  const [completedWorkOrders, setCompletedWorkOrders] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [formData, setFormData] = useState({
    workOrderId: "",
    invoiceNumber: "",
    amount: "",
    invoiceDate: "",
    notes: "",
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  useEffect(() => {
    loadCompletedWorkOrders();
    loadInvoices();
    
    // Listen for invoice status updates from admin
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "INVOICES_CACHE_V1") {
        loadInvoices();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadCompletedWorkOrders = () => {
    try {
      const cached = localStorage.getItem("WORK_ORDERS_CACHE_V1");
      const allWorkOrders = cached ? JSON.parse(cached) : [];
      
      const currentVendorId = localStorage.getItem("AUTH_SESSION_V1") 
        ? JSON.parse(localStorage.getItem("AUTH_SESSION_V1") || "{}").vendorId 
        : "vendor-001";
      
      const completed = allWorkOrders.filter((wo: any) => 
        wo.assignedVendor === currentVendorId && wo.status === "Completed"
      );
      setCompletedWorkOrders(completed);
    } catch (err) {
      console.error("Error loading work orders:", err);
      setCompletedWorkOrders([]);
    }
  };

  const loadInvoices = () => {
    try {
      const cached = localStorage.getItem("INVOICES_CACHE_V1");
      const allInvoices = cached ? JSON.parse(cached) : [];
      
      const currentVendorId = localStorage.getItem("AUTH_SESSION_V1") 
        ? JSON.parse(localStorage.getItem("AUTH_SESSION_V1") || "{}").vendorId 
        : "vendor-001";
      
      const vendorInvoices = allInvoices.filter((inv: any) => inv.vendorId === currentVendorId);
      setInvoices(vendorInvoices);
    } catch (err) {
      console.error("Error loading invoices:", err);
      setInvoices([]);
    }
  };

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
    if (!formData.workOrderId || !formData.invoiceNumber || !formData.amount || uploadedFiles.length === 0) {
      toast.error("Please fill in all required fields and upload at least one file");
      return;
    }
    
    try {
      const currentVendorId = localStorage.getItem("AUTH_SESSION_V1") 
        ? JSON.parse(localStorage.getItem("AUTH_SESSION_V1") || "{}").vendorId 
        : "vendor-001";
      
      const newInvoice = {
        id: `INV-${Date.now()}`,
        vendorId: currentVendorId,
        workOrderId: formData.workOrderId,
        invoiceNumber: formData.invoiceNumber,
        amount: parseFloat(formData.amount),
        invoiceDate: formData.invoiceDate,
        notes: formData.notes,
        files: uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
        status: "Pending",
        submittedDate: new Date().toISOString().split('T')[0],
        createdDate: new Date().toISOString()
      };
      
      // Save to invoices cache
      const existingInvoices = JSON.parse(localStorage.getItem("INVOICES_CACHE_V1") || "[]");
      const updatedInvoices = [...existingInvoices, newInvoice];
      localStorage.setItem("INVOICES_CACHE_V1", JSON.stringify(updatedInvoices));
      
      // Also sync to admin requests with invoice field
      const requestsCache = JSON.parse(localStorage.getItem("REQUESTS_CACHE_V1") || "[]");
      const updatedRequests = requestsCache.map((req: any) => 
        req.workOrderId === formData.workOrderId 
          ? { ...req, invoice: newInvoice }
          : req
      );
      localStorage.setItem("REQUESTS_CACHE_V1", JSON.stringify(updatedRequests));
      
      // Reload data
      loadInvoices();
      
      // Reset form
      setShowInvoiceModal(false);
      setFormData({
        workOrderId: "",
        invoiceNumber: "",
        amount: "",
        invoiceDate: "",
        notes: "",
      });
      setUploadedFiles([]);
      
      toast.success("Invoice submitted successfully!");
    } catch (err) {
      console.error("Error submitting invoice:", err);
      toast.error("Failed to submit invoice");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + uploadedFiles.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
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
            <div className="space-y-4" role="form" aria-describedby="invoice-form-description">
              <p id="invoice-form-description" className="sr-only">
                Complete the form below to submit a new invoice for a completed work order
              </p>
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
                          {wo.id} - {wo.asset || wo.description}
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
                <Label>Upload Invoice Files (Max 5)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
                  {uploadedFiles.length > 0 ? (
                    <div className="space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded relative z-10">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{file.name}</span>
                            <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                          </div>
                          <Button 
                            type="button" 
                            size="sm" 
                            variant="ghost" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFile(index);
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      {uploadedFiles.length < 5 && (
                        <div className="mt-4 relative z-0">
                          <Upload className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600">Add more files ({uploadedFiles.length}/5)</p>
                          <input 
                            type="file" 
                            accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                            onChange={handleFileUpload}
                            multiple
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            disabled={uploadedFiles.length >= 5}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative z-0">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, Images, or Documents (Max 5 files, 10MB each)</p>
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
                        onChange={handleFileUpload}
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadedFiles.length >= 5}
                      />
                    </div>
                  )}
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
                  disabled={!formData.workOrderId || !formData.invoiceNumber || !formData.amount || uploadedFiles.length === 0}
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
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id} className="hover:bg-gray-50">
                      <TableCell className="font-mono text-sm">{invoice.invoiceNumber}</TableCell>
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
          
          {invoices.length === 0 && (
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
