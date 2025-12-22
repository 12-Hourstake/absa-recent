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
import { Calculator, RotateCcw, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface CalculationResult {
  baseRate: number;
  severityMultiplier: number;
  severityAmount: number;
  durationFactor: number;
  totalPenalty: number;
}

const SLAPenaltyCalculator = () => {
  const [slaType, setSlaType] = useState("");
  const [severityLevel, setSeverityLevel] = useState("");
  const [breachDuration, setBreachDuration] = useState("10");
  const [contractId] = useState("ABSA-KUM-0451");
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculatePenalty = () => {
    if (!slaType || !severityLevel || !breachDuration) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      const baseRates: Record<string, number> = {
        maintenance: 500,
        uptime: 750,
        cleaning: 300,
        security: 600,
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

      setIsCalculating(false);
      toast.success("Penalty calculated successfully");
    }, 500);
  };

  const resetForm = () => {
    setSlaType("");
    setSeverityLevel("");
    setBreachDuration("10");
    setResult(null);
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
                  <SelectItem value="maintenance">Maintenance Response Time</SelectItem>
                  <SelectItem value="uptime">Facility Uptime</SelectItem>
                  <SelectItem value="cleaning">Cleaning Services</SelectItem>
                  <SelectItem value="security">Security Services</SelectItem>
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
              <Label htmlFor="contract-id">Contract ID</Label>
              <Input
                id="contract-id"
                value={contractId}
                readOnly
                className="bg-muted cursor-not-allowed"
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
                      This penalty will be applied to Contract {contractId}. The vendor will be
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
    </div>
  );
};

export default SLAPenaltyCalculator;
