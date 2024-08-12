import React from 'react';
export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="w-16 h-16 border-4 border-purple-500 border-dashed rounded-full animate-spin"></div>
        </div>
    );
}
