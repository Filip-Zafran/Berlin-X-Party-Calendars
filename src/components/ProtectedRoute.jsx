import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';
import { isSupabaseConfigured } from '../lib/supabase';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen px-6 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-white/5 p-6">
          <h1 className="text-2xl font-semibold">Supabase is not configured</h1>
          <p className="mt-3 text-sm text-white/70">
            Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to a .env file to use the admin area.
          </p>
        </div>
      </div>
    );
  }

  if (loading) return <LoadingScreen label="Checking session..." />;
  if (!user) return <Navigate to="/admin" replace state={{ from: location }} />;

  return children;
}
