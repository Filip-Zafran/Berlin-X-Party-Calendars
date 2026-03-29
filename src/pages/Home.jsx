import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, RefreshCw } from 'lucide-react';
import ExpandableCalendar from '../components/ExpandableCalendar';
import EventFilters from '../components/EventFilters';
import EventModal from '../components/EventModal';
import LoadingScreen from '../components/LoadingScreen';
import StatusMessage from '../components/StatusMessage';
import { useEvents } from '../hooks/useEvents';
import { eventMatchesFilters, shiftMonth, uniqueTags } from '../utils/eventUtils';
import { Link, useLocation } from 'react-router-dom';



export default function Home() {
  const location = useLocation();
  const { categories, events, loading, error, refetch } = useEvents();
  const [activeCategory, setActiveCategory] = useState('non_monogamous');
  const [months, setMonths] = useState({
    non_monogamous: new Date(),
    sex_positive: new Date(),
  });
  const [filters, setFilters] = useState({
    search: '',
    tag: '',
    price: 'all',
  });
  const [selectedEvent, setSelectedEvent] = useState(null);

  const allTags = useMemo(() => uniqueTags(events), [events]);

  const filteredCategories = useMemo(
    () => ({
      non_monogamous: categories.non_monogamous.filter((event) => eventMatchesFilters(event, filters)),
      sex_positive: categories.sex_positive.filter((event) => eventMatchesFilters(event, filters)),
    }),
    [categories, filters]
  );

  if (loading) return <LoadingScreen label="Loading Berlin events..." />;

  return (
    <div className="min-h-screen px-4 py-5 text-white md:px-6 lg:px-8">

  {/* NAV */}
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
      <div className="mx-auto max-w-7xl">
       <motion.header
  initial={{ opacity: 0, y: 16 }}
  animate={{ opacity: 1, y: 0 }}
  className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-sm"
>
  <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
    
    <div>
      <span className="inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs uppercase tracking-[0.2em] text-white/60">
        Berlin Open Love Party Calendars
      </span>

      <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
        Berlin Open Love Party Calendars
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-white/65 md:text-base">
        Explore Berlin’s non-monogamous, polyamorous, kinky and sex-positive events.
      </p>
    </div>

    <div className="flex items-center gap-3">
      <div className="rounded-3xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-white/70">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>Berlin, Germany</span>
        </div>
      </div>

      <Link
        to="/admin"
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 hover:border-white/20 hover:bg-white/8"
      >
        Admin
      </Link>
    </div>

  </div>
</motion.header>

        <div className="mt-5 grid gap-5">
          <EventFilters
            filters={filters}
            tags={allTags}
            onChange={(field, value) => setFilters((current) => ({ ...current, [field]: value }))}
          />

          <div className="flex items-center justify-between gap-4">
            <StatusMessage type={error ? 'error' : 'info'} text={error || 'Choose a calendar to expand it. Click any event day to open details.'} />
            <button
              type="button"
              onClick={refetch}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 hover:border-white/20 hover:bg-white/8"
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row">
            {['non_monogamous', 'sex_positive'].map((category) => (
              <ExpandableCalendar
                key={category}
                category={category}
                active={activeCategory === category}
                events={filteredCategories[category]}
                month={months[category]}
                onActivate={setActiveCategory}
                onMonthChange={(amount) =>
                  setMonths((current) => ({ ...current, [category]: shiftMonth(current[category], amount) }))
                }
                onEventClick={setSelectedEvent}
              />
            ))}
          </div>
        </div>
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
