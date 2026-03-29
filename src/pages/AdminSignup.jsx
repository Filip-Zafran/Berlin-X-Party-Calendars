import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    orga: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (error) {
      setMsg(error.message);
      setLoading(false);
      return;
    }

    // OPTIONAL: store extra info
    if (data.user) {
      await supabase.from('organizer_accounts').insert({
        user_id: data.user.id,
        name: form.name,
        orga_name: form.orga,
      });
    }

    setMsg('Account created. You can now log in.');
    setLoading(false);
    navigate('/admin');
  }

  return (
    <div className="min-h-screen flex items-center justify-center text-white px-4">
      <div className="w-full max-w-md bg-white/5 p-6 rounded-2xl border border-white/10">
        <h1 className="text-2xl mb-4">Sign up</h1>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="p-3 bg-black/20 rounded"
          />
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="p-3 bg-black/20 rounded"
          />
          <input
            placeholder="Event / Orga name"
            value={form.orga}
            onChange={(e) => update('orga', e.target.value)}
            className="p-3 bg-black/20 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => update('password', e.target.value)}
            className="p-3 bg-black/20 rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black py-2 rounded"
          >
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>

        {msg && <p className="mt-3 text-sm">{msg}</p>}

        <Link to="/admin" className="block mt-4 text-sm underline">
          Back to login
        </Link>
      </div>
    </div>
  );
}