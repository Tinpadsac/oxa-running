'use client';

import React, { useEffect, useState } from 'react';
import {
  Camera,
  Users,
  Handshake,
  MapPin,
  Plus,
  Trash2,
  Save,
  Lock,
  RefreshCw,
} from 'lucide-react';
import {
  adminApi,
  type AdminEventConfig,
  type AdminMediaItem,
  type AdminRegistrationItem,
  type AdminSponsorItem,
  type MediaType,
  type SponsorTier,
} from '@/services/admin.service';

type AdminTab = 'media' | 'registrations' | 'sponsors' | 'event';

const TOKEN_STORAGE_KEY = 'oxa_admin_token';

export default function AdminDashboardPage() {
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('media');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Datos
  const [mediaList, setMediaList] = useState<AdminMediaItem[]>([]);
  const [registrations, setRegistrations] = useState<AdminRegistrationItem[]>([]);
  const [sponsors, setSponsors] = useState<AdminSponsorItem[]>([]);
  const [eventConfig, setEventConfig] = useState<AdminEventConfig | null>(null);

  // Formulario Media
  const [mediaType, setMediaType] = useState<MediaType>('IMAGE');
  const [mediaTitle, setMediaTitle] = useState('');
  const [driveFileId, setDriveFileId] = useState('');
  const [youtubeId, setYoutubeId] = useState('');
  const [thumbnailDriveId, setThumbnailDriveId] = useState('');
  const [mediaSortOrder, setMediaSortOrder] = useState(0);

  // Formulario Sponsor
  const [sponsorName, setSponsorName] = useState('');
  const [sponsorTier, setSponsorTier] = useState<SponsorTier>('PARTNER');
  const [sponsorDriveId, setSponsorDriveId] = useState('');
  const [sponsorLogoUrl, setSponsorLogoUrl] = useState('');
  const [sponsorWebsiteUrl, setSponsorWebsiteUrl] = useState('');
  const [sponsorSortOrder, setSponsorSortOrder] = useState(0);

  // Formulario Portada y Ruta
  const [desktopCoverId, setDesktopCoverId] = useState('');
  const [mobileCoverId, setMobileCoverId] = useState('');
  const [routeDriveId, setRouteDriveId] = useState('');
  const [routeImageUrl, setRouteImageUrl] = useState('');
  const [distanceLabel, setDistanceLabel] = useState('');
  const [realDistance, setRealDistance] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [dateText, setDateText] = useState('');

  const loadAllData = async (currentToken: string) => {
    setLoading(true);
    setFeedback(null);
    try {
      const [mediaData, regData, sponsorData, cfgData] = await Promise.all([
        adminApi.listMedia(currentToken),
        adminApi.listRegistrations(currentToken),
        adminApi.listSponsors(currentToken),
        adminApi.getEventConfig(currentToken),
      ]);

      setMediaList(mediaData);
      setRegistrations(regData);
      setSponsors(sponsorData);
      setEventConfig(cfgData);

      setDesktopCoverId(cfgData.desktopCoverId ?? '');
      setMobileCoverId(cfgData.mobileCoverId ?? '');
      setRouteDriveId(cfgData.routeDriveId ?? '');
      setRouteImageUrl(cfgData.routeImageUrl ?? '');
      setDistanceLabel(cfgData.distanceLabel ?? '');
      setRealDistance(cfgData.realDistance ?? '');
      setLocation(cfgData.location ?? '');
      setStartTime(cfgData.startTime ?? '');
      setDateText(cfgData.dateText ?? '');

      setAuthenticated(true);
    } catch (err) {
      setAuthenticated(false);
      setFeedback({
        type: 'err',
        text: err instanceof Error ? err.message : 'No se pudo validar el acceso.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? sessionStorage.getItem(TOKEN_STORAGE_KEY) : null;
    if (saved) {
      setToken(saved);
      setTokenInput(saved);
      void loadAllData(saved);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = tokenInput.trim();
    if (!cleaned) return;
    setToken(cleaned);
    sessionStorage.setItem(TOKEN_STORAGE_KEY, cleaned);
    await loadAllData(cleaned);
  };

  const handleLogout = () => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken('');
    setTokenInput('');
    setAuthenticated(false);
    setFeedback(null);
  };

  // --- Acciones Media ---
  const handleCreateMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle.trim()) return;
    setSaving(true);
    setFeedback(null);
    try {
      await adminApi.createMedia(token, {
        type: mediaType,
        title: mediaTitle,
        driveFileId: mediaType === 'IMAGE' ? driveFileId : undefined,
        youtubeId: mediaType === 'VIDEO' ? youtubeId : undefined,
        thumbnailDriveId: mediaType === 'VIDEO' ? thumbnailDriveId : undefined,
        sortOrder: Number(mediaSortOrder) || 0,
      });
      setMediaTitle('');
      setDriveFileId('');
      setYoutubeId('');
      setThumbnailDriveId('');
      setMediaSortOrder(0);
      setMediaList(await adminApi.listMedia(token));
      setFeedback({ type: 'ok', text: 'Elemento multimedia agregado correctamente.' });
    } catch (err) {
      setFeedback({
        type: 'err',
        text: err instanceof Error ? err.message : 'Error al guardar media.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMedia = async (id: string) => {
    setSaving(true);
    setFeedback(null);
    try {
      await adminApi.deleteMedia(token, id);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      setFeedback({ type: 'ok', text: 'Elemento eliminado.' });
    } catch (err) {
      setFeedback({
        type: 'err',
        text: err instanceof Error ? err.message : 'Error al eliminar media.',
      });
    } finally {
      setSaving(false);
    }
  };

  // --- Acciones Auspiciadores ---
  const handleCreateSponsor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName.trim()) return;
    setSaving(true);
    setFeedback(null);
    try {
      await adminApi.createSponsor(token, {
        name: sponsorName,
        tier: sponsorTier,
        driveFileId: sponsorDriveId || undefined,
        logoUrl: sponsorLogoUrl || undefined,
        websiteUrl: sponsorWebsiteUrl || undefined,
        sortOrder: Number(sponsorSortOrder) || 0,
        isActive: true,
      });
      setSponsorName('');
      setSponsorDriveId('');
      setSponsorLogoUrl('');
      setSponsorWebsiteUrl('');
      setSponsorSortOrder(0);
      setSponsors(await adminApi.listSponsors(token));
      setFeedback({ type: 'ok', text: 'Auspiciador registrado correctamente.' });
    } catch (err) {
      setFeedback({
        type: 'err',
        text: err instanceof Error ? err.message : 'Error al registrar auspiciador.',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSponsor = async (id: string) => {
    setSaving(true);
    setFeedback(null);
    try {
      await adminApi.deleteSponsor(token, id);
      setSponsors((prev) => prev.filter((s) => s.id !== id));
      setFeedback({ type: 'ok', text: 'Auspiciador eliminado.' });
    } catch (err) {
      setFeedback({
        type: 'err',
        text: err instanceof Error ? err.message : 'Error al eliminar auspiciador.',
      });
    } finally {
      setSaving(false);
    }
  };

  // --- Acciones Portada y Ruta ---
  const handleSaveEventConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const updated = await adminApi.updateEventConfig(token, {
        desktopCoverId,
        mobileCoverId,
        routeDriveId,
        routeImageUrl,
        distanceLabel,
        realDistance,
        location,
        startTime,
        dateText,
      });
      setEventConfig(updated);
      setFeedback({ type: 'ok', text: 'Portada y ruta del evento actualizadas.' });
    } catch (err) {
      setFeedback({
        type: 'err',
        text: err instanceof Error ? err.message : 'Error al actualizar portada/ruta.',
      });
    } finally {
      setSaving(false);
    }
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 text-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md rounded-2xl border border-white/10 bg-neutral-900 p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3 text-lime-400">
            <Lock className="h-6 w-6" />
            <h1 className="text-xl font-black uppercase tracking-wide">
              Panel Admin Oxa Running
            </h1>
          </div>
          <p className="mt-2 text-sm text-neutral-400">
            Ingresa tu clave de administrador (`ADMIN_SECRET`) para gestionar media, inscritos,
            auspiciadores, portada y ruta.
          </p>

          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder="Clave de administrador"
            className="mt-5 w-full rounded-xl border border-white/15 bg-neutral-950 px-4 py-3 text-sm text-white outline-none focus:border-lime-400"
            required
          />

          {feedback && (
            <p className="mt-3 text-xs font-medium text-red-400">{feedback.text}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-xl bg-orange-500 py-3 text-sm font-bold uppercase text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Verificando...' : 'Ingresar al Panel'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <header className="border-b border-white/10 bg-neutral-900/70">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-xl font-black uppercase tracking-tight">
              Administración <span className="text-lime-400">Oxa Running</span>
              {eventConfig && (
                <span className="ml-2 text-sm font-semibold text-orange-400">
                  • Edición {eventConfig.edition}
                </span>
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void loadAllData(token)}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-neutral-950 px-3.5 py-2 text-xs font-semibold text-neutral-200 hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Actualizar
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/15 px-3.5 py-2 text-xs font-semibold text-neutral-300 hover:bg-white/10"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Pestañas */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab('media')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              activeTab === 'media'
                ? 'bg-orange-500 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Camera className="h-4 w-4" />
            Fotos y Videos ({mediaList.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('registrations')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              activeTab === 'registrations'
                ? 'bg-orange-500 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Users className="h-4 w-4" />
            Inscripciones ({registrations.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('sponsors')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              activeTab === 'sponsors'
                ? 'bg-orange-500 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <Handshake className="h-4 w-4" />
            Auspiciadores ({sponsors.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('event')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition ${
              activeTab === 'event'
                ? 'bg-orange-500 text-white'
                : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800'
            }`}
          >
            <MapPin className="h-4 w-4" />
            Portada y Ruta
          </button>
        </div>

        {feedback && (
          <div
            className={`mt-6 rounded-xl border px-4 py-3 text-sm font-medium ${
              feedback.type === 'ok'
                ? 'border-lime-500/40 bg-lime-500/10 text-lime-300'
                : 'border-red-500/40 bg-red-500/10 text-red-300'
            }`}
          >
            {feedback.text}
          </div>
        )}

        {/* 1. FOTOS Y VIDEOS */}
        {activeTab === 'media' && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <form
              onSubmit={handleCreateMedia}
              className="space-y-4 rounded-2xl border border-white/10 bg-neutral-900 p-6"
            >
              <h2 className="text-lg font-bold text-white">Cargar Foto o Video</h2>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400">
                  Tipo
                </label>
                <select
                  value={mediaType}
                  onChange={(e) => setMediaType(e.target.value as MediaType)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                >
                  <option value="IMAGE">Foto (Google Drive File ID)</option>
                  <option value="VIDEO">Video (YouTube ID)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400">
                  Título
                </label>
                <input
                  type="text"
                  value={mediaTitle}
                  onChange={(e) => setMediaTitle(e.target.value)}
                  placeholder="Ej: Partida en la Plaza Principal"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                  required
                />
              </div>

              {mediaType === 'IMAGE' ? (
                <div>
                  <label className="block text-xs font-semibold uppercase text-neutral-400">
                    Drive File ID
                  </label>
                  <input
                    type="text"
                    value={driveFileId}
                    onChange={(e) => setDriveFileId(e.target.value)}
                    placeholder="Ej: 1AbCdEfGhIjKlMnOpQrStUvWxYz"
                    className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                    required
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-400">
                      YouTube Video ID
                    </label>
                    <input
                      type="text"
                      value={youtubeId}
                      onChange={(e) => setYoutubeId(e.target.value)}
                      placeholder="Ej: dQw4w9WgXcQ"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase text-neutral-400">
                      Miniatura en Drive (opcional)
                    </label>
                    <input
                      type="text"
                      value={thumbnailDriveId}
                      onChange={(e) => setThumbnailDriveId(e.target.value)}
                      placeholder="ID de imagen en Drive"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400">
                  Orden
                </label>
                <input
                  type="number"
                  value={mediaSortOrder}
                  onChange={(e) => setMediaSortOrder(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-500 py-3 text-sm font-black uppercase text-neutral-950 hover:bg-lime-400 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Agregar a Galería
              </button>
            </form>

            <div className="space-y-3 lg:col-span-2">
              {mediaList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-neutral-900 p-4"
                >
                  <div>
                    <span className="rounded bg-white/10 px-2 py-0.5 text-[11px] font-bold uppercase text-lime-400">
                      {item.type}
                    </span>
                    <h3 className="mt-1 font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-neutral-400">
                      {item.type === 'VIDEO'
                        ? `YouTube ID: ${item.youtubeId ?? '-'}`
                        : `Drive ID: ${item.driveFileId ?? '-'}`}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDeleteMedia(item.id)}
                    disabled={saving}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {mediaList.length === 0 && (
                <p className="rounded-2xl border border-white/10 bg-neutral-900/50 p-6 text-sm text-neutral-400">
                  No hay fotos o videos registrados todavía.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 2. INSCRIPCIONES */}
        {activeTab === 'registrations' && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-neutral-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-neutral-950/60 text-xs uppercase text-neutral-400">
                <tr>
                  <th className="px-4 py-3">DNI</th>
                  <th className="px-4 py-3">Corredor</th>
                  <th className="px-4 py-3">Contacto</th>
                  <th className="px-4 py-3">Talla</th>
                  <th className="px-4 py-3">Tarifa</th>
                  <th className="px-4 py-3">Monto</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {registrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-white/5">
                    <td className="px-4 py-3 font-mono text-xs">{reg.dni}</td>
                    <td className="px-4 py-3 font-semibold">
                      {reg.firstName} {reg.lastName}
                    </td>
                    <td className="px-4 py-3 text-xs text-neutral-300">
                      <div>{reg.phone}</div>
                      <div className="text-neutral-400">{reg.email}</div>
                    </td>
                    <td className="px-4 py-3">{reg.shirtSize}</td>
                    <td className="px-4 py-3">{reg.pricingTier?.name ?? '-'}</td>
                    <td className="px-4 py-3 font-bold text-lime-400">S/ {reg.amountPaid}</td>
                    <td className="px-4 py-3 text-xs font-bold">{reg.status}</td>
                  </tr>
                ))}
                {registrations.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-neutral-400">
                      Aún no hay inscripciones registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. AUSPICIADORES */}
        {activeTab === 'sponsors' && (
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
            <form
              onSubmit={handleCreateSponsor}
              className="space-y-4 rounded-2xl border border-white/10 bg-neutral-900 p-6"
            >
              <h2 className="text-lg font-bold text-white">Registrar Auspiciador</h2>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400">
                  Nombre de la Marca
                </label>
                <input
                  type="text"
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="Ej: Selva Andina Oxapampa"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400">
                  Categoría
                </label>
                <select
                  value={sponsorTier}
                  onChange={(e) => setSponsorTier(e.target.value as SponsorTier)}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                >
                  <option value="MAIN">MAIN</option>
                  <option value="GOLD">GOLD</option>
                  <option value="SILVER">SILVER</option>
                  <option value="PARTNER">PARTNER</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400">
                  Logo URL (opcional)
                </label>
                <input
                  type="text"
                  value={sponsorLogoUrl}
                  onChange={(e) => setSponsorLogoUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400">
                  Drive File ID del Logo (opcional)
                </label>
                <input
                  type="text"
                  value={sponsorDriveId}
                  onChange={(e) => setSponsorDriveId(e.target.value)}
                  placeholder="ID en Google Drive"
                  className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400">
                  Sitio Web / Red (opcional)
                </label>
                <input
                  type="text"
                  value={sponsorWebsiteUrl}
                  onChange={(e) => setSponsorWebsiteUrl(e.target.value)}
                  placeholder="https://..."
                  className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-neutral-400">
                  Orden
                </label>
                <input
                  type="number"
                  value={sponsorSortOrder}
                  onChange={(e) => setSponsorSortOrder(Number(e.target.value))}
                  className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-lime-500 py-3 text-sm font-black uppercase text-neutral-950 hover:bg-lime-400 disabled:opacity-50"
              >
                <Plus className="h-4 w-4" />
                Guardar Auspiciador
              </button>
            </form>

            <div className="space-y-3 lg:col-span-2">
              {sponsors.map((sp) => (
                <div
                  key={sp.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-neutral-900 p-4"
                >
                  <div>
                    <span className="rounded bg-lime-500/15 px-2 py-0.5 text-[11px] font-bold uppercase text-lime-400">
                      {sp.tier}
                    </span>
                    <h3 className="mt-1 font-bold text-white">{sp.name}</h3>
                    {sp.websiteUrl && (
                      <p className="text-xs text-neutral-400">{sp.websiteUrl}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleDeleteSponsor(sp.id)}
                    disabled={saving}
                    className="rounded-xl border border-red-500/30 bg-red-500/10 p-2.5 text-red-400 hover:bg-red-500/20"
                    title="Eliminar"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {sponsors.length === 0 && (
                <p className="rounded-2xl border border-white/10 bg-neutral-900/50 p-6 text-sm text-neutral-400">
                  Aún no hay auspiciadores registrados.
                </p>
              )}
            </div>
          </div>
        )}

        {/* 4. PORTADA Y RUTA */}
        {activeTab === 'event' && (
          <form
            onSubmit={handleSaveEventConfig}
            className="mt-8 grid grid-cols-1 gap-6 rounded-2xl border border-white/10 bg-neutral-900 p-6 md:grid-cols-2"
          >
            <div className="md:col-span-2">
              <h2 className="text-lg font-bold text-white">
                Modificar Portada y Datos de Ruta (Evento Activo)
              </h2>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400">
                Portada Escritorio — Drive File ID
              </label>
              <input
                type="text"
                value={desktopCoverId}
                onChange={(e) => setDesktopCoverId(e.target.value)}
                placeholder="Vacío usa /images/portada1.png"
                className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400">
                Portada Móvil — Drive File ID
              </label>
              <input
                type="text"
                value={mobileCoverId}
                onChange={(e) => setMobileCoverId(e.target.value)}
                placeholder="Vacío usa /images/portadamov1.png"
                className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400">
                Mapa de Ruta — Drive File ID
              </label>
              <input
                type="text"
                value={routeDriveId}
                onChange={(e) => setRouteDriveId(e.target.value)}
                placeholder="ID en Google Drive"
                className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400">
                Mapa de Ruta — URL Directa (opcional)
              </label>
              <input
                type="text"
                value={routeImageUrl}
                onChange={(e) => setRouteImageUrl(e.target.value)}
                placeholder="https://... o /images/ruta-12k.jpg"
                className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400">
                Etiqueta de Ruta
              </label>
              <input
                type="text"
                value={distanceLabel}
                onChange={(e) => setDistanceLabel(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400">
                Distancia Real
              </label>
              <input
                type="text"
                value={realDistance}
                onChange={(e) => setRealDistance(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400">
                Lugar de Partida / Llegada
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-neutral-400">
                Hora de Partida y Fecha
              </label>
              <div className="mt-1 grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  placeholder="6:30 AM"
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                  required
                />
                <input
                  type="text"
                  value={dateText}
                  onChange={(e) => setDateText(e.target.value)}
                  placeholder="Octubre 2027"
                  className="w-full rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-sm"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold uppercase text-white hover:bg-orange-600 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                Guardar Portada y Ruta
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}