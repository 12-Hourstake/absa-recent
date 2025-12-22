import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const VendorInvoices = () => {
  const invoices = [
    { id: "INV-2024-001", client: "Kwame & Sons Ltd.", property: "East Legon Hills Villa", amount: "5,250.00", dueDate: "25-Oct-2024", status: "Overdue" },
    { id: "INV-2024-002", client: "Adjei Real Estate", property: "Cantonments Residence", amount: "1,800.00", dueDate: "15-Nov-2024", status: "Pending" },
    { id: "INV-2024-003", client: "Mensah Cleaning Services", property: "Airport Hills Complex", amount: "3,500.00", dueDate: "01-Oct-2024", status: "Paid" },
    { id: "INV-2024-004", client: "Osei Landscaping", property: "Trassaco Valley Estate", amount: "8,000.00", dueDate: "30-Nov-2024", status: "Pending" },
    { id: "INV-2024-005", client: "Ama's Electricals", property: "Labone Apartments", amount: "2,150.00", dueDate: "18-Sep-2024", status: "Overdue" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-black tracking-tight">Invoices</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Overdue</p>
            <p className="text-2xl font-bold">GHS 15,750.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Pending Invoices</p>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Paid (Last 30d)</p>
            <p className="text-2xl font-bold">GHS 42,300.00</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Total Invoices</p>
            <p className="text-2xl font-bold">87</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left">Invoice ID</th>
                  <th className="px-6 py-3 text-left">Vendor/Client</th>
                  <th className="px-6 py-3 text-left">Property</th>
                  <th className="px-6 py-3 text-right">Amount (GHS)</th>
                  <th className="px-6 py-3 text-left">Due Date</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">{invoice.id}</td>
                    <td className="px-6 py-4">{invoice.client}</td>
                    <td className="px-6 py-4">{invoice.property}</td>
                    <td className="px-6 py-4 text-right">{invoice.amount}</td>
                    <td className="px-6 py-4">{invoice.dueDate}</td>
                    <td className="px-6 py-4">
                      <Badge variant={invoice.status === "Paid" ? "default" : invoice.status === "Overdue" ? "destructive" : "secondary"}>
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Button variant="ghost" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorInvoices;
