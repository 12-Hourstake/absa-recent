import { useEffect } from 'react';
import { usePortalGuard } from '@/hooks/usePortalGuard';

interface NavigationGuardProps {
  children: React.ReactNode;
}

const NavigationGuard: React.FC<NavigationGuardProps> = ({ children }) => {
  const { isValidSession } = usePortalGuard();

  useEffect(() => {
    // Additional validation on component mount
    if (!isValidSession) {
      console.warn('Navigation guard detected invalid session');
    }
  }, [isValidSession]);

  return <>{children}</>;
};

export default NavigationGuard;