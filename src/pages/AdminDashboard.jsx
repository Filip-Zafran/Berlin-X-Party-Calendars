import React, { useMemo, useState } from 'react';
import { LogOut, PlusCircle, RefreshCw } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useEvents } from '../hooks/useEvents';
import EventForm from '../components/EventForm';
import EventTable from '../components/EventTable';
import CalendarPreview from '../components/CalendarPreview';
import StatusMessage from '../components/StatusMessage';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { events, loading, error, refetch } = useEvents();
  const [editingEvent, setEditingEvent] = useState(null);
  const [formMessage, setFormMessage] = useState({ type: 'info', text: '' });
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({ category: 'all', search: '' });

  const visibleEvents = useMemo(() => {
    return events.filter((event) => {
      const categoryMatch = filters.category === 'all' ? true : event.category === filters.category;
      const searchMatch = filters.search
        ? `${event.title} ${event.location}`.toLowerCase().includes(filters.search.toLowerCase())
        : true;
      return categoryMatch && searchMatch;
    });
  }, [events, filters]);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/admin';
  }

  async function handleSubmit(payload) {
    setSubmitting(true);
    setFormMessage({ type: 'info', text: '' });

    const request = editingEvent
      ? supabase.from('events').update(payload).eq('id', editingEvent.id).select().single()
      : supabase.from('events').insert(payload).select().single();

    const { error: saveError } = await request;

    if (saveError) {
      setFormMessage({ type: 'error', text: saveError.message });
      setSubmitting(false);
      return;
    }

    setFormMessage({ type: 'success', text: editingEvent ? 'Event updated.' : 'Event created.' });
    setEditingEvent(null);
    setSubmitting(false);
    refetch();
  }

  async function handleDelete(eventToDelete) {
    const confirmed = window.confirm(`Delete "${eventToDelete.title}"?`);
    if (!confirmed) return;

    const { error: deleteError } = await supabase.from('events').delete().eq('id', eventToDelete.id);

    if (deleteError) {
      setFormMessage({ type: 'error', text: deleteError.message });
      return;
    }

    setFormMessage({ type: 'success', text: 'Event deleted.' });
    if (editingEvent?.id === eventToDelete.id) setEditingEvent(null);
    refetch();
  }

  return (
    <div className="min-h-screen px-4 py-5 text-white md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        <header className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
                Admin dashboard
              </span>
              <h1 className="mt-4 text-3xl font-semibold md:text-4xl">Manage Berlin events</h1>
              <p className="mt-3 text-sm text-white/65">Signed in as {user?.email || 'Organizer'}.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setFormMessage({ type: 'info', text: '' });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm hover:border-white/20 hover:bg-white/8"
              >
                <PlusCircle size={16} /> New event
              </button>
              <button
                type="button"
                onClick={refetch}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm hover:border-white/20 hover:bg-white/8"
              >
                <RefreshCw size={16} /> Refresh
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 px-4 py-2 text-sm text-rose-200 hover:bg-rose-500/10"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </header>

        <StatusMessage type={error ? 'error' : 'info'} text={error || 'Create, edit, or delete events. Changes update the public calendars after refresh.'} />

        <div className="grid gap-5 xl:grid-cols-[1.1fr_1fr]">
          <EventForm
            initialEvent={editingEvent}
            onSubmit={handleSubmit}
            submitting={submitting}
            message={formMessage}
          />
          <CalendarPreview events={events} />
        </div>

        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Event list</h2>
              <p className="mt-1 text-sm text-white/55">Browse and manage all saved events.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <input
                value={filters.search}
                onChange={(e) => setFilters((current) => ({ ...current, search: e.target.value }))}
                placeholder="Search by title or location"
                className="rounded-full border border-white/10 bg-black/15 px-4 py-2 text-sm outline-none placeholder:text-white/30"
              />
              <select
                value={filters.category}
                onChange={(e) => setFilters((current) => ({ ...current, category: e.target.value }))}
                className="rounded-full border border-white/10 bg-black/15 px-4 py-2 text-sm outline-none"
              >
                <option value="all">All categories</option>
                <option value="non_monogamous">Non-monogamous</option>
                <option value="sex_positive">Sex-positive</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-white/10 bg-black/15 px-4 py-8 text-center text-sm text-white/55">
              Loading events...
            </div>
          ) : (
            <EventTable events={visibleEvents} onEdit={setEditingEvent} onDelete={handleDelete} />
          )}
        </section>
      </div>
    </div>
  );
}
