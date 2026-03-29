import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ExternalLink, MapPin, Tag, X } from 'lucide-react';
import { CATEGORY_META, formatEventDate } from '../utils/eventUtils';

export default function EventModal({ event, onClose }) {
  return (
    <AnimatePresence>
      {event ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#15131d] p-6 text-white shadow-2xl"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${CATEGORY_META[event.category].badge}`}>
                  {CATEGORY_META[event.category].label}
                </span>
                <h2 className="mt-3 text-2xl font-semibold">{event.title}</h2>
                <p className="mt-2 text-sm text-white/70">
                  {formatEventDate(event.event_date)} · {event.start_time || 'Time TBA'}
                  {event.end_time ? `–${event.end_time}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-white/10 p-2 text-white/70 hover:border-white/20 hover:text-white"
                aria-label="Close event details"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 space-y-4 text-sm text-white/85">
              <div className="flex items-center gap-2 text-white/70">
                <MapPin size={16} />
                <span>{event.location || 'Location TBA'}</span>
              </div>
              <p className="leading-7 text-white/85">{event.description || 'No description yet.'}</p>
              {event.price_text ? <p className="text-white/70">Price: {event.price_text}</p> : null}
              {Array.isArray(event.tags) && event.tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1 text-xs text-white/75 ring-1 ring-white/10"
                    >
                      <Tag size={12} />
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {event.external_link ? (
              <a
                href={event.external_link}
                target="_blank"
                rel="noreferrer"
                className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${CATEGORY_META[event.category].button}`}
              >
                Open event link
                <ExternalLink size={16} />
              </a>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
