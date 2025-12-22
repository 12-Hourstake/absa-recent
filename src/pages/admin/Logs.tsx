import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
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
import { FileText, Eye } from "lucide-react";

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
  const [logs, setLogs] = useState<Log[]>([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    const cached = localStorage.getItem("LOGS_CACHE_V1");
    if (cached) {
      setLogs(JSON.parse(cached));
    }
  };

  const getLogTypeLabel = (type: string) => {
    return type === "ECG" ? "ECG Bill" : "Ghana Water Bill";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Logs - Admin View</h1>
        <p className="text-gray-600">
          View all ECG electricity bills and Ghana Water bills logged by colleagues
        </p>
        <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg border border-blue-200 mt-2">
          ℹ️ <strong>Admin View Only:</strong> Logs are created by colleagues. 
          This is a read-only view for monitoring and oversight.
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Log Entries ({logs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No logs recorded yet</h3>
              <p>Logs will appear here when colleagues record ECG bills and Ghana Water bills.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Log ID</TableHead>
                  <TableHead>Log Type</TableHead>
                  <TableHead>Meter Number</TableHead>
                  <TableHead>Description</TableHead>
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
                    <TableCell>{log.description || "-"}</TableCell>
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
            <DialogTitle className="text-xl font-bold">Log Details - Admin View</DialogTitle>
            <p className="text-sm text-muted-foreground">View log entry information (read-only)</p>
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