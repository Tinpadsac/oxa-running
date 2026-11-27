'use client';

import { useState } from 'react';
import { Play, X, Camera, Film, Sparkles } from 'lucide-react';
import {
  LAST_EDITION_DATA as DEFAULT_LAST_EDITION,
  LastEdition,
  MediaItem,
} from '@/data/eventData';

interface PastEditionGalleryProps {
  edition?: LastEdition;
}

export default function PastEditionGallery({
  edition: LAST_EDITION_DATA = DEFAULT_LAST_EDITION,
}: PastEditionGalleryProps) {
  const [filter, setFilter] = useState<'ALL' | 'IMAGE' | 'VIDEO'>('ALL');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  const filteredMedia = LAST_EDITION_DATA.media.filter((item) =>
    filter === 'ALL' ? true : item.type === filter
  );

  return (
    <section id="edicion-anterior" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      {/* Encabezado */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 text-sm font-bold uppercase tracking-widest text-lime-400">
          <Sparkles className="h-4 w-4" />
          Edición {LAST_EDITION_DATA.year}
        </span>
        <h2 className="mt-2 text-3xl font-black uppercase sm:text-5xl">
          {LAST_EDITION_DATA.title}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-neutral-400">
          {LAST_EDITION_DATA.description}
        </p>
      </div>

      {/* Métricas de impacto */}
      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {LAST_EDITION_DATA.stats.map((stat, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-white/10 bg-neutral-900/60 p-5 text-center"
          >
            <p className="text-3xl font-black text-orange-500 sm:text-4xl">{stat.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filtros de Media */}
      <div className="mt-10 flex justify-center gap-3">
        {[
          { key: 'ALL', label: 'Todo' },
          { key: 'IMAGE', label: 'Fotos', icon: Camera },
          { key: 'VIDEO', label: 'Videos', icon: Film },
        ].map(({ key, label, icon: Icon }) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key as 'ALL' | 'IMAGE' | 'VIDEO')}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full px-5 py-2 text-sm font-bold transition ${
                isActive
                  ? 'bg-lime-500 text-neutral-950'
                  : 'border border-white/15 bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {label}
            </button>
          );
        })}
      </div>

      {/* Grilla de Fotos y Videos */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {filteredMedia.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setSelectedMedia(item)}
            className="group relative aspect-[4/3] w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 text-left focus:outline-none focus:ring-2 focus:ring-lime-500"
          >
            <img
              src={item.thumbnailUrl}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />

            {item.type === 'VIDEO' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-500/90 text-white shadow-xl transition group-hover:scale-110">
                  <Play className="ml-1 h-6 w-6 fill-current" />
                </span>
              </div>
            )}

            <div className="absolute inset-x-0 bottom-0 p-4">
              <span className="text-[10px] font-bold uppercase tracking-widest text-lime-400">
                {item.type === 'VIDEO' ? 'Video' : 'Fotografía'}
              </span>
              <p className="mt-0.5 text-sm font-bold text-white">{item.title}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Modal Lightbox */}
      {selectedMedia && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setSelectedMedia(null)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/15 bg-neutral-950 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedMedia(null)}
              aria-label="Cerrar"
              className="absolute right-3 top-3 z-10 cursor-pointer rounded-full bg-neutral-900/80 p-2 text-white transition hover:bg-orange-500"
            >
              <X className="h-5 w-5" />
            </button>

            {selectedMedia.type === 'VIDEO' ? (
              <div className="aspect-video w-full">
                <iframe
                  src={selectedMedia.mediaUrl}
                  title={selectedMedia.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
                <img
                  src={selectedMedia.mediaUrl}
                  alt={selectedMedia.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[80vh] w-full bg-black object-contain"
                />
            )}

            <div className="border-t border-white/10 p-4">
              <p className="font-bold text-white">{selectedMedia.title}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}