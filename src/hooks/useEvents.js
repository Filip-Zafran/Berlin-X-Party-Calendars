import { useCallback, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';
import { sortEvents } from '../utils/eventUtils';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchEvents = useCallback(async () => {
    if (!supabase) {
      setError('Supabase is not configured yet. Add your environment variables to load events.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');

    const { data, error: queryError } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (queryError) {
      setError(queryError.message);
      setLoading(false);
      return;
    }

    setEvents(sortEvents(data ?? []));
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const categories = useMemo(
    () => ({
      non_monogamous: events.filter((event) => event.category === 'non_monogamous'),
      sex_positive: events.filter((event) => event.category === 'sex_positive'),
    }),
    [events]
  );

  return {
    events,
    categories,
    loading,
    error,
    refetch: fetchEvents,
    setEvents,
  };
}
