import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const PermissionFallbackNotice: React.FC = () => {
  const { session } = useAuth();
  
  // Only show if permissions are missing or corrupted
  if (!session || (session.permissions && typeof session.permissions === 'object')) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-600" />
        <div>
          <h4 className="text-sm font-medium text-yellow-800">Limited Access Mode</h4>
          <p className="text-sm text-yellow-700 mt-1">
            Your access is limited. Please contact your administrator to restore full permissions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PermissionFallbackNotice;