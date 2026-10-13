import React from 'react';
import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-full bg-red-50 text-[#C8102E] flex items-center justify-center mb-4">
        <FileQuestion className="w-7 h-7" />
      </div>
      <h1 className="text-2xl font-bold text-[#14161C]">404 &mdash; Page Not Found</h1>
      <p className="mt-2 text-sm text-gray-500 max-w-md">
        The requested page does not exist or has not yet been built in this phase of ABC Car Showroom.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#14161C] hover:bg-black rounded-lg transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Return to Foundation
        </Link>
        <Link
          to="/status"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors"
        >
          System Diagnostics
        </Link>
      </div>
    </div>
  );
};
