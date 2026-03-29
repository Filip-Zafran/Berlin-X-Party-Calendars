import React from 'react';

export default function StatusMessage({ type = 'info', text }) {
  if (!text) return null;

  const styles = {
    info: 'border-white/10 bg-white/5 text-white/85',
    success: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
    error: 'border-rose-400/30 bg-rose-500/10 text-rose-200',
  };

  return <div className={`rounded-2xl border px-4 py-3 text-sm ${styles[type]}`}>{text}</div>;
}
