import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle, CreditCard, Eye, CheckCircle2, Clock } from "lucide-react";
import { toast } from "sonner";

const SLAPenalties = () => {
  const [penalties, setPenalties] = useState<any[]>([]);
  const [selectedPenalty, setSelectedPenalty] = useState<any>(null);

  useEffect(() => {
    loadPenalties();
    
    // Listen for storage changes to sync with admin updates
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "SLA_PENALTIES_CACHE_V1") {
        loadPenalties();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events for same-tab updates
    const handleCustomUpdate = () => {
      loadPenalties();
    };
    
    window.addEventListener('sla-penalties-updated', handleCustomUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sla-penalties-updated', handleCustomUpdate);
    };
  }, []);

  const loadPenalties = () => {
    try {
      const currentVendorId = localStorage.getItem("AUTH_SESSION_V1") 
        ? JSON.parse(localStorage.getItem("AUTH_SESSION_V1") || "{}").vendorId 
        : "VEN-001";
      
      const cached = localStorage.getItem("SLA_PENALTIES_CACHE_V1");
      const allPenalties = cached ? JSON.parse(cached) : [];
      
      const vendorPenalties = allPenalties.filter((p: any) => p.vendorId === currentVendorId);
      setPenalties(vendorPenalties);
    } catch (err) {
      console.error("Error loading penalties:", err);
      setPenalties([]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Invoice Sent':
        return <Badge className="bg-yellow-100 text-yellow-800">Invoice Sent</Badge>;
      case 'Paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handlePayPenalty = (penaltyId: string) => {
    try {
      // Update penalty status in vendor cache
      const cached = localStorage.getItem("SLA_PENALTIES_CACHE_V1");
      const allPenalties = cached ? JSON.parse(cached) : [];
      
      const updatedPenalties = allPenalties.map((p: any) => 
        p.id === penaltyId 
          ? { ...p, status: 'Paid', paidDate: new Date().toISOString().split('T')[0] }
          : p
      );
      
      localStorage.setItem("SLA_PENALTIES_CACHE_V1", JSON.stringify(updatedPenalties));
      
      // Sync back to admin SLA context
      const adminPenalties = JSON.parse(localStorage.getItem("SLA_PENALTIES_ADMIN_V1") || "[]");
      const updatedAdminPenalties = adminPenalties.map((p: any) => 
        p.id === penaltyId 
          ? { ...p, status: 'Completed', paidDate: new Date().toISOString().split('T')[0] }
          : p
      );
      localStorage.setItem("SLA_PENALTIES_ADMIN_V1", JSON.stringify(updatedAdminPenalties));
      
      loadPenalties();
      toast.success("Penalty payment confirmed");
    } catch (err) {
      console.error("Error updating penalty:", err);
      toast.error("Failed to update penalty status");
    }
  };

  const totalPendingAmount = penalties
    .filter(p => p.status === 'Invoice Sent')
    .reduce((sum, p) => sum + p.penaltyAmount, 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">SLA Penalties</h1>
        <p className="text-muted-foreground">
          View and manage SLA penalty invoices
        </p>
        {/* Debug info to confirm correct page */}
        <div className="text-xs text-gray-400 font-mono">
          Route: /vendor/penalties | Component: SLAPenalties
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Penalties</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#870A3C]">{penalties.length}</div>
            <p className="text-xs text-muted-foreground">All time penalties</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {penalties.filter(p => p.status === 'Invoice Sent').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting payment</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Amount Due</CardTitle>
            <CreditCard className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              GHS {totalPendingAmount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Total outstanding</p>
          </CardContent>
        </Card>
      </div>

      {/* Penalties Table */}
      <Card>
        <CardHeader>
          <CardTitle>Penalty Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Penalty ID</TableHead>
                  <TableHead>Breach Type</TableHead>
                  <TableHead>Amount (GHS)</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {penalties.map((penalty) => (
                  <TableRow key={penalty.id} className="hover:bg-gray-50">
                    <TableCell className="font-mono text-sm">{penalty.id.split('-').slice(-2).join('-')}</TableCell>
                    <TableCell>{penalty.breachType}</TableCell>
                    <TableCell className="font-medium">GHS {penalty.penaltyAmount.toLocaleString()}</TableCell>
                    <TableCell>{penalty.invoiceDate}</TableCell>
                    <TableCell>{penalty.dueDate}</TableCell>
                    <TableCell>{getStatusBadge(penalty.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => setSelectedPenalty(penalty)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Penalty Details</DialogTitle>
                            </DialogHeader>
                            {selectedPenalty && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Penalty ID</label>
                                    <p className="text-sm font-mono">{selectedPenalty.id}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Breach Type</label>
                                    <p className="text-sm">{selectedPenalty.breachType}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Amount</label>
                                    <p className="text-sm font-medium">GHS {selectedPenalty.penaltyAmount.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Due Date</label>
                                    <p className="text-sm">{selectedPenalty.dueDate}</p>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <p className="text-sm mt-1">{selectedPenalty.description}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Status</label>
                                  <div className="mt-1">{getStatusBadge(selectedPenalty.status)}</div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        {penalty.status === 'Invoice Sent' && (
                          <Button
                            size="sm"
                            onClick={() => handlePayPenalty(penalty.id)}
                            className="gap-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            Mark as Paid
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {penalties.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">No Penalties</h3>
              <p className="text-sm text-muted-foreground">You don't have any SLA penalties at the moment.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-800">Payment Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-blue-700">
            <p>• SLA penalties are automatically calculated based on breach severity and duration</p>
            <p>• Payment is due within 30 days of invoice date</p>
            <p>• Late payments may incur additional charges</p>
            <p>• Contact support if you have questions about any penalty</p>
            <p>• Payment confirmations are processed within 24 hours</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SLAPenalties;