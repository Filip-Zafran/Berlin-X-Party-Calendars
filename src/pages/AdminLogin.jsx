import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, Link } from 'react-router-dom';
import { LockKeyhole, Mail } from 'lucide-react';
import StatusMessage from '../components/StatusMessage';
import { useAuth } from '../contexts/AuthContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export default function AdminLogin() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: 'info', text: '' });

  useEffect(() => {
    if (!loading && user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [loading, navigate, user]);

  if (!isSupabaseConfigured) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-white">
        <div className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
          <div className="mb-4 flex gap-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-full text-sm ${
                location.pathname === '/'
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Home
            </Link>

            <Link
              to="/admin"
              className={`px-4 py-2 rounded-full text-sm ${
                location.pathname.startsWith('/admin')
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              Admin
            </Link>
          </div>

          <h1 className="text-2xl font-semibold">Set up Supabase first</h1>
          <p className="mt-3 text-sm leading-7 text-white/70">
            Add your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, restart the dev server, and try again.
          </p>
        </div>
      </div>
    );
  }

  if (user) {
    return <Navigate to="/admin/dashboard" replace state={location.state} />;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage({ type: 'info', text: '' });

    if (!email || !password) {
      setMessage({ type: 'error', text: 'Please enter both email and password.' });
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setMessage({ type: 'error', text: error.message });
      setSubmitting(false);
      return;
    }

    setMessage({ type: 'success', text: 'Login successful. Redirecting...' });
    setSubmitting(false);
    navigate('/admin/dashboard', { replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
        <div className="mb-4 flex gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-full text-sm ${
              location.pathname === '/'
                ? 'bg-white text-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Home
          </Link>

          <Link
            to="/admin"
            className={`px-4 py-2 rounded-full text-sm ${
              location.pathname.startsWith('/admin')
                ? 'bg-white text-black'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            Admin
          </Link>
        </div>

        <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
          Organizer access
        </span>
        <h1 className="mt-4 text-3xl font-semibold">Admin login</h1>
        <p className="mt-3 text-sm text-white/65">Sign in with your organizer account to manage events.</p>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm text-white/75">
            <span>Email</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
              <Mail size={16} className="text-white/45" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-white/30"
                placeholder="organizer@example.com"
              />
            </div>
          </label>

          <label className="grid gap-2 text-sm text-white/75">
            <span>Password</span>
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3">
              <LockKeyhole size={16} className="text-white/45" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none placeholder:text-white/30"
                placeholder="••••••••"
              />
            </div>
          </label>

          <StatusMessage type={message.type} text={message.text} />

          <button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}