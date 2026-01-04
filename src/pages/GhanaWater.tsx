import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomSelectDropdown from "@/components/ui/CustomSelectDropdown";
import { 
  Plus, 
  Zap, 
  FileText, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Upload, 
  Eye, 
  Edit, 
  Trash2,
  DollarSign,
  Receipt,
  Share2
} from "lucide-react";

// Ghana Water Bill Interface
interface WaterBill {
  id: string;
  month: string;
  meterNumber: string;
  branchSite: string;
  billAmount: number;
  billSource: 'Email' | 'Hard Copy' | 'GWCL Download';
  billStatus: 'Received' | 'Pending Approval' | 'Approved' | 'Uploaded to Coupa' | 'Paid' | 'Reconciliation Complete' | 'Remediation Required';
  approvalStatus: 'Pending' | 'Approved' | 'Not Approved';
  paymentStatus: 'Pending' | 'Paid' | 'Failed';
  receiptUploaded: boolean;
  billFile?: string;
  receiptFile?: string;
  comments?: string;
  createdDate: string;
  approvedDate?: string;
  paidDate?: string;
  reconciledDate?: string;
}

const WATER_BILLS_STORAGE_KEY = "WATER_BILLS_CACHE_V1";
const BRANCHES_STORAGE_KEY = "BRANCHES_CACHE_V1";

// Workflow steps for visual display
const WORKFLOW_STEPS = [
  { id: 1, title: "Bills Received", subtitle: "(Soft / Hard Copy)", icon: FileText, color: "bg-blue-50 text-blue-600" },
  { id: 2, title: "Bills Logged", subtitle: "in Water Tracker", icon: Plus, color: "bg-purple-50 text-purple-600" },
  { id: 3, title: "Approval Memo", subtitle: "Drafted", icon: Edit, color: "bg-orange-50 text-orange-600" },
  { id: 4, title: "Approval Required", subtitle: "", icon: CheckCircle, color: "bg-yellow-50 text-yellow-600" },
  { id: 5, title: "Uploaded to Coupa", subtitle: "(P2P)", icon: Upload, color: "bg-indigo-50 text-indigo-600" },
  { id: 6, title: "Payment Processed", subtitle: "", icon: DollarSign, color: "bg-green-50 text-green-600" },
  { id: 7, title: "Receipts Received", subtitle: "", icon: Receipt, color: "bg-teal-50 text-teal-600" },
  { id: 8, title: "Reconciliation", subtitle: "Completed", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
  { id: 9, title: "Receipts Saved", subtitle: "& Shared", icon: Share2, color: "bg-cyan-50 text-cyan-600" }
];

const GhanaWater = () => {
  const [bills, setBills] = useState<WaterBill[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBill, setSelectedBill] = useState<ECGBill | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [deleteBillId, setDeleteBillId] = useState<string | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    month: "",
    meterNumber: "",
    branchSite: "",
    billAmount: "",
    billSource: "Email" as 'Email' | 'Hard Copy' | 'GWCL Download',
    billFile: null as File | null
  });

  // Update form state
  const [updateData, setUpdateData] = useState({
    billStatus: "",
    approvalStatus: "",
    paymentStatus: "",
    receiptUploaded: false,
    receiptFile: null as File | null,
    comments: ""
  });

  // Load data on component mount
  useEffect(() => {
    loadBills();
    loadBranches();
  }, []);

  const loadBills = () => {
    try {
      const cachedBills = localStorage.getItem(WATER_BILLS_STORAGE_KEY);
      const bills = cachedBills ? JSON.parse(cachedBills) : [];
      setBills(bills);
    } catch (err) {
      console.error("Error loading water bills:", err);
      setBills([]);
    }
  };

  const loadBranches = () => {
    try {
      const cachedBranches = localStorage.getItem(BRANCHES_STORAGE_KEY);
      const branches = cachedBranches ? JSON.parse(cachedBranches) : [];
      setBranches(branches);
    } catch (err) {
      console.error("Error loading branches:", err);
      setBranches([]);
    }
  };

  const saveBills = (newBills: ECGBill[]) => {
    try {
      setBills(newBills);
      localStorage.setItem(WATER_BILLS_STORAGE_KEY, JSON.stringify(newBills));
    } catch (err) {
      console.error("Error saving water bills:", err);
    }
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonthBills = bills.filter(bill => {
      const billDate = new Date(bill.month + "-01");
      return billDate.getMonth() === currentMonth && billDate.getFullYear() === currentYear;
    });

    const totalAmount = thisMonthBills.reduce((sum, bill) => sum + bill.billAmount, 0);
    const pendingApproval = bills.filter(bill => bill.approvalStatus === "Pending").length;
    const paidBills = bills.filter(bill => bill.paymentStatus === "Paid").length;
    const remediationRequired = bills.filter(bill => bill.billStatus === "Remediation Required").length;

    return {
      totalBills: thisMonthBills.length,
      totalAmount,
      pendingApproval,
      paidBills,
      remediationRequired
    };
  }, [bills]);

  const handleAddBill = () => {
    try {
      if (!formData.month || !formData.meterNumber || !formData.branchSite || !formData.billAmount) {
        setError("Please fill in all required fields");
        return;
      }

      const newId = `ECG-${String(bills.length + 1).padStart(3, '0')}`;
      
      const newBill: ECGBill = {
        id: newId,
        month: formData.month,
        meterNumber: formData.meterNumber,
        branchSite: formData.branchSite,
        billAmount: parseFloat(formData.billAmount),
        billSource: formData.billSource,
        billStatus: "Received",
        approvalStatus: "Pending",
        paymentStatus: "Pending",
        receiptUploaded: false,
        createdDate: new Date().toISOString().split('T')[0]
      };

      const updatedBills = [...bills, newBill];
      saveBills(updatedBills);

      setFormData({
        month: "",
        meterNumber: "",
        branchSite: "",
        billAmount: "",
        billSource: "Email",
        billFile: null
      });

      setIsAddModalOpen(false);
      setSuccess("ECG bill added successfully!");
      setError("");
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to add ECG bill");
      console.error("Error adding ECG bill:", err);
    }
  };

  const handleUpdateBill = () => {
    if (!selectedBill) return;

    try {
      const updatedBill = {
        ...selectedBill,
        billStatus: updateData.billStatus || selectedBill.billStatus,
        approvalStatus: updateData.approvalStatus || selectedBill.approvalStatus,
        paymentStatus: updateData.paymentStatus || selectedBill.paymentStatus,
        receiptUploaded: updateData.receiptUploaded,
        comments: updateData.comments,
        approvedDate: updateData.approvalStatus === "Approved" ? new Date().toISOString().split('T')[0] : selectedBill.approvedDate,
        paidDate: updateData.paymentStatus === "Paid" ? new Date().toISOString().split('T')[0] : selectedBill.paidDate,
        reconciledDate: updateData.receiptUploaded && updateData.paymentStatus === "Paid" ? new Date().toISOString().split('T')[0] : selectedBill.reconciledDate
      };

      // Auto-update bill status based on other statuses
      if (updateData.approvalStatus === "Not Approved") {
        updatedBill.billStatus = "Remediation Required";
      } else if (updateData.paymentStatus === "Paid" && updateData.receiptUploaded) {
        updatedBill.billStatus = "Reconciliation Complete";
      } else if (updateData.paymentStatus === "Paid") {
        updatedBill.billStatus = "Paid";
      } else if (updateData.approvalStatus === "Approved") {
        updatedBill.billStatus = "Approved";
      }

      const updatedBills = bills.map(bill => bill.id === selectedBill.id ? updatedBill : bill);
      saveBills(updatedBills);

      setIsUpdateModalOpen(false);
      setSelectedBill(null);
      setSuccess("ECG bill updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to update ECG bill");
      console.error("Error updating ECG bill:", err);
    }
  };

  const handleDeleteBill = (billId: string) => {
    try {
      const updatedBills = bills.filter(bill => bill.id !== billId);
      saveBills(updatedBills);
      setDeleteBillId(null);
      setSuccess("ECG bill deleted successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to delete ECG bill");
      console.error("Error deleting ECG bill:", err);
    }
  };

  const openUpdateModal = (bill: ECGBill) => {
    setSelectedBill(bill);
    setUpdateData({
      billStatus: bill.billStatus,
      approvalStatus: bill.approvalStatus,
      paymentStatus: bill.paymentStatus,
      receiptUploaded: bill.receiptUploaded,
      receiptFile: null,
      comments: bill.comments || ""
    });
    setIsUpdateModalOpen(true);
  };

  const getStatusBadge = (status: string, type: 'bill' | 'approval' | 'payment') => {
    const colors = {
      bill: {
        'Received': 'bg-blue-100 text-blue-800',
        'Pending Approval': 'bg-yellow-100 text-yellow-800',
        'Approved': 'bg-green-100 text-green-800',
        'Uploaded to Coupa': 'bg-purple-100 text-purple-800',
        'Paid': 'bg-emerald-100 text-emerald-800',
        'Reconciliation Complete': 'bg-teal-100 text-teal-800',
        'Remediation Required': 'bg-red-100 text-red-800'
      },
      approval: {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Approved': 'bg-green-100 text-green-800',
        'Not Approved': 'bg-red-100 text-red-800'
      },
      payment: {
        'Pending': 'bg-yellow-100 text-yellow-800',
        'Paid': 'bg-green-100 text-green-800',
        'Failed': 'bg-red-100 text-red-800'
      }
    };

    return (
      <Badge className={colors[type][status as keyof typeof colors[typeof type]] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    );
  };

  return (
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="p-4 space-y-6 min-w-0">
      {/* Success/Error Messages */}
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">✅ {success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight break-words">Utilities Management – Water (GWCL)</h1>
          <p className="text-muted-foreground text-sm break-words">Track water bills, approvals, payments, and reconciliation</p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)} className="gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" />
          Add Water Bill
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Water Bills</p>
                <p className="text-2xl font-bold">{summaryStats.totalBills}</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">GH₵ {summaryStats.totalAmount.toLocaleString()}</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-green-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">{summaryStats.pendingApproval}</p>
              </div>
              <div className="rounded-lg bg-yellow-50 p-2 text-yellow-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bills Paid</p>
                <p className="text-2xl font-bold">{summaryStats.paidBills}</p>
              </div>
              <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Remediation Required</p>
                <p className="text-2xl font-bold">{summaryStats.remediationRequired}</p>
              </div>
              <div className="rounded-lg bg-red-50 p-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water Billing Workflow */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Water Billing Workflow Process</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full ${step.color} flex items-center justify-center mb-2`}>
                  <step.icon className="h-6 w-6" />
                </div>
                <h4 className="font-medium text-sm">{step.title}</h4>
                <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                {index < WORKFLOW_STEPS.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-full w-8 h-0.5 bg-muted-foreground/20 transform -translate-y-1/2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Water Bills Tracker Table */}
      <Card>
        <CardHeader className="bg-muted/50 p-4">
          <CardTitle className="text-base">Water Bills Tracker ({bills.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-muted/50">
                <TableRow>
                  <TableHead className="text-sm">Month</TableHead>
                  <TableHead className="text-sm">Meter Number</TableHead>
                  <TableHead className="text-sm">Branch / Site</TableHead>
                  <TableHead className="text-sm">Bill Amount</TableHead>
                  <TableHead className="text-sm">Bill Source</TableHead>
                  <TableHead className="text-sm">Bill Status</TableHead>
                  <TableHead className="text-sm">Approval Status</TableHead>
                  <TableHead className="text-sm">Payment Status</TableHead>
                  <TableHead className="text-sm">Receipt</TableHead>
                  <TableHead className="text-sm text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                      No water bills added yet. Add your first bill to get started.
                    </TableCell>
                  </TableRow>
                ) : (
                  bills.map((bill) => (
                    <TableRow key={bill.id} className="hover:bg-muted/50">
                      <TableCell className="text-sm">{bill.month}</TableCell>
                      <TableCell className="text-sm font-mono">{bill.meterNumber}</TableCell>
                      <TableCell className="text-sm">{bill.branchSite}</TableCell>
                      <TableCell className="text-sm">GH₵ {bill.billAmount.toLocaleString()}</TableCell>
                      <TableCell className="text-sm">{bill.billSource}</TableCell>
                      <TableCell>{getStatusBadge(bill.billStatus, 'bill')}</TableCell>
                      <TableCell>{getStatusBadge(bill.approvalStatus, 'approval')}</TableCell>
                      <TableCell>{getStatusBadge(bill.paymentStatus, 'payment')}</TableCell>
                      <TableCell className="text-sm">
                        {bill.receiptUploaded ? (
                          <Badge className="bg-green-100 text-green-800">Yes</Badge>
                        ) : (
                          <Badge variant="outline">No</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" title="View Details">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Update Status"
                            onClick={() => openUpdateModal(bill)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            title="Delete Bill" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => setDeleteBillId(bill.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Water Bill Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Add New Water Bill
            </DialogTitle>
            <DialogDescription>
              Enter ECG electricity bill details for tracking and approval
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="month">Month *</Label>
                <Input
                  id="month"
                  type="month"
                  value={formData.month}
                  onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meterNumber">Meter Number *</Label>
                <Input
                  id="meterNumber"
                  value={formData.meterNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, meterNumber: e.target.value }))}
                  placeholder="e.g., ECG-123456"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branchSite">Branch / Site *</Label>
              <CustomSelectDropdown
                options={branches.map(branch => ({ 
                  value: branch.branchName || branch.name, 
                  label: branch.branchName || branch.name 
                }))}
                value={formData.branchSite}
                onChange={(value) => setFormData(prev => ({ ...prev, branchSite: value }))}
                placeholder="Select branch or site"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="billAmount">Bill Amount (GHS) *</Label>
                <Input
                  id="billAmount"
                  type="number"
                  step="0.01"
                  value={formData.billAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, billAmount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billSource">Bill Source</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Email", label: "Soft copy (email)" },
                    { value: "Hard Copy", label: "Hard copy" },
                    { value: "ECG Download", label: "ECG download link" }
                  ]}
                  value={formData.billSource}
                  onChange={(value) => setFormData(prev => ({ ...prev, billSource: value as any }))}
                  placeholder="Select bill source"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billFile">Upload Bill (PDF only)</Label>
              <Input
                id="billFile"
                type="file"
                accept=".pdf"
                onChange={(e) => setFormData(prev => ({ ...prev, billFile: e.target.files?.[0] || null }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddBill}>
              Add Water Bill
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Bill Status Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Update Bill Status</DialogTitle>
            <DialogDescription>
              Update approval, payment, and reconciliation status for {selectedBill?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Bill Status</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Received", label: "Received" },
                    { value: "Pending Approval", label: "Pending Approval" },
                    { value: "Approved", label: "Approved" },
                    { value: "Uploaded to Coupa", label: "Uploaded to Coupa" },
                    { value: "Paid", label: "Paid" },
                    { value: "Reconciliation Complete", label: "Reconciliation Complete" },
                    { value: "Remediation Required", label: "Remediation Required" }
                  ]}
                  value={updateData.billStatus}
                  onChange={(value) => setUpdateData(prev => ({ ...prev, billStatus: value }))}
                  placeholder="Select bill status"
                />
              </div>
              <div className="space-y-2">
                <Label>Approval Status</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Pending", label: "Pending" },
                    { value: "Approved", label: "Approved" },
                    { value: "Not Approved", label: "Not Approved" }
                  ]}
                  value={updateData.approvalStatus}
                  onChange={(value) => setUpdateData(prev => ({ ...prev, approvalStatus: value }))}
                  placeholder="Select approval status"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <CustomSelectDropdown
                  options={[
                    { value: "Pending", label: "Pending" },
                    { value: "Paid", label: "Paid" },
                    { value: "Failed", label: "Failed" }
                  ]}
                  value={updateData.paymentStatus}
                  onChange={(value) => setUpdateData(prev => ({ ...prev, paymentStatus: value }))}
                  placeholder="Select payment status"
                />
              </div>
              <div className="space-y-2">
                <Label>Receipt Uploaded</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    checked={updateData.receiptUploaded}
                    onChange={(e) => setUpdateData(prev => ({ ...prev, receiptUploaded: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Receipt has been uploaded</span>
                </div>
              </div>
            </div>

            {updateData.receiptUploaded && (
              <div className="space-y-2">
                <Label>Upload Receipt (PDF)</Label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setUpdateData(prev => ({ ...prev, receiptFile: e.target.files?.[0] || null }))}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label>Comments</Label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
                value={updateData.comments}
                onChange={(e) => setUpdateData(prev => ({ ...prev, comments: e.target.value }))}
                placeholder="Add any comments or notes..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateBill}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteBillId} onOpenChange={() => setDeleteBillId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Water Bill</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ECG bill? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteBillId(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deleteBillId && handleDeleteBill(deleteBillId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </div>
  );
};

export default GhanaWater;