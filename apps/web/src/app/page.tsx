import {
  Calendar,
  Clock,
  MapPin,
  Mountain,
  CheckCircle2,
  MessageCircle,
  Handshake,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { EVENT_DATA, LAST_EDITION_DATA } from '@/data/eventData';
import PastEditionGallery from '@/components/PastEditionGallery';


export default function Home() {
  const whatsappUrl = `https://wa.me/${EVENT_DATA.whatsappNumber}?text=${encodeURIComponent(
    `Hola, quiero información sobre las inscripciones de Oxa Running ${EVENT_DATA.edition}.`
  )}`;

  const sponsorWhatsappUrl = `https://wa.me/${EVENT_DATA.whatsappNumber}?text=${encodeURIComponent(
    `Hola, estoy interesado en ser auspiciador de Oxa Running ${EVENT_DATA.edition}.`
  )}`;

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      {/* Navbar translúcido sin bordes ni desenfoque */}
      <header className="fixed inset-x-0 top-0 z-40 bg-neutral-950/35 transition-colors">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/images/logo.jpg"
              alt="Oxa Running Logo"
              className="h-11 w-auto rounded object-contain"
            />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-medium text-neutral-200 md:flex">
            <a href="#preventa" className="transition hover:text-lime-400">
              Inscripciones
            </a>
            <a href="#ruta" className="transition hover:text-lime-400">
              Ruta 12K
            </a>
            <a href="#edicion-anterior" className="transition hover:text-lime-400">
              Edición {LAST_EDITION_DATA.year}
            </a>
            <a href="#auspiciadores" className="transition hover:text-lime-400">
              Auspiciadores
            </a>
          </nav>
          <a
            href="#preventa"
            className="rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-600"
          >
            Inscríbete Ahora
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-950">
        {/* Imagen adaptable: portadamov1.png en móvil / portada1.png en PC (>= 768px) */}
        <div className="relative h-80 w-full sm:h-96 md:absolute md:inset-0 md:h-full">
          <picture className="block h-full w-full">
            <source media="(min-width: 768px)" srcSet="/images/portada1.png" />
            <img
              src="/images/portadamov1.png"
              alt="Corredor en Oxapampa"
              className="h-full w-full object-cover object-center md:opacity-65"
            />
          </picture>
          {/* Degradado inferior en móvil y lateral en PC */}
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/15 to-transparent md:bg-gradient-to-r md:from-neutral-950/85 md:via-neutral-950/35 md:to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 md:pb-20 md:pt-32 lg:pb-24 lg:pt-36 lg:px-8">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-lime-500/40 bg-lime-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime-400">
              <Mountain className="h-4 w-4" />
              {EVENT_DATA.tagline}
            </span>

            <h1 className="mt-5 text-4xl font-black uppercase tracking-tight text-white sm:text-6xl md:text-7xl">
              OXA<span className="text-lime-500">RUNNING</span>{' '}
              <span className="text-orange-500">{EVENT_DATA.edition}</span>
            </h1>

            <p className="mt-3 text-base font-semibold tracking-widest text-neutral-200 sm:text-xl">
              {EVENT_DATA.slogan}
            </p>

            <p className="mt-4 max-w-xl text-sm text-neutral-300 sm:text-base">
              Acepta el reto en la tierra de neblina y aventura. Corre rodeado de naturaleza en la
              Reserva de Biosfera Oxapampa-Asháninka-Yánesha.
            </p>

            {/* Datos clave */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-950/60 p-3.5 backdrop-blur-sm">
                <Calendar className="h-5 w-5 shrink-0 text-lime-400" />
                <div>
                  <p className="text-[11px] uppercase text-neutral-400">Fecha</p>
                  <p className="text-sm font-bold">{EVENT_DATA.dateText}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-950/60 p-3.5 backdrop-blur-sm">
                <Clock className="h-5 w-5 shrink-0 text-orange-400" />
                <div>
                  <p className="text-[11px] uppercase text-neutral-400">Partida</p>
                  <p className="text-sm font-bold">{EVENT_DATA.startTime}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-neutral-950/60 p-3.5 backdrop-blur-sm">
                <MapPin className="h-5 w-5 shrink-0 text-lime-400" />
                <div>
                  <p className="text-[11px] uppercase text-neutral-400">Lugar</p>
                  <p className="text-sm font-bold">Plaza Principal</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <a
                href="#preventa"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-orange-500 px-8 py-4 text-base font-bold text-white shadow-xl shadow-orange-500/30 transition hover:bg-orange-600"
              >
                Asegurar mi Cupo en Preventa
                <ArrowRight className="h-5 w-5" />
              </a>
              <a
                href="#ruta"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-neutral-950/50 px-8 py-4 text-base font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                Ver Ruta {EVENT_DATA.realDistance}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Preventa Dinámica */}
      <section id="preventa" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-sm font-bold uppercase tracking-widest text-orange-500">
            Inscripciones Abiertas
          </span>
          <h2 className="mt-2 text-3xl font-black uppercase sm:text-5xl">
            Fases de <span className="text-lime-500">Preventa</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-400">
            Inscríbete temprano y asegura tu kit completo al mejor precio de la temporada.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {EVENT_DATA.pricingTiers.map((tier) => {
            const isActive = tier.status === 'ACTIVE';
            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-2xl border p-8 transition ${
                  isActive
                    ? 'border-orange-500 bg-neutral-900 shadow-2xl shadow-orange-500/15'
                    : 'border-white/10 bg-neutral-900/50 opacity-75'
                }`}
              >
                {isActive && (
                  <span className="absolute -top-3.5 left-6 inline-flex items-center gap-1 rounded-full bg-orange-500 px-3 py-1 text-xs font-bold uppercase text-white">
                    <Flame className="h-3.5 w-3.5" /> Activa ahora
                  </span>
                )}

                <div>
                  <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                  <p className="mt-1 text-sm text-neutral-400">{tier.subtitle}</p>

                  <div className="mt-6 flex items-baseline gap-1">
                    <span className="text-sm font-semibold text-neutral-400">S/</span>
                    <span className="text-5xl font-black text-white">{tier.priceSoles}</span>
                    <span className="text-sm text-neutral-400">.00</span>
                  </div>

                  {isActive && tier.slotsAvailable && (
                    <p className="mt-3 text-xs font-semibold text-lime-400">
                      Quedan {tier.slotsAvailable} cupos disponibles en esta fase
                    </p>
                  )}

                  <ul className="mt-6 space-y-3 text-sm text-neutral-300">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lime-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={!isActive}
                  className={`mt-8 w-full rounded-xl py-3.5 text-sm font-bold uppercase tracking-wide transition ${
                    isActive
                      ? 'cursor-pointer bg-orange-500 text-white hover:bg-orange-600'
                      : 'cursor-not-allowed bg-white/10 text-neutral-400'
                  }`}
                >
                  {isActive ? 'Seleccionar e Inscribirme' : 'Próximamente'}
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Sección Ruta 12K */}
      <section id="ruta" className="border-y border-white/10 bg-neutral-900/40 py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="text-sm font-bold uppercase tracking-widest text-lime-400">
              Recorrido Oficial
            </span>
            <h2 className="mt-2 text-3xl font-black uppercase sm:text-5xl">
              {EVENT_DATA.distanceLabel}{' '}
              <span className="text-orange-500">({EVENT_DATA.realDistance})</span>
            </h2>
            <p className="mt-4 text-neutral-300">
              Partida y llegada en la <strong>{EVENT_DATA.location}</strong>. Un circuito desafiante
              y escénico que recorre sectores emblemáticos como Chontabamba y La Florida, rodeado
              del verde característico del valle de Oxapampa.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
                <p className="text-xs uppercase text-neutral-400">Distancia Real</p>
                <p className="mt-1 text-2xl font-black text-lime-400">{EVENT_DATA.realDistance}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-neutral-950 p-4">
                <p className="text-xs uppercase text-neutral-400">Hora de Partida</p>
                <p className="mt-1 text-2xl font-black text-orange-400">{EVENT_DATA.startTime}</p>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img
              src="/images/ruta-12k.jpg"
              alt="Mapa Ruta 12K Oxapampa"
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Sección Edición Anterior (2026) */}
      <PastEditionGallery />

      {/* Sección Auspiciadores */}
      <section id="auspiciadores" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-lime-500/30 bg-gradient-to-br from-neutral-900 to-neutral-950 p-8 text-center sm:p-14">
          <Handshake className="mx-auto h-12 w-12 text-lime-400" />
          <h2 className="mt-4 text-3xl font-black uppercase sm:text-4xl">
            Conecta tu Marca con <span className="text-lime-400">Oxa Running</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-neutral-300">
            Forma parte del evento deportivo más esperado de Oxapampa. Posiciona tu empresa frente a
            cientos de corredores, turistas y familias comprometidas con el deporte y la naturaleza.
          </p>
          <div className="mt-8">
            <a
              href={sponsorWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-lime-500 px-8 py-4 text-sm font-black uppercase tracking-wide text-neutral-950 transition hover:bg-lime-400"
            >
              Solicitar Dossier de Auspicios
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-neutral-950 py-10 text-center text-sm text-neutral-400">
        <p className="font-bold text-white">
          {EVENT_DATA.brand} • {EVENT_DATA.slogan}
        </p>
        <p className="mt-2">
          Oxapampa, Perú • Informes: {EVENT_DATA.whatsappDisplay} • {EVENT_DATA.socialHandle}
        </p>
      </footer>

      {/* Botón Flotante de WhatsApp */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-green-500 px-5 py-3.5 font-bold text-white shadow-2xl shadow-green-500/30 transition hover:scale-105 hover:bg-green-600"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Informes</span>
      </a>
    </div>
  );
}