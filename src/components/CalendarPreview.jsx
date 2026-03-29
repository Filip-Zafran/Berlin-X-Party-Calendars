import React from 'react';
import { CATEGORY_META } from '../utils/eventUtils';

export default function CalendarPreview({ events }) {
  const grouped = ['non_monogamous', 'sex_positive'].map((category) => ({
    category,
    items: events.filter((event) => event.category === category).slice(0, 4),
  }));

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm">
      <h2 className="text-xl font-semibold text-white">Calendar preview</h2>
      <p className="mt-1 text-sm text-white/55">Quick admin preview of what appears on the public side.</p>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {grouped.map(({ category, items }) => (
          <div key={category} className="rounded-3xl border border-white/8 bg-black/15 p-4">
            <span className={`inline-flex rounded-full px-3 py-1 text-xs ring-1 ${CATEGORY_META[category].badge}`}>
              {CATEGORY_META[category].label}
            </span>
            <div className="mt-4 space-y-3">
              {items.length ? (
                items.map((event) => (
                  <div key={event.id} className="rounded-2xl border border-white/8 bg-white/5 p-3 text-sm text-white/80">
                    <div className="font-medium text-white">{event.title}</div>
                    <div className="mt-1 text-xs text-white/50">{event.event_date} · {event.location}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 px-3 py-4 text-sm text-white/45">
                  No events yet.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
