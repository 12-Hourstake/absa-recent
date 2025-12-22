import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ThumbsUp, ThumbsDown } from "lucide-react";

const InvoiceDetail = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <a href="#" className="hover:underline">Invoices</a>
        <span>/</span>
        <span>INV-2024-058</span>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <CardTitle className="text-4xl font-black">Invoice INV-2024-058</CardTitle>
                <Badge variant="secondary">Pending Approval</Badge>
              </div>
              <p className="text-muted-foreground">From <a href="#" className="text-primary hover:underline">Ananse Electricals Ltd.</a></p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline"><Download className="h-4 w-4 mr-2" />Download PDF</Button>
              <Button variant="outline"><ThumbsDown className="h-4 w-4 mr-2 text-red-500" />Reject</Button>
              <Button className="bg-green-600 hover:bg-green-700"><ThumbsUp className="h-4 w-4 mr-2" />Approve</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">BILLED TO</h3>
              <p className="font-medium">ABSA Property Management</p>
              <p className="text-muted-foreground">Liberation Road</p>
              <p className="text-muted-foreground">Accra, Ghana</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">FROM</h3>
              <p className="font-medium">Ananse Electricals Ltd.</p>
              <p className="text-muted-foreground">15 Osu Avenue, Osu</p>
              <p className="text-muted-foreground">Accra, Ghana</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Issue Date</h3>
              <p className="font-medium">15 July, 2024</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Due Date</h3>
              <p className="font-medium">14 August, 2024</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="p-4 text-left text-sm font-medium">Item Description</th>
                  <th className="p-4 text-right text-sm font-medium">Quantity</th>
                  <th className="p-4 text-right text-sm font-medium">Unit Price (GHS)</th>
                  <th className="p-4 text-right text-sm font-medium">Total (GHS)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr>
                  <td className="p-4">Quarterly HVAC Maintenance - East Legon Property</td>
                  <td className="p-4 text-right">1</td>
                  <td className="p-4 text-right">1,200.00</td>
                  <td className="p-4 text-right font-medium">1,200.00</td>
                </tr>
                <tr className="bg-muted/50">
                  <td className="p-4">LED Bulb Replacement (20 units)</td>
                  <td className="p-4 text-right">20</td>
                  <td className="p-4 text-right">15.00</td>
                  <td className="p-4 text-right font-medium">300.00</td>
                </tr>
                <tr>
                  <td className="p-4">Emergency Call-out: Fuse Box Repair</td>
                  <td className="p-4 text-right">1</td>
                  <td className="p-4 text-right">450.00</td>
                  <td className="p-4 text-right font-medium">450.00</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <div className="w-full max-w-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">GHS 1,950.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax (VAT 15%)</span>
                <span className="font-medium">GHS 292.50</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="text-lg font-bold">Total Amount</span>
                <span className="text-2xl font-black">GHS 2,242.50</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDetail;
