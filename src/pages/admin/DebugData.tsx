import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockAssets } from "@/data/mockAssets";
import { mockVendors } from "@/data/mockVendors";
import { mockBranches } from "@/data/mockBranches";
import { mockVehicles } from "@/data/mockVehicles";
import { useAssets } from "@/contexts/AssetContext";

const DebugData = () => {
  const { assets } = useAssets();
  const [cleared, setCleared] = useState(false);

  const clearAllLocalStorage = () => {
    localStorage.clear();
    setCleared(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Debug: Mock Data Status</h1>
        <p className="text-muted-foreground">Check if mock data is loading correctly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Mock Data Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>mockAssets.ts:</span>
                <span className="font-bold">{mockAssets.length} items</span>
              </div>
              <div className="flex justify-between">
                <span>mockVendors.ts:</span>
                <span className="font-bold">{mockVendors.length} items</span>
              </div>
              <div className="flex justify-between">
                <span>mockBranches.ts:</span>
                <span className="font-bold">{mockBranches.length} items</span>
              </div>
              <div className="flex justify-between">
                <span>mockVehicles.ts:</span>
                <span className="font-bold">{mockVehicles.length} items</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assets from Context</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Assets loaded in context:</span>
                <span className="font-bold">{assets.length} items</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {assets.length === 0 && "⚠️ No assets loaded! Check console logs."}
                {assets.length > 0 && "✅ Assets loaded successfully"}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>localStorage Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.keys(localStorage).map(key => (
                <div key={key} className="text-sm">
                  <span className="font-mono">{key}</span>: {localStorage.getItem(key)?.substring(0, 50)}...
                </div>
              ))}
              {Object.keys(localStorage).length === 0 && (
                <div className="text-sm text-muted-foreground">No localStorage data</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              variant="destructive" 
              onClick={clearAllLocalStorage}
              disabled={cleared}
            >
              {cleared ? "Clearing & Reloading..." : "Clear All localStorage & Reload"}
            </Button>
            <p className="text-sm text-muted-foreground">
              This will clear all stored data and force reload mock data
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>First 3 Mock Assets</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(mockAssets.slice(0, 3), null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>First 3 Assets from Context</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs overflow-auto">
            {JSON.stringify(assets.slice(0, 3), null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
};

export default DebugData;
