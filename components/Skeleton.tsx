import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <div className={`animate-pulse-fast bg-slate-200 rounded ${className}`}></div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-3 flex items-center space-x-4">
    <Skeleton className="w-12 h-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);
