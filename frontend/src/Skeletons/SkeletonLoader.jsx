// SkeletonLoader.js
import React from 'react';

const SkeletonLoader = ({ type }) => {
  const baseClasses = 'bg-gray-300 animate-pulse';

  const renderSkeleton = () => {
    switch (type) {
      case 'card':
        return (
          <div className="border bg-white p-4 rounded-lg shadow-md mb-4">
            <div className={`h-32 ${baseClasses} rounded-lg mb-4`} />
            <div className={`${baseClasses} h-6 w-3/4 rounded mb-2`} />
            <div className={`${baseClasses} h-4 w-1/2 rounded`} />
          </div>
        );
      case 'avatar':
        return (
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${baseClasses}`} />
            <div>
              <div className={`${baseClasses} h-4 w-32 rounded mb-2`} />
              <div className={`${baseClasses} h-3 w-24 rounded`} />
            </div>
          </div>
        );
      default:
        return (
          <div className={`${baseClasses} h-6 w-3/4 rounded`} />
        );
    }
  };

  return renderSkeleton();
};

export default SkeletonLoader;
