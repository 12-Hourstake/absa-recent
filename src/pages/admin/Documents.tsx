import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Upload,
  CloudUpload,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Folder,
  User,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  Filter,
  X,
  Lock,
  UploadCloud
} from "lucide-react";
import { toast } from "sonner";
import { useDocuments } from "@/contexts/DocumentContext";



const Documents = () => {
  const { documents, addDocument, removeDocument } = useDocuments();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState("Category");
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    category: "",
    associatedEntity: "",
    file: null as File | null
  });

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Legal': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      'Financial': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
      'Operations': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200',
      'HR': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
      'Technical': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
      'Administrative': 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
  };

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    setUploadForm(prev => ({ ...prev, file, title: file.name }));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFileUpload(e.dataTransfer.files);
    setShowUploadModal(true);
  }, [handleFileUpload]);

  const handleUploadDocument = () => {
    if (!uploadForm.file || !uploadForm.title || !uploadForm.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const fileExtension = uploadForm.file.name.split('.').pop()?.toLowerCase() || '';
    const fileSize = (uploadForm.file.size / 1024 / 1024).toFixed(2) + ' MB';

    addDocument({
      name: uploadForm.title,
      fileType: fileExtension,
      category: uploadForm.category,
      uploadedBy: "Current User",
      associatedEntity: uploadForm.associatedEntity || "System Wide",
      fileSize,
      sourceModule: "Documents",
      file: uploadForm.file
    });

    setUploadForm({ title: "", category: "", associatedEntity: "", file: null });
    setShowUploadModal(false);
    toast.success("Document uploaded successfully!");
  };

  const filteredDocuments = documents.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleDownload = (doc: any) => {
    toast.success(`Downloading ${doc.name}`);
  };

  const handleView = (doc: any) => {
    toast.info(`Viewing ${doc.name}`);
  };

  const handleDelete = (doc: any) => {
    removeDocument(doc.id);
    toast.success(`Document ${doc.name} deleted`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Documents Library</h1>
          <p className="text-muted-foreground mt-1">
            System-wide document repository - all uploaded files appear here
          </p>
        </div>
        <Button onClick={() => setShowUploadModal(true)} className="bg-primary hover:bg-primary/90">
          <Upload className="h-4 w-4 mr-2" />
          New Upload
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold uppercase text-muted-foreground tracking-wider flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <button
              onClick={() => setActiveFilter("Category")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeFilter === "Category"
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <Folder className="h-5 w-5" />
              <span className="text-sm font-medium">Category</span>
            </button>
            <button
              onClick={() => setActiveFilter("Uploaded By")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeFilter === "Uploaded By"
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <User className="h-5 w-5" />
              <span className="text-sm font-medium">Uploaded By</span>
            </button>
            <button
              onClick={() => setActiveFilter("Date Range")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                activeFilter === "Date Range"
                  ? "bg-primary/20 text-primary"
                  : "hover:bg-muted"
              }`}
            >
              <Calendar className="h-5 w-5" />
              <span className="text-sm font-medium">Date Range</span>
            </button>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Drag and Drop Zone */}
          <div
            onClick={handleUpload}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-border rounded-xl p-8 text-center bg-card hover:border-primary transition-colors cursor-pointer group"
          >
            <div className="flex flex-col items-center gap-4">
              <CloudUpload className="h-12 w-12 text-muted-foreground group-hover:text-primary transition-colors" />
              <div>
                <p className="text-lg font-medium">
                  Drag & drop files here or{" "}
                  <span className="text-primary font-bold">browse to upload</span>
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  All file types supported - documents will be visible system-wide
                </p>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">Document Name</TableHead>
                      <TableHead className="font-semibold">Category</TableHead>
                      <TableHead className="font-semibold">Uploaded By</TableHead>
                      <TableHead className="font-semibold">Uploaded At</TableHead>
                      <TableHead className="font-semibold">Associated Entity</TableHead>
                      <TableHead className="text-right font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDocuments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-12">
                          <div className="flex flex-col items-center gap-3">
                            <FileText className="h-12 w-12 text-muted-foreground" />
                            <div>
                              <p className="text-lg font-medium text-muted-foreground">No documents available</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Uploaded documents across the system will appear here
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDocuments.map((doc) => (
                        <TableRow key={doc.id} className="hover:bg-muted/50">
                          <TableCell className="font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            {doc.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className={getCategoryColor(doc.category)}>
                              {doc.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {doc.uploadedBy}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {doc.uploadedAt.toLocaleDateString()} {doc.uploadedAt.toLocaleTimeString()}
                          </TableCell>
                          <TableCell>
                            <span className="text-muted-foreground">
                              {doc.associatedEntity}
                            </span>
                            {doc.sourceModule && (
                              <div className="text-xs text-muted-foreground mt-1">
                                from {doc.sourceModule}
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                <DropdownMenuItem onClick={() => handleView(doc)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDownload(doc)}>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDelete(doc)}
                                  className="text-destructive"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {[1, 2, 3].map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="icon"
                onClick={() => setCurrentPage(page)}
                className={currentPage === page ? "bg-primary" : ""}
              >
                {page}
              </Button>
            ))}
            <span className="px-2 text-muted-foreground">...</span>
            <Button variant="ghost" size="icon" onClick={() => setCurrentPage(12)}>
              12
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* New Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowUploadModal(false)} />
          
          {/* Modal Panel */}
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Upload Document
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  Add a new file to the ABSA Documents Library.
                </p>
              </div>
              <button 
                className="group p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                onClick={() => setShowUploadModal(false)}
              >
                <X className="h-5 w-5 text-slate-500 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto px-8 py-6">
              {/* Upload Zone */}
              <div className="mb-8">
                <div className="relative group cursor-pointer">
                  <input className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" type="file" />
                  <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 group-hover:border-red-400 rounded-xl bg-slate-50 dark:bg-slate-800 group-hover:bg-red-50 dark:group-hover:bg-red-950/20 p-8 flex flex-col items-center justify-center text-center transition-all duration-200">
                    <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                      <CloudUpload className="h-6 w-6 text-red-500" />
                    </div>
                    <p className="text-slate-900 dark:text-white font-medium text-base mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      PDF, DOCX, JPG or PNG (max. 10MB)
                    </p>
                  </div>
                </div>
              </div>

              <form className="flex flex-col gap-6">
                {/* Document Title */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-900 dark:text-white text-sm font-medium">
                    Document Title *
                  </label>
                  <input 
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 h-12 px-4 placeholder:text-slate-500 transition-colors"
                    placeholder="e.g. Tenancy Agreement - Kwame Nkrumah"
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-white text-sm font-medium">
                      Category *
                    </label>
                    <Select value={uploadForm.category} onValueChange={(value) => setUploadForm(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Legal">Legal</SelectItem>
                        <SelectItem value="Financial">Financial</SelectItem>
                        <SelectItem value="Technical">Technical</SelectItem>
                        <SelectItem value="Administrative">Administrative</SelectItem>
                        <SelectItem value="Operations">Operations</SelectItem>
                        <SelectItem value="HR">HR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* File Upload */}
                  <div className="flex flex-col gap-2">
                    <label className="text-slate-900 dark:text-white text-sm font-medium">
                      File *
                    </label>
                    <input
                      type="file"
                      className="w-full h-12 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-slate-50 file:text-slate-700 hover:file:bg-slate-100"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </div>
                </div>

                {/* Associated Entity */}
                <div className="flex flex-col gap-2">
                  <label className="text-slate-900 dark:text-white text-sm font-medium">
                    Associated Entity
                  </label>
                  <input 
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-slate-500 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 h-12 px-4 placeholder:text-slate-500 transition-colors"
                    placeholder="e.g. Property, Asset, Request ID..."
                    type="text"
                    value={uploadForm.associatedEntity}
                    onChange={(e) => setUploadForm(prev => ({ ...prev, associatedEntity: e.target.value }))}
                  />
                </div>

                {uploadForm.file && (
                  <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Selected File:</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">{uploadForm.file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 px-8 py-5 bg-slate-50/50 dark:bg-slate-800/50 rounded-b-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-slate-500 dark:text-slate-400 hidden sm:flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                Files are securely stored
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  className="w-full sm:w-auto px-6 h-11 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 focus:ring-2 focus:ring-slate-200 dark:focus:ring-slate-700 transition-all"
                  onClick={() => setShowUploadModal(false)}
                >
                  Cancel
                </button>
                <button 
                  className="w-full sm:w-auto px-6 h-11 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 focus:ring-4 focus:ring-red-300 dark:focus:ring-red-900 transition-all shadow-lg flex items-center justify-center gap-2"
                  onClick={handleUploadDocument}
                >
                  <UploadCloud className="h-5 w-5" />
                  Upload Document
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
