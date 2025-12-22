import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, Eye, Download, Edit, Trash2 } from "lucide-react";

const DocumentUploads = () => {
  const documents = [
    { name: "Business Registration Certificate", type: "Business License", expiry: "15/12/2024", uploaded: "01/01/2024", status: "Verified" },
    { name: "SSNIT Clearance Certificate", type: "Tax Certificate", expiry: "30/06/2024", uploaded: "15/02/2024", status: "Pending Review" },
    { name: "GRA Tax Clearance", type: "Tax Certificate", expiry: "31/12/2023", uploaded: "18/01/2023", status: "Expired" },
    { name: "Public Liability Insurance", type: "Insurance Policy", expiry: "20/08/2024", uploaded: "05/03/2024", status: "Verified" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-4xl font-black tracking-tight">Vendor Documents / Certificates</h1>
        <p className="text-muted-foreground">Manage your business licenses, certificates, and insurance policies.</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed px-6 py-14">
            <div className="flex flex-col items-center gap-2 text-center max-w-lg">
              <Upload className="h-12 w-12 text-muted-foreground" />
              <p className="text-lg font-bold">Drag & drop your files here or click to browse</p>
              <p className="text-sm text-muted-foreground">Accepted formats: PDF, DOCX, JPG, PNG. Max size: 10MB.</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">Browse Files</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-[22px] font-bold">Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase">Document Name</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase">Expiry Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase">Uploaded Date</th>
                  <th className="px-6 py-4 text-left text-xs font-medium uppercase">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-medium uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {documents.map((doc, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="px-6 py-4 font-medium">{doc.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{doc.type}</td>
                    <td className={`px-6 py-4 ${doc.status === "Expired" ? "text-red-600 font-medium" : "text-muted-foreground"}`}>{doc.expiry}</td>
                    <td className="px-6 py-4 text-muted-foreground">{doc.uploaded}</td>
                    <td className="px-6 py-4">
                      <Badge variant={doc.status === "Verified" ? "default" : doc.status === "Expired" ? "destructive" : "secondary"}>
                        {doc.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon"><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Download className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Edit className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </div>
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

export default DocumentUploads;
