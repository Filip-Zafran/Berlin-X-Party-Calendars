import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { CATEGORY_META, formatEventDate } from '../utils/eventUtils';

export default function EventTable({ events, onEdit, onDelete }) {
  if (!events.length) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 text-sm text-white/65">
        No events found for the current filters.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-xl backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm text-white/80">
          <thead className="bg-black/20 text-xs uppercase tracking-wide text-white/45">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id} className="border-t border-white/6">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{event.title}</div>
                  <div className="mt-1 text-xs text-white/45">{event.start_time || 'TBA'} {event.end_time ? `– ${event.end_time}` : ''}</div>
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs ring-1 ${CATEGORY_META[event.category].badge}`}>
                    {CATEGORY_META[event.category].label}
                  </span>
                </td>
                <td className="px-4 py-3 text-white/70">{formatEventDate(event.event_date)}</td>
                <td className="px-4 py-3 text-white/70">{event.location || 'Berlin'}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(event)}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs hover:border-white/25 hover:bg-white/8"
                    >
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(event)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 px-3 py-2 text-xs text-rose-200 hover:bg-rose-500/10"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
