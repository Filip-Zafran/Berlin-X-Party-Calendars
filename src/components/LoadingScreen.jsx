import React from 'react';

export default function LoadingScreen({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 text-white">
      <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-5 text-center shadow-2xl backdrop-blur">
        <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        <p className="text-sm text-white/80">{label}</p>
      </div>
    </div>
  );
}
