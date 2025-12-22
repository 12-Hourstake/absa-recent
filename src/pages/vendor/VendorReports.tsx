import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getScoreBadge, getProgressClass } from "@/lib/progress-utils";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Target,
  Award,
  Download,
  FileText,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBackButtonText } from "@/hooks/useBackButtonText";
import { useState } from "react";

const mockPerformanceData = {
  overallScore: 87,
  slaCompliance: 92,
  responseTime: 3.2,
  resolutionTime: 18.5,
  customerSatisfaction: 4.3,
  completedWorkOrders: 156,
  totalWorkOrders: 180,
  onTimeCompletion: 89,
  metrics: [
    {
      month: "January 2024",
      completed: 12,
      onTime: 11,
      slaMet: 12,
      avgResponseTime: 3.5,
      avgResolutionTime: 20.2,
    },
    {
      month: "February 2024",
      completed: 15,
      onTime: 14,
      slaMet: 15,
      avgResponseTime: 2.8,
      avgResolutionTime: 16.8,
    },
    {
      month: "March 2024",
      completed: 18,
      onTime: 16,
      slaMet: 17,
      avgResponseTime: 3.1,
      avgResolutionTime: 18.5,
    },
    {
      month: "April 2024",
      completed: 14,
      onTime: 13,
      slaMet: 14,
      avgResponseTime: 2.9,
      avgResolutionTime: 17.2,
    },
  ],
};

const VendorReports = () => {
  const navigate = useNavigate();
  const backButtonText = useBackButtonText();
  const [success, setSuccess] = useState("");


  const handleExportPDF = () => {
    setSuccess("Performance report exported to PDF successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleExportExcel = () => {
    setSuccess("Performance data exported to Excel successfully!");
    setTimeout(() => setSuccess(""), 3000);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Performance Reports
          </h1>
          <p className="text-muted-foreground">
            Detailed performance metrics and analytics for your services.
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

      {/* Key Performance Indicators */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {mockPerformanceData.overallScore}%
            </div>
            <div className="mt-1">
              <Badge className={getScoreBadge(mockPerformanceData.overallScore).className}>
                {getScoreBadge(mockPerformanceData.overallScore).label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Performance rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              SLA Compliance
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {mockPerformanceData.slaCompliance}%
            </div>
            <div className="mt-1">
              <Badge className={getScoreBadge(mockPerformanceData.slaCompliance).className}>
                {getScoreBadge(mockPerformanceData.slaCompliance).label}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Service level adherence
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {mockPerformanceData.responseTime}h
            </div>
            <p className="text-xs text-muted-foreground">Target: 4 hours</p>
            <div className="mt-2">
              <Progress
                value={((4 - mockPerformanceData.responseTime) / 4) * 100}
                className={`w-full ${getProgressClass(((4 - mockPerformanceData.responseTime) / 4) * 100)}`}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Satisfaction
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold bg-gradient-to-r from-[#aa0427] to-[#970323] bg-clip-text text-transparent mb-2 tracking-tight">
              {mockPerformanceData.customerSatisfaction}/5
            </div>
            <p className="text-xs text-muted-foreground">Based on feedback</p>
            <div className="mt-2">
              <Progress
                value={(mockPerformanceData.customerSatisfaction / 5) * 100}
                className={`w-full ${getProgressClass((mockPerformanceData.customerSatisfaction / 5) * 100)}`}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Export Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleExportPDF}>
              <FileText className="h-4 w-4 mr-2" />
              Export PDF Report
            </Button>
            <Button variant="outline" onClick={handleExportExcel}>
              <Download className="h-4 w-4 mr-2" />
              Export Excel Data
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Work Order Statistics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Work Order Completion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Completed Work Orders</span>
              <span className="text-sm font-bold">
                {mockPerformanceData.completedWorkOrders}/
                {mockPerformanceData.totalWorkOrders}
              </span>
            </div>
            <Progress
              value={
                (mockPerformanceData.completedWorkOrders /
                  mockPerformanceData.totalWorkOrders) *
                100
              }
              className={`w-full ${getProgressClass((mockPerformanceData.completedWorkOrders / mockPerformanceData.totalWorkOrders) * 100)}`}
            />

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">On-Time Completion</span>
              <span className="text-sm font-bold">
                {mockPerformanceData.onTimeCompletion}%
              </span>
            </div>
            <Progress
              value={mockPerformanceData.onTimeCompletion}
              className={`w-full ${getProgressClass(mockPerformanceData.onTimeCompletion)}`}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Response Time Trend</span>
                <Badge className="bg-green-100 text-green-800">
                  ↓ Improving
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Resolution Time Trend</span>
                <Badge className="bg-green-100 text-green-800">
                  ↓ Improving
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">SLA Compliance</span>
                <Badge className="bg-blue-100 text-blue-800">→ Stable</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Customer Satisfaction</span>
                <Badge className="bg-green-100 text-green-800">
                  ↑ Improving
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">Month</th>
                  <th className="text-left py-3 px-4 font-medium">Completed</th>
                  <th className="text-left py-3 px-4 font-medium">On Time</th>
                  <th className="text-left py-3 px-4 font-medium">SLA Met</th>
                  <th className="text-left py-3 px-4 font-medium">
                    Avg Response (h)
                  </th>
                  <th className="text-left py-3 px-4 font-medium">
                    Avg Resolution (h)
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockPerformanceData.metrics.map((metric, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3 px-4">{metric.month}</td>
                    <td className="py-3 px-4">{metric.completed}</td>
                    <td className="py-3 px-4">{metric.onTime}</td>
                    <td className="py-3 px-4">{metric.slaMet}</td>
                    <td className="py-3 px-4">{metric.avgResponseTime}</td>
                    <td className="py-3 px-4">{metric.avgResolutionTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Performance Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800">
                Response Time Optimization
              </p>
              <p className="text-sm text-blue-700">
                Consider implementing automated ticket routing to reduce
                response times further.
              </p>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-medium text-green-800">
                SLA Excellence
              </p>
              <p className="text-sm text-green-700">
                Maintain current SLA compliance levels - excellent performance!
              </p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">
                Customer Satisfaction
              </p>
              <p className="text-sm text-yellow-700">
                Continue gathering customer feedback to maintain high
                satisfaction scores.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorReports;
