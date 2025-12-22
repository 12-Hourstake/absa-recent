import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  fullScreen?: boolean;
}

/**
 * ABSA Facility Management-branded loading spinner component
 * Features pulsing ABSA Facility Management logo with gradient colors
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
}) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const containerClass = fullScreen
    ? 'fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center';

  return (
    <div className={containerClass}>
      <div className="text-center space-y-4">
        {/* Animated ABSA Facility Management Logo */}
        <div className="relative mx-auto" style={{ width: 'fit-content' }}>
          {/* Outer spinning ring */}
          <div className={`${sizeClasses[size]} mx-auto relative`}>
            <div className="absolute inset-0 rounded-full border-4 border-gray-200/30"></div>
            <div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#aa0427] border-r-[#970323] animate-spin"
              style={{ animationDuration: '1s' }}
            ></div>
          </div>

          {/* Inner pulsing logo */}
          <div
            className={`absolute inset-0 flex items-center justify-center ${sizeClasses[size]} mx-auto`}
          >
            <div className="relative animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-br from-[#aa0427] to-[#970323] rounded-xl blur-md opacity-40"></div>
              <div className="relative px-3 py-2 rounded-xl bg-gradient-to-br from-[#aa0427] to-[#970323] shadow-xl">
                <span className="text-white font-black text-lg tracking-tighter">
                ABSA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Loading text */}
        {text && (
          <div className="space-y-2">
            <p className={`${textSizeClasses[size]} font-medium text-gray-700 animate-pulse`}>
              {text}
            </p>
            {/* Animated dots */}
            <div className="flex justify-center gap-1">
              <span
                className="w-2 h-2 rounded-full bg-gradient-to-r from-[#aa0427] to-[#970323] animate-bounce"
                style={{ animationDelay: '0ms', animationDuration: '1s' }}
              ></span>
              <span
                className="w-2 h-2 rounded-full bg-gradient-to-r from-[#aa0427] to-[#970323] animate-bounce"
                style={{ animationDelay: '150ms', animationDuration: '1s' }}
              ></span>
              <span
                className="w-2 h-2 rounded-full bg-gradient-to-r from-[#aa0427] to-[#970323] animate-bounce"
                style={{ animationDelay: '300ms', animationDuration: '1s' }}
              ></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
