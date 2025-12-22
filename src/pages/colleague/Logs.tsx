import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, FileText, Eye, Download } from "lucide-react";

interface Log {
  logId: string;
  logType: "ECG" | "GHANA_WATER";
  meterNumber: string;
  description?: string;
  receiptUrl?: string;
  loggedBy: string;
  loggedAt: string;
}

const Logs = () => {
  const { session } = useAuth();
  const [logs, setLogs] = useState<Log[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [formData, setFormData] = useState({
    logType: "",
    meterNumber: "",
    description: "",
    receiptFile: null as File | null,
  });

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const cached = localStorage.getItem("LOGS_CACHE_V1");
    if (cached) {
      setLogs(JSON.parse(cached));
    }
  };

  const handleCreateLog = () => {
    if (!session || !formData.logType || !formData.meterNumber) return;

    const newLog: Log = {
      logId: `LOG-${Date.now()}`,
      logType: formData.logType as "ECG" | "GHANA_WATER",
      meterNumber: formData.meterNumber,
      description: formData.description,
      receiptUrl: formData.receiptFile ? `receipt-${Date.now()}.pdf` : undefined,
      loggedBy: session.fullName,
      loggedAt: new Date().toISOString(),
    };

    const cached = localStorage.getItem("LOGS_CACHE_V1");
    const allLogs = cached ? JSON.parse(cached) : [];
    const updatedLogs = [...allLogs, newLog];
    
    localStorage.setItem("LOGS_CACHE_V1", JSON.stringify(updatedLogs));
    setLogs(updatedLogs);
    
    // Reset form
    setFormData({
      logType: "",
      meterNumber: "",
      description: "",
      receiptFile: null,
    });
    setShowCreateModal(false);
  };

  const getLogTypeLabel = (type: string) => {
    return type === "ECG" ? "ECG Bill" : "Ghana Water Bill";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Logs</h1>
          <p className="text-gray-600">
            Record ECG electricity bills and Ghana Water bills
          </p>
        </div>
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Log Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl rounded-xl">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-xl font-bold">Create Log Entry</DialogTitle>
              <p className="text-sm text-muted-foreground">Record ECG electricity bill or Ghana Water bill</p>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Log Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Log Type *</Label>
                    <Select value={formData.logType} onValueChange={(value) => setFormData({...formData, logType: value})}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select log type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ECG">ECG Bill</SelectItem>
                        <SelectItem value="GHANA_WATER">Ghana Water Bill</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Meter Number *</Label>
                    <Input
                      className="mt-1 font-semibold"
                      value={formData.meterNumber}
                      onChange={(e) => setFormData({...formData, meterNumber: e.target.value})}
                      placeholder="Enter meter number"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-4">Additional Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Description / Notes</Label>
                    <Textarea
                      className="mt-1"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Optional notes about this bill"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Upload Receipt</Label>
                    <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                      <Input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFormData({...formData, receiptFile: e.target.files?.[0] || null})}
                        className="hidden"
                        id="receipt-upload"
                      />
                      <label htmlFor="receipt-upload" className="cursor-pointer">
                        <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          {formData.receiptFile ? formData.receiptFile.name : "Click to upload receipt (PDF, JPG, PNG)"}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="font-medium text-blue-900 mb-2">Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-blue-600">Logged By</Label>
                    <p className="font-medium text-blue-800">{session?.fullName || ""}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-blue-600">Date & Time</Label>
                    <p className="font-medium text-blue-800">{new Date().toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateLog} 
                  disabled={!formData.logType || !formData.meterNumber}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Create Log Entry
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Log Entries ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No logs recorded yet.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Log ID</TableHead>
                  <TableHead>Log Type</TableHead>
                  <TableHead>Meter Number</TableHead>
                  <TableHead>Logged By</TableHead>
                  <TableHead>Logged At</TableHead>
                  <TableHead>Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.logId}>
                    <TableCell className="font-mono text-sm">{log.logId}</TableCell>
                    <TableCell>{getLogTypeLabel(log.logType)}</TableCell>
                    <TableCell>{log.meterNumber}</TableCell>
                    <TableCell>{log.loggedBy}</TableCell>
                    <TableCell>{new Date(log.loggedAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedLog(log);
                          setShowPreviewModal(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Log Preview Modal */}
      <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
        <DialogContent className="max-w-2xl rounded-xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl font-bold">Log Details</DialogTitle>
            <p className="text-sm text-muted-foreground">View log entry information</p>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Log Type:</span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedLog.logType === 'ECG' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {getLogTypeLabel(selectedLog.logType)}
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">General Information</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Log ID</Label>
                        <p className="font-mono text-sm">{selectedLog.logId}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Meter Number</Label>
                        <p className="font-semibold text-lg">{selectedLog.meterNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">Metadata</h3>
                    <div className="space-y-2">
                      <div>
                        <Label className="text-xs text-gray-500">Logged By</Label>
                        <p className="font-medium">{selectedLog.loggedBy}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-500">Logged At</Label>
                        <p className="text-sm">{new Date(selectedLog.loggedAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {selectedLog.description && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Label className="text-xs text-blue-600 font-medium">Description / Notes</Label>
                  <p className="text-sm text-blue-800 mt-1">{selectedLog.description}</p>
                </div>
              )}
              
              {selectedLog.receiptUrl && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <Label className="text-xs text-gray-500 font-medium">Receipt</Label>
                  <div className="mt-2 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedLog.receiptUrl}</span>
                    <Button variant="outline" size="sm" className="ml-auto">
                      Download
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Logs;