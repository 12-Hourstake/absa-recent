import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, AlertTriangle, Flag, X, Edit, ChevronLeft, ChevronRight } from "lucide-react";
import ResponsiveTable from "@/components/ui/ResponsiveTable";
import CustomSelectDropdown from "@/components/ui/CustomSelectDropdown";
import { mockBranches } from "@/data";
import { toast } from "sonner";
import { FuelTabs } from "@/components/ui/FuelTabs";
import { FuelType, loadFuelContext, saveFuelContext } from "@/utils/fuelContext";
import { FuelDataManager, FuelDelivery as FuelDeliveryType } from "@/utils/fuelDataManager";

const FuelDelivery = () => {
  // Fuel context state
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType>(() => 
    loadFuelContext("delivery")
  );
  
  const [deliveries, setDeliveries] = useState<FuelDeliveryType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<FuelDeliveryType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<Partial<FuelDeliveryType>>({});
  const itemsPerPage = 10;

  useEffect(() => {
    loadDeliveries();
  }, [selectedFuelType]);

  // Handle fuel type change
  const handleFuelTypeChange = (fuelType: FuelType) => {
    setSelectedFuelType(fuelType);
    saveFuelContext("delivery", fuelType);
  };

  const loadDeliveries = () => {
    setDeliveries(FuelDataManager.getDeliveries(selectedFuelType));
  };

  const getDiscrepancyBadge = (status: FuelDeliveryType["discrepancyStatus"]) => {
    switch (status) {
      case "matched":
        return <Badge className="bg-green-100 text-green-800">Matched</Badge>;
      case "short-supplied":
        return <Badge className="bg-orange-100 text-orange-800">Short Supplied</Badge>;
      case "over-supplied":
        return <Badge className="bg-blue-100 text-blue-800">Over Supplied</Badge>;
    }
  };

  const getEscalationBadge = (status: FuelDeliveryType["escalationStatus"]) => {
    switch (status) {
      case "none":
        return <Badge variant="secondary">None</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolved</Badge>;
    }
  };

  const handleView = (delivery: FuelDeliveryType) => {
    setSelectedDelivery(delivery);
    setShowViewModal(true);
  };

  const handleEdit = (delivery: FuelDeliveryType) => {
    setSelectedDelivery(delivery);
    setFormData(delivery);
    setShowEditModal(true);
  };

  const handleEscalate = (delivery: FuelDeliveryType) => {
    setSelectedDelivery(delivery);
    setShowEscalateModal(true);
  };

  const handleAddDelivery = () => {
    setFormData({});
    setShowAddModal(true);
  };

  const handleSaveAdd = () => {
    const newDelivery: FuelDeliveryType = {
      id: `FD${String(deliveries.length + 1).padStart(3, '0')}`,
      branchSite: formData.branchSite || "",
      generator: formData.generator || "",
      fuelCardUsed: formData.fuelCardUsed || "",
      omc: formData.omc || "",
      approvedQuantity: formData.approvedQuantity || 0,
      deliveredQuantity: formData.deliveredQuantity || 0,
      tankLevelBefore: formData.tankLevelBefore || 0,
      tankLevelAfter: formData.tankLevelAfter || 0,
      discrepancyStatus: formData.discrepancyStatus || "matched",
      escalationStatus: "none",
      deliveryDate: formData.deliveryDate || new Date().toISOString().split('T')[0],
      notes: formData.notes || "",
      createdAt: new Date().toISOString()
    };
    const updated = [...deliveries, newDelivery];
    setDeliveries(updated);
    FuelDataManager.saveDeliveries(selectedFuelType, updated);
    setShowAddModal(false);
    toast.success("Fuel delivery logged successfully");
  };

  const handleSaveEdit = () => {
    if (!selectedDelivery) return;
    const updated = deliveries.map(d => 
      d.id === selectedDelivery.id ? { ...d, ...formData } : d
    );
    setDeliveries(updated);
    FuelDataManager.saveDeliveries(selectedFuelType, updated);
    setShowEditModal(false);
    toast.success("Delivery updated successfully");
  };

  const handleSaveEscalation = () => {
    if (!selectedDelivery) return;
    const updated = deliveries.map(d =>
      d.id === selectedDelivery.id ? { ...d, escalationStatus: "pending" as const } : d
    );
    setDeliveries(updated);
    FuelDataManager.saveDeliveries(selectedFuelType, updated);
    setShowEscalateModal(false);
    toast.success("Escalation submitted successfully");
  };

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.branchSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.generator.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.omc.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || delivery.discrepancyStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredDeliveries.length / itemsPerPage);
  const paginatedDeliveries = filteredDeliveries.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const stats = {
    total: deliveries.length,
    matched: deliveries.filter(d => d.discrepancyStatus === "matched").length,
    discrepancies: deliveries.filter(d => d.discrepancyStatus !== "matched").length,
    escalations: deliveries.filter(d => d.escalationStatus === "pending").length
  };

  return (
    <div className="flex-1 px-4 py-8 md:px-8 lg:px-12 w-full max-w-[1920px] mx-auto space-y-6">
      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Delivery</h1>
          <p className="text-muted-foreground mt-1">
            Track approved {selectedFuelType.toLowerCase()} fuel purchases, transport, and discharge
          </p>
        </div>
        <Button className="gap-2 bg-red-600 hover:bg-red-700" onClick={handleAddDelivery}>
          <Plus className="h-4 w-4" />
          Log Delivery
        </Button>
      </div>

      {/* Fuel Type Tabs */}
      <FuelTabs selectedType={selectedFuelType} onTypeChange={handleFuelTypeChange} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Deliveries</p>
          <p className="text-2xl font-bold mt-2">{stats.total}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Matched</p>
          <p className="text-2xl font-bold mt-2 text-green-600">{stats.matched}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Discrepancies</p>
          <p className="text-2xl font-bold mt-2 text-orange-600">{stats.discrepancies}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Escalations</p>
          <p className="text-2xl font-bold mt-2 text-red-600">{stats.escalations}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Search Deliveries</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by branch, generator, or OMC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Discrepancy Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border-slate-200 bg-white py-2 px-3 text-sm focus:border-red-500 focus:ring-red-500"
            >
              <option value="all">All Status</option>
              <option value="matched">Matched</option>
              <option value="short-supplied">Short Supplied</option>
              <option value="over-supplied">Over Supplied</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <ResponsiveTable>
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Delivery ID</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Branch/Site</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Generator</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">OMC</th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Approved (L)</th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider">Delivered (L)</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Discrepancy</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Escalation</th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedDeliveries.map((delivery) => (
                <tr key={delivery.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 font-mono text-sm">{delivery.id}</td>
                  <td className="px-6 py-4">{delivery.branchSite}</td>
                  <td className="px-6 py-4">{delivery.generator}</td>
                  <td className="px-6 py-4">{delivery.omc}</td>
                  <td className="px-6 py-4 text-right font-medium">{delivery.approvedQuantity}</td>
                  <td className="px-6 py-4 text-right font-medium">{delivery.deliveredQuantity}</td>
                  <td className="px-6 py-4">{getDiscrepancyBadge(delivery.discrepancyStatus)}</td>
                  <td className="px-6 py-4">{getEscalationBadge(delivery.escalationStatus)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => handleView(delivery)} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(delivery)} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {delivery.escalationStatus === "none" && delivery.discrepancyStatus !== "matched" && (
                        <Button variant="ghost" size="icon" onClick={() => handleEscalate(delivery)} title="Escalate">
                          <AlertTriangle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResponsiveTable>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentPage(page)}
              className={currentPage === page ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {page}
            </Button>
          ))}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowViewModal(false)} />
          <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Delivery Details</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowViewModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Delivery ID</Label>
                  <p className="font-mono font-medium">{selectedDelivery.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Delivery Date</Label>
                  <p className="font-medium">{selectedDelivery.deliveryDate}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Branch/Site</Label>
                  <p className="font-medium">{selectedDelivery.branchSite}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Generator</Label>
                  <p className="font-medium">{selectedDelivery.generator}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Fuel Card Used</Label>
                  <p className="font-mono font-medium">{selectedDelivery.fuelCardUsed}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">OMC</Label>
                  <p className="font-medium">{selectedDelivery.omc}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Approved Quantity</Label>
                  <p className="font-medium">{selectedDelivery.approvedQuantity}L</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Delivered Quantity</Label>
                  <p className="font-medium">{selectedDelivery.deliveredQuantity}L</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Tank Level Before</Label>
                  <p className="font-medium">{selectedDelivery.tankLevelBefore}L</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Tank Level After</Label>
                  <p className="font-medium">{selectedDelivery.tankLevelAfter}L</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Discrepancy Status</Label>
                  <div className="mt-1">{getDiscrepancyBadge(selectedDelivery.discrepancyStatus)}</div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Escalation Status</Label>
                  <div className="mt-1">{getEscalationBadge(selectedDelivery.escalationStatus)}</div>
                </div>
              </div>
              <div>
                <Label className="text-sm text-muted-foreground">Notes</Label>
                <p className="font-medium mt-1">{selectedDelivery.notes || "No notes"}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => { setShowAddModal(false); setShowEditModal(false); }} />
          <Card className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">{showAddModal ? "Log New Delivery" : "Edit Delivery"}</h2>
              <Button variant="ghost" size="sm" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Branch/Site *</Label>
                  <CustomSelectDropdown
                    options={mockBranches.map(b => b.name)}
                    value={formData.branchSite || ""}
                    onChange={(value) => setFormData({ ...formData, branchSite: value })}
                    placeholder="Select branch"
                  />
                </div>
                <div>
                  <Label>Generator *</Label>
                  <Input
                    value={formData.generator || ""}
                    onChange={(e) => setFormData({ ...formData, generator: e.target.value })}
                    placeholder="e.g., Generator A1"
                  />
                </div>
                <div>
                  <Label>Fuel Card Used *</Label>
                  <Input
                    value={formData.fuelCardUsed || ""}
                    onChange={(e) => setFormData({ ...formData, fuelCardUsed: e.target.value })}
                    placeholder="e.g., 5432-****-****-3210"
                  />
                </div>
                <div>
                  <Label>OMC *</Label>
                  <CustomSelectDropdown
                    options={["Shell Ghana", "Total Ghana", "Goil Ghana", "Puma Energy"]}
                    value={formData.omc || ""}
                    onChange={(value) => setFormData({ ...formData, omc: value })}
                    placeholder="Select OMC"
                  />
                </div>
                <div>
                  <Label>Approved Quantity (L) *</Label>
                  <Input
                    type="number"
                    value={formData.approvedQuantity || ""}
                    onChange={(e) => setFormData({ ...formData, approvedQuantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Delivered Quantity (L) *</Label>
                  <Input
                    type="number"
                    value={formData.deliveredQuantity || ""}
                    onChange={(e) => setFormData({ ...formData, deliveredQuantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Tank Level Before (L) *</Label>
                  <Input
                    type="number"
                    value={formData.tankLevelBefore || ""}
                    onChange={(e) => setFormData({ ...formData, tankLevelBefore: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Tank Level After (L) *</Label>
                  <Input
                    type="number"
                    value={formData.tankLevelAfter || ""}
                    onChange={(e) => setFormData({ ...formData, tankLevelAfter: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <Label>Delivery Date *</Label>
                  <Input
                    type="date"
                    value={formData.deliveryDate || ""}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Discrepancy Status</Label>
                  <CustomSelectDropdown
                    options={["matched", "short-supplied", "over-supplied"]}
                    value={formData.discrepancyStatus || "matched"}
                    onChange={(value) => setFormData({ ...formData, discrepancyStatus: value as FuelDeliveryType["discrepancyStatus"] })}
                    placeholder="Select status"
                  />
                </div>
              </div>
              <div>
                <Label>Notes</Label>
                <Input
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any additional notes"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-6 border-t">
              <Button variant="outline" onClick={() => { setShowAddModal(false); setShowEditModal(false); }}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={showAddModal ? handleSaveAdd : handleSaveEdit}>
                {showAddModal ? "Log Delivery" : "Save Changes"}
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Escalate Modal */}
      {showEscalateModal && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowEscalateModal(false)} />
          <Card className="relative w-full max-w-md bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">Escalate Discrepancy</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowEscalateModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-6">
              <p className="text-muted-foreground mb-4">
                Are you sure you want to escalate this delivery discrepancy to management?
              </p>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p><strong>Delivery ID:</strong> {selectedDelivery.id}</p>
                <p><strong>Branch:</strong> {selectedDelivery.branchSite}</p>
                <p><strong>Discrepancy:</strong> {selectedDelivery.discrepancyStatus}</p>
                <p><strong>Variance:</strong> {selectedDelivery.deliveredQuantity - selectedDelivery.approvedQuantity}L</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 p-6 border-t">
              <Button variant="outline" onClick={() => setShowEscalateModal(false)}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleSaveEscalation}>
                Escalate
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FuelDelivery;