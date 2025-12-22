import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Eye, Edit, Trash2, Ban } from "lucide-react";
import ResponsiveTable from "@/components/ui/ResponsiveTable";
import { mockBranches } from "@/data/mockBranches";
import { FuelTabs } from "@/components/ui/FuelTabs";
import { FuelType, loadFuelContext, saveFuelContext } from "@/utils/fuelContext";

interface FuelCard {
  id: string;
  cardNumber: string;
  assignedBranch: string;
  generatorName: string;
  generatorId: string;
  status: "in-safe" | "in-use" | "suspended";
  lastUsedDate: string;
  dualControl: boolean;
  notes: string;
  createdAt: string;
}

const FuelCards = () => {
  // Fuel context state
  const [selectedFuelType, setSelectedFuelType] = useState<FuelType>(() => 
    loadFuelContext("cards")
  );
  
  const [fuelCards, setFuelCards] = useState<FuelCard[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState<FuelCard | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<Partial<FuelCard>>({
    cardNumber: "",
    assignedBranch: "",
    generatorName: "",
    generatorId: "",
    status: "in-safe",
    lastUsedDate: "",
    dualControl: true,
    notes: ""
  });

  useEffect(() => {
    loadFuelCards();
  }, [selectedFuelType]);

  // Handle fuel type change
  const handleFuelTypeChange = (fuelType: FuelType) => {
    setSelectedFuelType(fuelType);
    saveFuelContext("cards", fuelType);
  };

  const loadFuelCards = () => {
    const cached = localStorage.getItem("FUEL_CARDS_CACHE_V1");
    if (cached) {
      setFuelCards(JSON.parse(cached));
    } else {
      // Initialize with sample data
      const sampleCards: FuelCard[] = [
        {
          id: "FC001",
          cardNumber: "5432-1098-7654-3210",
          assignedBranch: "Accra Main Branch",
          generatorName: "Generator A1",
          generatorId: "GEN-ACC-001",
          status: "in-use",
          lastUsedDate: "2024-01-15",
          dualControl: true,
          notes: "Primary backup generator",
          createdAt: "2024-01-01"
        },
        {
          id: "FC002",
          cardNumber: "5432-1098-7654-3211",
          assignedBranch: "Kumasi Branch",
          generatorName: "Generator K1",
          generatorId: "GEN-KUM-001",
          status: "in-safe",
          lastUsedDate: "2024-01-10",
          dualControl: true,
          notes: "Emergency generator",
          createdAt: "2024-01-01"
        }
      ];
      setFuelCards(sampleCards);
      localStorage.setItem("FUEL_CARDS_CACHE_V1", JSON.stringify(sampleCards));
    }
  };

  const updateCardStatus = (cardId: string, newStatus: FuelCard["status"]) => {
    const updatedCards = fuelCards.map(card =>
      card.id === cardId ? { ...card, status: newStatus } : card
    );
    setFuelCards(updatedCards);
    localStorage.setItem("FUEL_CARDS_CACHE_V1", JSON.stringify(updatedCards));
  };

  const handleAddCard = () => {
    if (!formData.cardNumber || !formData.assignedBranch || !formData.generatorName) {
      setError("Please fill all required fields");
      return;
    }
    const newCard: FuelCard = {
      id: `FC${String(fuelCards.length + 1).padStart(3, '0')}`,
      cardNumber: formData.cardNumber,
      assignedBranch: formData.assignedBranch,
      generatorName: formData.generatorName!,
      generatorId: formData.generatorId!,
      status: formData.status as FuelCard["status"] || "in-safe",
      lastUsedDate: formData.lastUsedDate || new Date().toISOString().split('T')[0],
      dualControl: formData.dualControl !== undefined ? formData.dualControl : true,
      notes: formData.notes || "",
      createdAt: new Date().toISOString().split('T')[0]
    };
    const updated = [...fuelCards, newCard];
    setFuelCards(updated);
    localStorage.setItem("FUEL_CARDS_CACHE_V1", JSON.stringify(updated));
    setSuccess("Fuel card added successfully");
    setShowAddModal(false);
    resetForm();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleEditCard = () => {
    if (!selectedCard || !formData.cardNumber || !formData.assignedBranch || !formData.generatorName) {
      setError("Please fill all required fields");
      return;
    }
    const updated = fuelCards.map(c => c.id === selectedCard.id ? { ...c, ...formData } as FuelCard : c);
    setFuelCards(updated);
    localStorage.setItem("FUEL_CARDS_CACHE_V1", JSON.stringify(updated));
    setSuccess("Fuel card updated successfully");
    setShowEditModal(false);
    setSelectedCard(null);
    resetForm();
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleDeleteCard = () => {
    if (!selectedCard) return;
    const updated = fuelCards.filter(c => c.id !== selectedCard.id);
    setFuelCards(updated);
    localStorage.setItem("FUEL_CARDS_CACHE_V1", JSON.stringify(updated));
    setSuccess("Fuel card deleted successfully");
    setShowDeleteModal(false);
    setSelectedCard(null);
    setTimeout(() => setSuccess(""), 3000);
  };

  const resetForm = () => {
    setFormData({
      cardNumber: "",
      assignedBranch: "",
      generatorName: "",
      generatorId: "",
      status: "in-safe",
      lastUsedDate: "",
      dualControl: true,
      notes: ""
    });
    setError("");
  };

  const getStatusBadge = (status: FuelCard["status"]) => {
    switch (status) {
      case "in-use":
        return <Badge className="bg-green-100 text-green-800">In Use</Badge>;
      case "in-safe":
        return <Badge className="bg-blue-100 text-blue-800">In Safe</Badge>;
      case "suspended":
        return <Badge className="bg-red-100 text-red-800">Suspended</Badge>;
    }
  };

  const filteredCards = fuelCards.filter(card => {
    const matchesSearch = card.cardNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.assignedBranch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         card.generatorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || card.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: fuelCards.length,
    inUse: fuelCards.filter(c => c.status === "in-use").length,
    inSafe: fuelCards.filter(c => c.status === "in-safe").length,
    suspended: fuelCards.filter(c => c.status === "suspended").length
  };

  return (
    <div className="space-y-6 p-6">
      {success && (
        <Alert className="border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">✅ {success}</AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>❌ {error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Cards</h1>
          <p className="text-muted-foreground mt-1">
            Manage {selectedFuelType === "GENERATOR" ? "site-specific generator" : "vehicle-assigned"} fuel cards under dual control
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="gap-2 bg-red-600 hover:bg-red-700">
          <Plus className="h-4 w-4" />
          Add Fuel Card
        </Button>
      </div>

      {/* Fuel Type Tabs */}
      <FuelTabs selectedType={selectedFuelType} onTypeChange={handleFuelTypeChange} />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Total Cards</p>
          <p className="text-2xl font-bold mt-2">{stats.total}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">In Use</p>
          <p className="text-2xl font-bold mt-2 text-green-600">{stats.inUse}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">In Safe</p>
          <p className="text-2xl font-bold mt-2 text-blue-600">{stats.inSafe}</p>
        </Card>
        <Card className="p-6">
          <p className="text-sm font-medium text-muted-foreground">Suspended</p>
          <p className="text-2xl font-bold mt-2 text-red-600">{stats.suspended}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Search Cards</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by card number, branch, or generator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in-use">In Use</SelectItem>
                <SelectItem value="in-safe">In Safe</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="overflow-hidden">
        <ResponsiveTable>
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Card Number</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Branch/Site</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Generator</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Last Used</th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">Dual Control</th>
                <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCards.map((card) => (
                <tr key={card.id} className="hover:bg-muted/50">
                  <td className="px-6 py-4 font-mono text-sm">{card.cardNumber}</td>
                  <td className="px-6 py-4">{card.assignedBranch}</td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium">{card.generatorName}</div>
                      <div className="text-xs text-muted-foreground">{card.generatorId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(card.status)}</td>
                  <td className="px-6 py-4">{card.lastUsedDate}</td>
                  <td className="px-6 py-4">
                    <Badge variant={card.dualControl ? "default" : "secondary"}>
                      {card.dualControl ? "Yes" : "No"}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedCard(card); setShowViewModal(true); }} title="View">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedCard(card); setFormData(card); setShowEditModal(true); }} title="Edit">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedCard(card); setShowDeleteModal(true); }} title="Delete" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ResponsiveTable>
      </Card>

      {/* Add Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Fuel Card</DialogTitle>
            <DialogDescription>Register a new generator fuel card</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input id="cardNumber" value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})} placeholder="XXXX-XXXX-XXXX-XXXX" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="assignedBranch">Assigned Branch *</Label>
              <Select value={formData.assignedBranch} onValueChange={(value) => setFormData({...formData, assignedBranch: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {mockBranches.map(branch => (
                    <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="generatorName">Generator Name *</Label>
              <Input id="generatorName" value={formData.generatorName} onChange={(e) => setFormData({...formData, generatorName: e.target.value})} placeholder="Generator A1" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="generatorId">Generator ID *</Label>
              <Input id="generatorId" value={formData.generatorId} onChange={(e) => setFormData({...formData, generatorId: e.target.value})} placeholder="GEN-XXX-001" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as FuelCard["status"]})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-safe">In Safe</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="Additional notes" />
            </div>
          </div>
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowAddModal(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleAddCard}>Add Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Fuel Card Details</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label className="text-muted-foreground">Card Number</Label><p className="font-mono mt-1">{selectedCard.cardNumber}</p></div>
                <div><Label className="text-muted-foreground">Status</Label><div className="mt-1">{getStatusBadge(selectedCard.status)}</div></div>
                <div><Label className="text-muted-foreground">Assigned Branch</Label><p className="mt-1">{selectedCard.assignedBranch}</p></div>
                <div><Label className="text-muted-foreground">Generator Name</Label><p className="mt-1">{selectedCard.generatorName}</p></div>
                <div><Label className="text-muted-foreground">Generator ID</Label><p className="font-mono mt-1">{selectedCard.generatorId}</p></div>
                <div><Label className="text-muted-foreground">Last Used</Label><p className="mt-1">{selectedCard.lastUsedDate}</p></div>
                <div><Label className="text-muted-foreground">Dual Control</Label><p className="mt-1">{selectedCard.dualControl ? "Yes" : "No"}</p></div>
                <div><Label className="text-muted-foreground">Created</Label><p className="mt-1">{selectedCard.createdAt}</p></div>
              </div>
              {selectedCard.notes && (
                <div><Label className="text-muted-foreground">Notes</Label><p className="mt-1">{selectedCard.notes}</p></div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Fuel Card</DialogTitle>
            <DialogDescription>Update fuel card information</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-cardNumber">Card Number *</Label>
              <Input id="edit-cardNumber" value={formData.cardNumber} onChange={(e) => setFormData({...formData, cardNumber: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-assignedBranch">Assigned Branch *</Label>
              <Select value={formData.assignedBranch} onValueChange={(value) => setFormData({...formData, assignedBranch: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {mockBranches.map(branch => (
                    <SelectItem key={branch.id} value={branch.name}>{branch.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-generatorName">Generator Name *</Label>
              <Input id="edit-generatorName" value={formData.generatorName} onChange={(e) => setFormData({...formData, generatorName: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-generatorId">Generator ID *</Label>
              <Input id="edit-generatorId" value={formData.generatorId} onChange={(e) => setFormData({...formData, generatorId: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value as FuelCard["status"]})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-safe">In Safe</SelectItem>
                  <SelectItem value="in-use">In Use</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Input id="edit-notes" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
            </div>
          </div>
          {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowEditModal(false); setSelectedCard(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleEditCard}>Update Card</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Fuel Card</DialogTitle>
            <DialogDescription>Are you sure you want to delete this fuel card? This action cannot be undone.</DialogDescription>
          </DialogHeader>
          {selectedCard && (
            <div className="py-4">
              <p className="font-medium">Card: {selectedCard.cardNumber}</p>
              <p className="text-sm text-muted-foreground">Branch: {selectedCard.assignedBranch}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDeleteModal(false); setSelectedCard(null); }}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteCard}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FuelCards;