
import React from 'react';

const Skeleton: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`animate-pulse bg-gray-200 rounded ${className}`} />
);

export const CardSkeleton = () => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
        <div className="flex justify-between items-start">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-16 rounded-full" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="flex gap-2 pt-2">
            <Skeleton className="h-10 flex-1 rounded-lg" />
            <Skeleton className="h-10 flex-1 rounded-lg" />
        </div>
    </div>
);

export const ListSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
        {[...Array(6)].map((_, i) => (
            <CardSkeleton key={i} />
        ))}
    </div>
);

export const HeaderSkeleton = () => (
    <div className="h-16 bg-white border-b px-4 flex items-center justify-between">
        <Skeleton className="h-8 w-8 rounded-lg" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 w-8 rounded-lg" />
    </div>
);

export const SidebarSkeleton = () => (
    <div className="hidden lg:flex flex-col w-64 h-screen bg-white border-l p-4 space-y-4">
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="space-y-2 flex-1">
            {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
            ))}
        </div>
        <Skeleton className="h-12 w-full rounded-xl" />
    </div>
);

export const TableSkeleton = () => (
    <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-full rounded-t-xl" />
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
            </div>
        ))}
    </div>
);

export default Skeleton;
