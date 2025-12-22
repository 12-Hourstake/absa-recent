import React from 'react';

interface ResponsiveTableProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ResponsiveTable wrapper component
 * Provides horizontal scrolling on mobile devices for tables
 * Automatically handles overflow with smooth scrolling
 */
export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`w-full overflow-x-auto -mx-4 sm:mx-0 ${className}`}>
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveTable;
