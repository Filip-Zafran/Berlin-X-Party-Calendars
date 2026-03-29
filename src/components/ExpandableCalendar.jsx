import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import {
  CATEGORY_META,
  formatMonthLabel,
  getMonthGrid,
  groupEventsByDay,
  isSameMonthDate,
} from '../utils/eventUtils';

const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function ExpandableCalendar({
  category,
  events,
  month,
  active,
  onActivate,
  onMonthChange,
  onEventClick,
}) {
  const meta = CATEGORY_META[category];
  const monthGrid = useMemo(() => getMonthGrid(month), [month]);
  const grouped = useMemo(() => groupEventsByDay(events), [events]);
  const monthEvents = useMemo(
    () => events.filter((event) => event.event_date.startsWith(format(month, 'yyyy-MM'))),
    [events, month]
  );

  return (
    <motion.section
      layout
      onClick={() => {
        if (!active) onActivate(category);
      }}
      className={`relative overflow-hidden rounded-[2rem] border p-4 shadow-2xl backdrop-blur-sm ${
        active ? meta.activePanel : meta.inactivePanel
      } ${active ? 'cursor-default' : 'cursor-pointer'} min-h-[420px]`}
      transition={{ type: 'spring', stiffness: 240, damping: 28 }}
      style={{ flex: active ? 2.8 : 1 }}
    >
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${meta.accent}`} />
      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${meta.badge}`}>
              {meta.label}
            </span>
            <h2 className="mt-3 text-xl font-semibold text-white md:text-2xl">{meta.label}</h2>
            <p className="mt-2 text-sm text-white/60">
              {active
                ? 'Browse dates, open event details, and switch months.'
                : 'Compact month preview. Tap to expand.'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMonthChange(-1);
              }}
              className="rounded-full border border-white/10 bg-black/15 p-2 text-white/80 hover:border-white/25 hover:text-white"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onMonthChange(1);
              }}
              className="rounded-full border border-white/10 bg-black/15 p-2 text-white/80 hover:border-white/25 hover:text-white"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4 text-sm">
          <span className="font-medium text-white/85">{formatMonthLabel(month)}</span>
          <span className="text-white/55">{monthEvents.length} events this month</span>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs text-white/45">
          {weekdays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>

        <div className="mt-2 grid flex-1 grid-cols-7 gap-2">
          {monthGrid.map((day) => {
            const key = format(day, 'yyyy-MM-dd');
            const dayEvents = grouped[key] || [];
            const isCurrentMonth = isSameMonthDate(day, month);

            return (
              <button
                key={key}
                type="button"
                disabled={!dayEvents.length}
                onClick={(e) => {
                  e.stopPropagation();
                  if (dayEvents.length) onEventClick(dayEvents[0]);
                }}
                className={`min-h-[72px] rounded-2xl border p-2 text-left transition ${
                  isCurrentMonth ? 'border-white/8 bg-white/4' : 'border-white/4 bg-white/[0.02] text-white/30'
                } ${dayEvents.length ? 'hover:border-white/20 hover:bg-white/8' : 'cursor-default'}`}
              >
                <div className="flex items-start justify-between gap-1">
                  <span className={`text-xs font-medium ${isCurrentMonth ? 'text-white/85' : 'text-white/30'}`}>
                    {format(day, 'd')}
                  </span>
                  {dayEvents.length ? (
                    <span className={`mt-0.5 h-2.5 w-2.5 rounded-full ${meta.dot}`} aria-hidden="true" />
                  ) : null}
                </div>

                {active && dayEvents.length ? (
                  <div className="mt-2 space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div key={event.id} className="rounded-xl bg-black/20 px-2 py-1 text-[10px] text-white/85">
                        <div className="truncate font-medium">{event.title}</div>
                        <div className="mt-0.5 flex items-center gap-1 text-white/55">
                          <MapPin size={10} />
                          <span className="truncate">{event.location || 'Berlin'}</span>
                        </div>
                      </div>
                    ))}
                    {dayEvents.length > 2 ? <div className="text-[10px] text-white/50">+{dayEvents.length - 2} more</div> : null}
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>

        {active ? (
          <div className="mt-4 rounded-2xl border border-white/10 bg-black/15 p-4 text-sm text-white/70">
            {monthEvents.length ? (
              <div className="space-y-2">
                {monthEvents.slice(0, 4).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/8 bg-white/5 px-3 py-2 text-left hover:border-white/15 hover:bg-white/8"
                  >
                    <div>
                      <div className="font-medium text-white">{event.title}</div>
                      <div className="text-xs text-white/55">
                        {format(new Date(event.event_date), 'd MMM')} · {event.start_time || 'TBA'}
                      </div>
                    </div>
                    <span className="text-xs text-white/45">Open</span>
                  </button>
                ))}
              </div>
            ) : (
              <p>No events this month.</p>
            )}
          </div>
        ) : null}
      </div>
    </motion.section>
  );
}
