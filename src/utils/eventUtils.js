import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from 'date-fns';

export const CATEGORY_META = {
  non_monogamous: {
    label: 'Non-Monogamous Events',
    accent: 'from-pink-500/40 via-orange-400/20 to-transparent',
    badge: 'bg-pink-500/15 text-pink-200 ring-pink-400/30',
    activePanel: 'border-pink-400/30 bg-gradient-to-br from-pink-500/12 to-orange-400/10',
    inactivePanel: 'border-pink-400/15 bg-pink-950/20',
    dot: 'bg-pink-400',
    button: 'bg-pink-500 hover:bg-pink-400 text-white',
  },
  sex_positive: {
    label: 'Sex-Positive Events',
    accent: 'from-violet-500/40 via-purple-400/20 to-transparent',
    badge: 'bg-violet-500/15 text-violet-200 ring-violet-400/30',
    activePanel: 'border-violet-400/30 bg-gradient-to-br from-violet-500/12 to-purple-400/10',
    inactivePanel: 'border-violet-400/15 bg-violet-950/20',
    dot: 'bg-violet-400',
    button: 'bg-violet-500 hover:bg-violet-400 text-white',
  },
};

export function getMonthGrid(monthDate) {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: gridStart, end: gridEnd });
}

export function groupEventsByDay(events = []) {
  return events.reduce((acc, event) => {
    const key = event.event_date;
    acc[key] = acc[key] ? [...acc[key], event] : [event];
    return acc;
  }, {});
}

export function eventMatchesFilters(event, filters) {
  const searchText = `${event.title} ${event.location} ${event.description}`.toLowerCase();
  const tags = Array.isArray(event.tags) ? event.tags : [];
  const priceText = (event.price_text || '').toLowerCase();

  const searchMatch = filters.search
    ? searchText.includes(filters.search.toLowerCase())
    : true;

  const tagMatch = filters.tag
    ? tags.some((tag) => tag.toLowerCase() === filters.tag.toLowerCase())
    : true;

  const priceMatch =
    filters.price === 'all'
      ? true
      : filters.price === 'free'
        ? priceText.includes('free') || priceText.includes('0')
        : !priceText.includes('free');

  return searchMatch && tagMatch && priceMatch;
}

export function uniqueTags(events = []) {
  return [...new Set(events.flatMap((event) => (Array.isArray(event.tags) ? event.tags : [])))].sort();
}

export function sortEvents(events = []) {
  return [...events].sort((a, b) => {
    const left = `${a.event_date}T${a.start_time || '00:00'}`;
    const right = `${b.event_date}T${b.start_time || '00:00'}`;
    return left.localeCompare(right);
  });
}

export function isSameMonthDate(day, monthDate) {
  return isSameMonth(day, monthDate);
}

export function isEventOnDay(event, day) {
  return isSameDay(parseISO(event.event_date), day);
}

export function formatMonthLabel(date) {
  return format(date, 'MMMM yyyy');
}

export function shiftMonth(date, amount) {
  return addMonths(date, amount);
}

export function formatEventDate(dateString) {
  return format(parseISO(dateString), 'EEE, d MMM yyyy');
}
