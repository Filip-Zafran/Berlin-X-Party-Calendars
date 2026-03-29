import React, { useEffect, useMemo, useState } from 'react';
import StatusMessage from './StatusMessage';

const initialState = {
  title: '',
  category: 'non_monogamous',
  event_date: '',
  start_time: '',
  end_time: '',
  location: '',
  description: '',
  tags: '',
  external_link: '',
  price_text: '',
};

export default function EventForm({ initialEvent, onSubmit, submitting, message }) {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!initialEvent) {
      setForm(initialState);
      setErrors({});
      return;
    }

    setForm({
      title: initialEvent.title || '',
      category: initialEvent.category || 'non_monogamous',
      event_date: initialEvent.event_date || '',
      start_time: initialEvent.start_time || '',
      end_time: initialEvent.end_time || '',
      location: initialEvent.location || '',
      description: initialEvent.description || '',
      tags: Array.isArray(initialEvent.tags) ? initialEvent.tags.join(', ') : '',
      external_link: initialEvent.external_link || '',
      price_text: initialEvent.price_text || '',
    });
    setErrors({});
  }, [initialEvent]);

  const title = useMemo(() => (initialEvent ? 'Edit event' : 'Add event'), [initialEvent]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function validate() {
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = 'Title is required.';
    if (!form.event_date) nextErrors.event_date = 'Date is required.';
    if (!form.location.trim()) nextErrors.location = 'Location is required.';
    if (!form.description.trim()) nextErrors.description = 'Description is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    onSubmit({
      ...form,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    });
  }

  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-1 text-sm text-white/55">Create or update event details for the public calendars.</p>
      </div>

      <StatusMessage type={message?.type || 'info'} text={message?.text} />

      <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Title" error={errors.title}>
            <input value={form.title} onChange={(e) => updateField('title', e.target.value)} className={inputClass} />
          </Field>

          <Field label="Category">
            <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className={inputClass}>
              <option value="non_monogamous">Non-monogamous</option>
              <option value="sex_positive">Sex-positive</option>
            </select>
          </Field>

          <Field label="Date" error={errors.event_date}>
            <input type="date" value={form.event_date} onChange={(e) => updateField('event_date', e.target.value)} className={inputClass} />
          </Field>

          <Field label="Location" error={errors.location}>
            <input value={form.location} onChange={(e) => updateField('location', e.target.value)} className={inputClass} />
          </Field>

          <Field label="Start time">
            <input type="time" value={form.start_time} onChange={(e) => updateField('start_time', e.target.value)} className={inputClass} />
          </Field>

          <Field label="End time">
            <input type="time" value={form.end_time} onChange={(e) => updateField('end_time', e.target.value)} className={inputClass} />
          </Field>

          <Field label="External link">
            <input value={form.external_link} onChange={(e) => updateField('external_link', e.target.value)} className={inputClass} placeholder="https://..." />
          </Field>

          <Field label="Price text">
            <input value={form.price_text} onChange={(e) => updateField('price_text', e.target.value)} className={inputClass} placeholder="Free / €12 / Donation" />
          </Field>
        </div>

        <Field label="Tags">
          <input value={form.tags} onChange={(e) => updateField('tags', e.target.value)} className={inputClass} placeholder="queer, workshop, consent" />
        </Field>

        <Field label="Description" error={errors.description}>
          <textarea
            value={form.description}
            onChange={(e) => updateField('description', e.target.value)}
            className={`${inputClass} min-h-28`}
          />
        </Field>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex w-fit items-center rounded-full bg-white px-5 py-3 text-sm font-medium text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Saving...' : initialEvent ? 'Update event' : 'Create event'}
        </button>
      </form>
    </section>
  );
}

function Field({ label, error, children }) {
  return (
    <label className="grid gap-2 text-sm text-white/75">
      <span>{label}</span>
      {children}
      {error ? <span className="text-xs text-rose-300">{error}</span> : null}
    </label>
  );
}

const inputClass =
  'rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/20';
