import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { FileText, Eye, Shield, Info } from "lucide-react";

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
    <div className="w-full max-w-full overflow-x-hidden min-w-0">
      <div className="space-y-6 min-w-0">
        <div className="min-w-0">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900 break-words">Logs - Admin View</h1>
          <p className="text-gray-600 text-sm break-words">
            View all ECG electricity bills and Ghana Water bills logged by colleagues
          </p>
          
          {/* Modern Admin Notice Alert */}
          <Alert className="mt-4 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <Shield className="h-5 w-5 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="font-semibold">Admin View Only:</span> Logs are created by colleagues. This is a read-only view for monitoring and oversight.
                </div>
              </div>
            </AlertDescription>
          </Alert>
        </div>

        <Card className="min-w-0">
          <CardHeader>
            <CardTitle>All Log Entries ({logs.length})</CardTitle>
          </CardHeader>
          <CardContent className="min-w-0">
            {logs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No logs recorded yet</h3>
                <p className="break-words">Logs will appear here when colleagues record ECG bills and Ghana Water bills.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[100px]">Log ID</TableHead>
                      <TableHead className="min-w-[120px]">Log Type</TableHead>
                      <TableHead className="min-w-[120px]">Meter Number</TableHead>
                      <TableHead className="min-w-[150px]">Description</TableHead>
                      <TableHead className="min-w-[120px]">Logged By</TableHead>
                      <TableHead className="min-w-[140px]">Logged At</TableHead>
                      <TableHead className="min-w-[80px]">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {logs.map((log) => (
                      <TableRow key={log.logId}>
                        <TableCell className="font-mono text-sm truncate">{log.logId}</TableCell>
                        <TableCell className="truncate">{getLogTypeLabel(log.logType)}</TableCell>
                        <TableCell className="truncate">{log.meterNumber}</TableCell>
                        <TableCell className="truncate">{log.description || "-"}</TableCell>
                        <TableCell className="truncate">{log.loggedBy}</TableCell>
                        <TableCell className="truncate">{new Date(log.loggedAt).toLocaleString()}</TableCell>
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Log Preview Modal */}
        <Dialog open={showPreviewModal} onOpenChange={setShowPreviewModal}>
          <DialogContent className="w-[95vw] max-w-2xl rounded-xl">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-xl font-bold">Log Details - Admin View</DialogTitle>
              <p className="text-sm text-muted-foreground">View log entry information (read-only)</p>
            </DialogHeader>
            {selectedLog && (
              <div className="space-y-6 py-4 min-w-0">
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
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
                  <div className="space-y-4 min-w-0">
                    <div className="bg-gray-50 p-4 rounded-lg min-w-0">
                      <h3 className="font-medium text-gray-900 mb-3">General Information</h3>
                      <div className="space-y-2">
                        <div className="min-w-0">
                          <Label className="text-xs text-gray-500">Log ID</Label>
                          <p className="font-mono text-sm break-all">{selectedLog.logId}</p>
                        </div>
                        <div className="min-w-0">
                          <Label className="text-xs text-gray-500">Meter Number</Label>
                          <p className="font-semibold text-lg break-all">{selectedLog.meterNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 min-w-0">
                    <div className="bg-gray-50 p-4 rounded-lg min-w-0">
                      <h3 className="font-medium text-gray-900 mb-3">Metadata</h3>
                      <div className="space-y-2">
                        <div className="min-w-0">
                          <Label className="text-xs text-gray-500">Logged By</Label>
                          <p className="font-medium break-words">{selectedLog.loggedBy}</p>
                        </div>
                        <div className="min-w-0">
                          <Label className="text-xs text-gray-500">Logged At</Label>
                          <p className="text-sm break-words">{new Date(selectedLog.loggedAt).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedLog.description && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 min-w-0">
                    <Label className="text-xs text-blue-600 font-medium">Description / Notes</Label>
                    <p className="text-sm text-blue-800 mt-1 break-words">{selectedLog.description}</p>
                  </div>
                )}
                
                {selectedLog.receiptUrl && (
                  <div className="bg-gray-50 p-4 rounded-lg min-w-0">
                    <Label className="text-xs text-gray-500 font-medium">Receipt</Label>
                    <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm break-all flex-1 min-w-0">{selectedLog.receiptUrl}</span>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto">
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
    </div>
  );
};

export default Logs;