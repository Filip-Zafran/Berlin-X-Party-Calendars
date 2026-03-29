import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function EventFilters({ filters, onChange, tags }) {
  return (
    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4 shadow-xl backdrop-blur-sm">
      <div className="mb-4 flex items-center gap-2 text-sm text-white/75">
        <SlidersHorizontal size={16} />
        <span>Filter events</span>
      </div>
      <div className="grid gap-3 md:grid-cols-[1.5fr_1fr_1fr]">
        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/75">
          <Search size={16} />
          <input
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            placeholder="Search title or location"
            className="w-full bg-transparent outline-none placeholder:text-white/35"
          />
        </label>

        <select
          value={filters.tag}
          onChange={(e) => onChange('tag', e.target.value)}
          className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none"
        >
          <option value="">All tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <select
          value={filters.price}
          onChange={(e) => onChange('price', e.target.value)}
          className="rounded-2xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none"
        >
          <option value="all">Free + paid</option>
          <option value="free">Free only</option>
          <option value="paid">Paid only</option>
        </select>
      </div>
    </div>
  );
}
