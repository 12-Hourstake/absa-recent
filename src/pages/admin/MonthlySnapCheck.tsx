import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

const MonthlySnapCheck = () => {
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const snapChecks = [
    {
      date: "15-Aug-2023",
      property: "East Legon Villa 2",
      meterReading: "1254",
      status: "ok",
      recordedBy: "Kwesi Mensah",
    },
    {
      date: "14-Aug-2023",
      property: "Osu Apartment B4",
      meterReading: "892",
      status: "issue",
      recordedBy: "Adwoa Boateng",
    },
    {
      date: "12-Aug-2023",
      property: "Cantonments Duplex",
      meterReading: "2431",
      status: "ok",
      recordedBy: "Yaw Addo",
    },
    {
      date: "11-Aug-2023",
      property: "Adenta Block C, Unit 5",
      meterReading: "450",
      status: "ok",
      recordedBy: "Esi Amponsah",
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Monthly Water Snap Check</h1>
        <p className="text-muted-foreground">
          Conduct and record monthly snap checks like water meter readings, leak checks, or tank levels.
        </p>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Record New Snap Check</CardTitle>
          <CardDescription>
            Fill in the details below to record a monthly water snap check
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Check Date */}
            <div className="space-y-2">
              <Label htmlFor="checkDate">Check Date</Label>
              <Input type="date" id="checkDate" defaultValue={new Date().toISOString().split('T')[0]} />
            </div>

            {/* Select Property/Unit */}
            <div className="space-y-2">
              <Label htmlFor="propertyUnit">Select Property/Unit</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a property or unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="villa2">East Legon Villa 2</SelectItem>
                  <SelectItem value="osu">Osu Apartment B4</SelectItem>
                  <SelectItem value="cantonments">Cantonments Duplex</SelectItem>
                  <SelectItem value="adenta">Adenta Block C, Unit 5</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Water Meter Reading */}
            <div className="space-y-2">
              <Label htmlFor="meterReading">Water Meter Reading (m³)</Label>
              <Input
                id="meterReading"
                type="number"
                placeholder="e.g., 1254"
              />
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="flex gap-2 h-14 items-center">
                <Button
                  type="button"
                  variant={selectedStatus === "ok" ? "default" : "outline"}
                  className={selectedStatus === "ok" ? "flex-1 bg-success hover:bg-success/90" : "flex-1"}
                  onClick={() => setSelectedStatus("ok")}
                >
                  OK
                </Button>
                <Button
                  type="button"
                  variant={selectedStatus === "issue" ? "destructive" : "outline"}
                  className="flex-1"
                  onClick={() => setSelectedStatus("issue")}
                >
                  Issue Reported
                </Button>
              </div>
            </div>

            {/* Observations & Notes */}
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="observations">Observations & Notes</Label>
              <Textarea
                id="observations"
                placeholder="e.g., Small drip noticed at the main inlet valve."
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" size="lg">
                <FileText className="mr-2 h-4 w-4" />
                Record Snap Check
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* History Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Snap Check History</CardTitle>
          <CardDescription>View all previously recorded snap checks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="filterProperty">Filter by Property/Unit</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="All Properties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Properties</SelectItem>
                  <SelectItem value="villa2">East Legon Villa 2</SelectItem>
                  <SelectItem value="osu">Osu Apartment B4</SelectItem>
                  <SelectItem value="cantonments">Cantonments Duplex</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filterDate">Filter by Date</Label>
              <Input type="date" id="filterDate" />
            </div>
            <div className="flex items-end">
              <Button variant="secondary" className="w-full">
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Property/Unit</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Meter Reading (m³)</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {snapChecks.map((check, index) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="px-4 py-4">{check.date}</td>
                      <td className="px-4 py-4">{check.property}</td>
                      <td className="px-4 py-4">{check.meterReading}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${check.status === "ok" ? "bg-success" : "bg-destructive"}`}></span>
                          <span>{check.status === "ok" ? "OK" : "Issue Reported"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4">{check.recordedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MonthlySnapCheck;
