import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, RotateCcw, FileText, AlertCircle, Send, Eye } from "lucide-react";
import { toast } from "sonner";
import { useSLA } from "@/contexts/SLAContext";

interface CalculationResult {
  baseRate: number;
  severityMultiplier: number;
  severityAmount: number;
  durationFactor: number;
  totalPenalty: number;
}

const SLAPenaltyCalculator = () => {
  const { penalties, addPenalty, updatePenaltyStatus } = useSLA();
  const [slaType, setSlaType] = useState("");
  const [severityLevel, setSeverityLevel] = useState("");
  const [vendor, setVendor] = useState("");
  const [breachDuration, setBreachDuration] = useState("10");
  const [breachStartDate, setBreachStartDate] = useState("");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePenalty = () => {
    if (!slaType || !severityLevel || !breachDuration || !vendor) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCalculating(true);

    setTimeout(() => {
      const baseRates: Record<string, number> = {
        "Maintenance Response": 500,
        "Facility Uptime": 750,
        "Cleaning Services": 300,
        "Security Services": 600,
      };

      const multipliers: Record<string, number> = {
        critical: 2.0,
        major: 1.5,
        minor: 1.0,
      };

      const hourlyRate = 50;
      const hours = parseFloat(breachDuration);
      const baseRate = baseRates[slaType] || 500;
      const multiplier = multipliers[severityLevel] || 1.0;

      const severityAmount = baseRate * multiplier;
      const durationFactor = hours * hourlyRate;
      const totalPenalty = severityAmount + durationFactor;

      setResult({
        baseRate,
        severityMultiplier: multiplier,
        severityAmount,
        durationFactor,
        totalPenalty,
      });

      // Add penalty to global store
      addPenalty({
        slaType,
        severityLevel,
        vendor,
        breachDuration: hours,
        breachStartDate: breachStartDate ? new Date(breachStartDate) : undefined,
        calculatedAmount: totalPenalty,
        status: 'Pending Payment'
      });

      // Also create work order entry in cache for vendor portal sync
      const workOrdersCache = JSON.parse(localStorage.getItem("WORK_ORDERS_CACHE_V1") || "[]");
      const newWorkOrder = {
        id: `WO-${Date.now()}`,
        requestType: slaType,
        asset: `SLA Breach - ${slaType}`,
        location: "System Generated",
        priority: severityLevel === 'critical' ? 'Critical' : severityLevel === 'major' ? 'High' : 'Medium',
        status: "Completed",
        assignedDate: breachStartDate || new Date().toISOString().split('T')[0],
        dueDate: new Date().toISOString().split('T')[0],
        description: `SLA breach penalty calculation for ${slaType}`,
        assignedVendor: vendor,
        createdDate: new Date().toISOString()
      };
      
      const updatedWorkOrders = [...workOrdersCache, newWorkOrder];
      localStorage.setItem("WORK_ORDERS_CACHE_V1", JSON.stringify(updatedWorkOrders));

      setIsCalculating(false);
      toast.success("Penalty calculated and saved successfully");
    }, 500);
  };

  const resetForm = () => {
    setSlaType("");
    setSeverityLevel("");
    setVendor("");
    setBreachDuration("10");
    setBreachStartDate("");
    setResult(null);
  };

  const handleSendInvoice = (penaltyId: string) => {
    // Update penalty status in admin side
    updatePenaltyStatus(penaltyId, 'Invoice Sent');
    
    // Sync to vendor portal
    const penalty = penalties.find(p => p.id === penaltyId);
    if (penalty) {
      const vendorPenalty = {
        id: penaltyId,
        vendorId: penalty.vendor,
        vendorName: penalty.vendor,
        breachType: penalty.slaType,
        penaltyAmount: penalty.calculatedAmount,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        status: 'Invoice Sent',
        invoiceDate: new Date().toISOString().split('T')[0],
        description: `SLA breach penalty for ${penalty.slaType} - ${penalty.severityLevel} severity`,
        createdDate: penalty.createdAt.toISOString().split('T')[0]
      };
      
      // Save to vendor penalties cache
      const existingPenalties = JSON.parse(localStorage.getItem("SLA_PENALTIES_CACHE_V1") || "[]");
      const updatedPenalties = [...existingPenalties.filter((p: any) => p.id !== penaltyId), vendorPenalty];
      localStorage.setItem("SLA_PENALTIES_CACHE_V1", JSON.stringify(updatedPenalties));
      
      // Also save to admin penalties for sync back
      localStorage.setItem("SLA_PENALTIES_ADMIN_V1", JSON.stringify(penalties));
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new CustomEvent('sla-penalties-updated'));
    }
    
    toast.success("Invoice sent to vendor");
  };

  const handleMarkCompleted = (penaltyId: string) => {
    updatePenaltyStatus(penaltyId, 'Completed');
    toast.success("Penalty marked as completed");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending Payment':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Payment</Badge>;
      case 'Invoice Sent':
        return <Badge className="bg-blue-100 text-blue-800">Invoice Sent</Badge>;
      case 'Completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSeverityLabel = (level: string, multiplier: number) => {
    return `${level.charAt(0).toUpperCase() + level.slice(1)} - x${multiplier.toFixed(1)}`;
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">SLA Penalty Calculator</h1>
        <p className="text-muted-foreground mt-1">
          Calculate potential penalties for SLA breaches based on predefined rules.
        </p>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Calculation Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="sla-type">SLA Type</Label>
              <Select value={slaType} onValueChange={setSlaType}>
                <SelectTrigger id="sla-type">
                  <SelectValue placeholder="Select SLA Type" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="Maintenance Response">Maintenance Response</SelectItem>
                  <SelectItem value="Facility Uptime">Facility Uptime</SelectItem>
                  <SelectItem value="Cleaning Services">Cleaning Services</SelectItem>
                  <SelectItem value="Security Services">Security Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="severity-level">Severity Level</Label>
              <Select value={severityLevel} onValueChange={setSeverityLevel}>
                <SelectTrigger id="severity-level">
                  <SelectValue placeholder="Select Severity Level" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="major">Major</SelectItem>
                  <SelectItem value="minor">Minor</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vendor">Vendor</Label>
              <Select value={vendor} onValueChange={setVendor}>
                <SelectTrigger id="vendor">
                  <SelectValue placeholder="Select Vendor" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="CleanCo Ghana Ltd">CleanCo Ghana Ltd</SelectItem>
                  <SelectItem value="SecureGuard Services">SecureGuard Services</SelectItem>
                  <SelectItem value="TechMaint Solutions">TechMaint Solutions</SelectItem>
                  <SelectItem value="FacilityPro Ghana">FacilityPro Ghana</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="breach-duration">Breach Duration (Hours)</Label>
              <Input
                id="breach-duration"
                type="number"
                min="0"
                placeholder="Enter number of hours"
                value={breachDuration}
                onChange={(e) => setBreachDuration(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="breach-start-date">Breach Start Date (Optional)</Label>
              <Input
                id="breach-start-date"
                type="date"
                value={breachStartDate}
                onChange={(e) => setBreachStartDate(e.target.value)}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                onClick={calculatePenalty}
                className="flex-1 bg-primary hover:bg-primary/90"
                disabled={isCalculating}
              >
                <Calculator className="h-4 w-4 mr-2" />
                {isCalculating ? "Calculating..." : "Calculate Penalty"}
              </Button>
              <Button
                onClick={resetForm}
                variant="outline"
                className="flex-1 border-primary text-primary hover:bg-primary/10"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Form
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Penalty Calculation Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {result ? (
              <>
                <div className="flex flex-col items-center justify-center bg-muted/50 rounded-lg p-8">
                  <p className="text-muted-foreground text-lg font-medium">
                    Calculated Penalty
                  </p>
                  <p className="text-5xl font-black text-foreground mt-2 tracking-tight">
                    GHS {result.totalPenalty.toLocaleString("en-GH", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">Base Rate</p>
                    <p className="font-medium">
                      GHS {result.baseRate.toLocaleString("en-GH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                      Severity Multiplier ({getSeverityLabel(severityLevel, result.severityMultiplier)})
                    </p>
                    <p className="font-medium">
                      GHS {result.severityAmount.toLocaleString("en-GH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                      Duration Factor ({breachDuration} hours @ GHS 50/hr)
                    </p>
                    <p className="font-medium">
                      GHS {result.durationFactor.toLocaleString("en-GH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>

                <div className="bg-primary/10 rounded-lg p-4 flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Penalty Notice</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      This penalty will be applied to the selected vendor. The vendor will be
                      notified automatically upon confirmation.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    Confirm & Apply Penalty
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Export Report
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Calculator className="h-16 w-16 text-muted-foreground/50 mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No Calculation Yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Fill in the parameters and click "Calculate Penalty" to see results.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Reference: Penalty Rates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="font-semibold">Maintenance Response</p>
              <p className="text-2xl font-bold text-primary mt-1">GHS 500</p>
              <p className="text-sm text-muted-foreground">Base rate per breach</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="font-semibold">Facility Uptime</p>
              <p className="text-2xl font-bold text-primary mt-1">GHS 750</p>
              <p className="text-sm text-muted-foreground">Base rate per breach</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="font-semibold">Cleaning Services</p>
              <p className="text-2xl font-bold text-primary mt-1">GHS 300</p>
              <p className="text-sm text-muted-foreground">Base rate per breach</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <p className="font-semibold">Security Services</p>
              <p className="text-2xl font-bold text-primary mt-1">GHS 600</p>
              <p className="text-sm text-muted-foreground">Base rate per breach</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Penalty History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Penalty History</CardTitle>
        </CardHeader>
        <CardContent>
          {penalties.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-lg font-medium text-muted-foreground">No penalties calculated yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Calculated penalties will appear here for tracking and invoicing
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Penalty ID</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">SLA Type</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Vendor</th>
                    <th className="p-4 text-right text-xs font-medium uppercase tracking-wider">Amount (GHS)</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                    <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">Created Date</th>
                    <th className="p-4 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {penalties.map((penalty) => (
                    <tr key={penalty.id} className="hover:bg-muted/50">
                      <td className="p-4 font-mono text-sm">{penalty.id.split('-').slice(-2).join('-')}</td>
                      <td className="p-4 text-sm">{penalty.slaType}</td>
                      <td className="p-4 text-sm">{penalty.vendor}</td>
                      <td className="p-4 text-right font-medium">{penalty.calculatedAmount?.toLocaleString('en-GH', { minimumFractionDigits: 2 }) || '0.00'}</td>
                      <td className="p-4">{getStatusBadge(penalty.status)}</td>
                      <td className="p-4 text-sm">{penalty.createdAt.toLocaleDateString()}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {penalty.status === 'Pending Payment' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendInvoice(penalty.id)}
                              className="gap-1"
                            >
                              <Send className="h-3 w-3" />
                              Send Invoice
                            </Button>
                          )}
                          {penalty.status === 'Invoice Sent' && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkCompleted(penalty.id)}
                              className="gap-1 bg-green-600 hover:bg-green-700"
                            >
                              Mark Completed
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SLAPenaltyCalculator;
