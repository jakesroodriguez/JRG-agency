import React, { useState, useMemo, useEffect } from "react";
import {
  FiSearch,
  FiGrid,
  FiList,
  FiX,
  FiExternalLink,
  FiPhone,
  FiMapPin,
  FiStar,
  FiCamera,
  FiMessageSquare,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiLayers,
  FiZap,
  FiRefreshCw
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import "./LeadFinderModal.css";

export interface LeadMasterRecord {
  id: number;
  nombre: string;
  municipio: string;
  categoria: string;
  sector: string;
  direccion: string;
  telefono: string;
  website: string;
  rating: number;
  reviews: number;
  gmaps_url: string;
  potencial_ia: string;
  servicio_ia: string;
  pitch: string;
  presupuesto: number;
  crm_status: string;
  heroImage: string;
  photos: string[];
  hasRealPhoto: boolean;
}

interface LeadFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: LeadMasterRecord[];
  leadStatuses: Record<number, string>;
  onToggleStatus: (leadId: number) => void;
  onConsultAgent?: (agentId: string, promptText: string) => void;
  availableDemos?: Record<string, boolean>;
}

export const LeadFinderModal: React.FC<LeadFinderModalProps> = ({
  isOpen,
  onClose,
  leads,
  leadStatuses,
  onToggleStatus,
  onConsultAgent,
  availableDemos = {}
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedMunicipio, setSelectedMunicipio] = useState<string>("Todos");
  const [selectedSector, setSelectedSector] = useState<string>("Todos");
  const [selectedStatus, setSelectedStatus] = useState<string>("Todos");
  const [onlyRealPhotos, setOnlyRealPhotos] = useState<boolean>(false);
  const [onlyWithPhone, setOnlyWithPhone] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [activeDossierLead, setActiveDossierLead] = useState<LeadMasterRecord | null>(null);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedMunicipio, selectedSector, selectedStatus, onlyRealPhotos, onlyWithPhone]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (activeDossierLead) {
          setActiveDossierLead(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeDossierLead, onClose]);

  // Extract unique municipalities with counts
  const municipiosList = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const m = l.municipio || "Gipuzkoa";
      counts[m] = (counts[m] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return [
      { name: "Todos", count: leads.length },
      ...sorted.map(([name, count]) => ({ name, count })),
    ];
  }, [leads]);

  // Extract unique sectors with counts
  const sectoresList = useMemo(() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      const s = l.sector || "Comercio Local";
      counts[s] = (counts[s] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return [
      { name: "Todos", count: leads.length },
      ...sorted.map(([name, count]) => ({ name, count })),
    ];
  }, [leads]);

  // Filter leads
  const filteredLeads = useMemo(() => {
    let result = leads;

    if (selectedMunicipio !== "Todos") {
      result = result.filter(
        (l) => l.municipio.toLowerCase() === selectedMunicipio.toLowerCase()
      );
    }

    if (selectedSector !== "Todos") {
      result = result.filter((l) => l.sector === selectedSector);
    }

    if (selectedStatus !== "Todos") {
      result = result.filter((l) => {
        const current = leadStatuses[l.id] || "nuevo";
        return current.toLowerCase() === selectedStatus.toLowerCase();
      });
    }

    if (onlyRealPhotos) {
      result = result.filter((l) => l.hasRealPhoto);
    }

    if (onlyWithPhone) {
      result = result.filter((l) => l.telefono && l.telefono.trim().length > 3);
    }

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (l) =>
          l.nombre.toLowerCase().includes(q) ||
          l.municipio.toLowerCase().includes(q) ||
          l.categoria.toLowerCase().includes(q) ||
          l.sector.toLowerCase().includes(q) ||
          l.direccion.toLowerCase().includes(q) ||
          l.telefono.replace(/\s+/g, "").includes(q)
      );
    }

    return result;
  }, [
    leads,
    selectedMunicipio,
    selectedSector,
    selectedStatus,
    onlyRealPhotos,
    onlyWithPhone,
    searchTerm,
    leadStatuses,
  ]);

  // Pagination
  const pageSize = viewMode === "grid" ? 24 : 40;
  const totalPages = Math.max(1, Math.ceil(filteredLeads.length / pageSize));
  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLeads.slice(start, start + pageSize);
  }, [filteredLeads, currentPage, pageSize]);

  if (!isOpen) return null;

  const realPhotosCount = leads.filter((l) => l.hasRealPhoto).length;
  const phonesCount = leads.filter((l) => l.telefono && l.telefono.trim().length > 3).length;
  const reviewsCount = leads.filter((l) => l.reviews > 0).length;

  return (
    <div className="jrg-lf-overlay">
      <div className="jrg-lf-modal">
        {/* ==================================================================
            1. TOP HUD HEADER
            ================================================================== */}
        <header className="jrg-lf-header">
          <div className="jrg-lf-header-left">
            <div className="jrg-lf-brand-badge">
              <img src="/logoJRG.png" alt="JRG" className="jrg-lf-brand-logo" />
              <span>JRG AGENCY</span>
            </div>
            <div className="jrg-lf-header-title-block">
              <h2>LEAD FINDER INTELLIGENCE CONSOLE</h2>
              <p>Base de datos de prospección B2B verificada en Gipuzkoa (Goierri y Alto Urola)</p>
            </div>
          </div>

          <div className="jrg-lf-header-right">
            <div className="jrg-lf-metrics-row">
              <div className="jrg-lf-metric-pill" title="Total de comercios y negocios en la base de datos">
                <strong>{leads.length.toLocaleString("es-ES")}</strong>
                <span>LEADS</span>
              </div>
              <div className="jrg-lf-metric-pill" title="Comercios con fotos reales extraídas de Google Maps">
                <FiCamera style={{ color: "#ffffff", marginRight: "3px" }} />
                <strong>{realPhotosCount}</strong>
                <span>FOTOS GMAPS</span>
              </div>
              <div className="jrg-lf-metric-pill" title="Comercios con teléfono de contacto directo disponible">
                <FiPhone style={{ color: "#a1a1aa", marginRight: "3px" }} />
                <strong>{phonesCount.toLocaleString("es-ES")}</strong>
                <span>CON TEL</span>
              </div>
              <div className="jrg-lf-metric-pill" title="Comercios con opiniones y reseñas activas en Google Maps">
                <FiStar style={{ color: "#facc15", marginRight: "3px" }} />
                <strong>{reviewsCount}</strong>
                <span>CON RESEÑAS</span>
              </div>
            </div>

            <button className="jrg-lf-close-btn" onClick={onClose} title="Cerrar Lead Finder (Esc)">
              <FiX />
            </button>
          </div>
        </header>

        {/* ==================================================================
            2. CONTROL BAR & FILTERS
            ================================================================== */}
        <div className="jrg-lf-controls-bar">
          {/* Buscador reactivo */}
          <div className="jrg-lf-search-wrap">
            <FiSearch className="jrg-lf-search-icon" />
            <input
              type="text"
              className="jrg-lf-search-input"
              placeholder="Buscar por negocio, calle, teléfono, municipio o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {searchTerm && (
              <button
                className="jrg-lf-clear-search-btn"
                onClick={() => setSearchTerm("")}
                title="Limpiar búsqueda"
              >
                <FiX />
              </button>
            )}
          </div>

          {/* Selectores desplegables */}
          <div className="jrg-lf-filters-row">
            {/* Municipio */}
            <div className="jrg-lf-filter-field">
              <label>Municipio:</label>
              <select
                value={selectedMunicipio}
                onChange={(e) => setSelectedMunicipio(e.target.value)}
              >
                {municipiosList.map((m) => (
                  <option key={`muni-${m.name}`} value={m.name}>
                    {m.name} ({m.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Sector */}
            <div className="jrg-lf-filter-field">
              <label>Sector:</label>
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
              >
                {sectoresList.map((s) => (
                  <option key={`sect-${s.name}`} value={s.name}>
                    {s.name} ({s.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Estado CRM */}
            <div className="jrg-lf-filter-field">
              <label>Estado CRM:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="Todos">Todos los Estados</option>
                <option value="nuevo">Nuevo / Inbox</option>
                <option value="contactado">Contactado</option>
                <option value="propuesta">Propuesta Enviada</option>
                <option value="cerrado">Cerrado / Cliente</option>
              </select>
            </div>

            {/* Toggles Rápidos */}
            <label className="jrg-lf-toggle-check">
              <input
                type="checkbox"
                checked={onlyRealPhotos}
                onChange={(e) => setOnlyRealPhotos(e.target.checked)}
              />
              <span>Solo Fotos GMaps</span>
            </label>

            <label className="jrg-lf-toggle-check">
              <input
                type="checkbox"
                checked={onlyWithPhone}
                onChange={(e) => setOnlyWithPhone(e.target.checked)}
              />
              <span>Solo con Teléfono</span>
            </label>

            {/* Vista Toggle (Cards vs Table) */}
            <div className="jrg-lf-view-toggle">
              <button
                className={`jrg-lf-view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Vista de Tarjetas / Dossier"
              >
                <FiGrid />
              </button>
              <button
                className={`jrg-lf-view-btn ${viewMode === "table" ? "active" : ""}`}
                onClick={() => setViewMode("table")}
                title="Vista de Tabla Ejecutiva"
              >
                <FiList />
              </button>
            </div>
          </div>
        </div>

        {/* Píldoras rápidas de municipios más poblados */}
        <div className="jrg-lf-quick-pills-bar">
          <span className="jrg-lf-quick-label">Top Municipios:</span>
          {municipiosList.slice(0, 8).map((m) => (
            <button
              key={`quick-${m.name}`}
              className={`jrg-lf-quick-pill ${selectedMunicipio === m.name ? "active" : ""}`}
              onClick={() => setSelectedMunicipio(m.name)}
            >
              {m.name} <span className="jrg-lf-pill-badge">{m.count}</span>
            </button>
          ))}
        </div>

        {/* ==================================================================
            3. RESULTS COUNTER & SUMMARY
            ================================================================== */}
        <div className="jrg-lf-results-header">
          <span>
            Mostrando <strong>{filteredLeads.length.toLocaleString("es-ES")}</strong> de{" "}
            {leads.length.toLocaleString("es-ES")} comercios encontrados
            {selectedMunicipio !== "Todos" && ` en ${selectedMunicipio}`}
            {searchTerm && ` para "${searchTerm}"`}
          </span>
          <span className="jrg-lf-pagination-info">
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> (
            {pageSize} por página)
          </span>
        </div>

        {/* ==================================================================
            4. LEADS LIST (GRID OR TABLE)
            ================================================================== */}
        <div className="jrg-lf-content-scroll">
          {filteredLeads.length === 0 ? (
            <div className="jrg-lf-empty-state">
              <p>No se encontraron comercios con los filtros seleccionados.</p>
              <button
                className="jrg-lf-reset-filters-btn"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedMunicipio("Todos");
                  setSelectedSector("Todos");
                  setSelectedStatus("Todos");
                  setOnlyRealPhotos(false);
                  setOnlyWithPhone(false);
                }}
              >
                <FiRefreshCw style={{ verticalAlign: "middle", marginRight: "6px" }} />
                Restablecer Filtros
              </button>
            </div>
          ) : viewMode === "grid" ? (
            /* ================= VISTA GRID (CARDS) ================= */
            <div className="jrg-lf-grid">
              {paginatedLeads.map((lead) => {
                const status = leadStatuses[lead.id] || "nuevo";
                const cleanPhone = lead.telefono ? lead.telefono.replace(/\D/g, "") : "";
                const whatsappUrl = cleanPhone
                  ? `https://wa.me/34${cleanPhone}?text=${encodeURIComponent(lead.pitch)}`
                  : null;

                return (
                  <div key={lead.id} className="jrg-lf-card">
                    {/* Hero Image con Badges */}
                    <div
                      className="jrg-lf-card-img-wrap"
                      onClick={() => setActiveDossierLead(lead)}
                    >
                      <img
                        src={lead.heroImage}
                        alt={lead.nombre}
                        className="jrg-lf-card-img"
                        loading="lazy"
                      />
                      <div className="jrg-lf-card-badges">
                        {lead.hasRealPhoto ? (
                          <span className="jrg-lf-badge-gmaps" title="Fotografía real extraída de Google Maps">
                            <FiCamera /> GMaps Real
                          </span>
                        ) : (
                          <span className="jrg-lf-badge-category">{lead.categoria}</span>
                        )}
                        {lead.reviews > 0 && (
                          <span className="jrg-lf-badge-rating">
                            ★ {lead.rating.toFixed(1)} ({lead.reviews})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contenido de la Tarjeta */}
                    <div className="jrg-lf-card-body">
                      <div className="jrg-lf-card-title-row">
                        <h4
                          className="jrg-lf-card-title"
                          onClick={() => setActiveDossierLead(lead)}
                          title={lead.nombre}
                        >
                          {lead.nombre}
                        </h4>
                        <button
                          className={`jrg-lf-status-pill ${status}`}
                          onClick={() => onToggleStatus(lead.id)}
                          title="Clic para avanzar etapa: Nuevo -> Contactado -> Propuesta -> Cerrado"
                        >
                          {status.toUpperCase()}
                        </button>
                      </div>

                      <div className="jrg-lf-card-meta">
                        <span className="jrg-lf-meta-item">
                          <FiMapPin /> {lead.municipio}
                        </span>
                        <span className="jrg-lf-meta-item">
                          <FiLayers /> {lead.sector}
                        </span>
                      </div>

                      {lead.telefono ? (
                        <div className="jrg-lf-phone-row">
                          <FiPhone className="jrg-lf-phone-icon" />
                          <strong>{lead.telefono}</strong>
                        </div>
                      ) : (
                        <div className="jrg-lf-phone-row muted">
                          <span>Sin teléfono directo registrado</span>
                        </div>
                      )}

                      <div className="jrg-lf-pitch-snippet">
                        &ldquo;{lead.pitch.slice(0, 95)}...&rdquo;
                      </div>

                      {/* Botones de Acción */}
                      <div className="jrg-lf-card-actions">
                        <button
                          className="jrg-lf-btn-dossier"
                          onClick={() => setActiveDossierLead(lead)}
                          title="Abrir expediente completo de inteligencia"
                        >
                          Dossier
                        </button>

                        {lead.gmaps_url && (
                          <a
                            href={lead.gmaps_url}
                            target="_blank"
                            rel="noreferrer"
                            className="jrg-lf-btn-maps"
                            title="Ver en Google Maps"
                          >
                            <FiExternalLink />
                          </a>
                        )}

                        {whatsappUrl ? (
                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="jrg-lf-btn-whatsapp"
                            title="Contactar por WhatsApp en 1 clic"
                          >
                            <FaWhatsapp /> Contactar
                          </a>
                        ) : (
                          <button className="jrg-lf-btn-whatsapp disabled" disabled>
                            <FaWhatsapp /> Sin Tel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* ================= VISTA TABLA (HIGH DENSITY) ================= */
            <div className="jrg-lf-table-container">
              <table className="jrg-lf-table">
                <thead>
                  <tr>
                    <th style={{ width: "48px" }}>Foto</th>
                    <th>Comercio</th>
                    <th>Municipio</th>
                    <th>Sector</th>
                    <th>Google Rating</th>
                    <th>Teléfono</th>
                    <th>Estado CRM</th>
                    <th style={{ textAlign: "right" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLeads.map((lead) => {
                    const status = leadStatuses[lead.id] || "nuevo";
                    const cleanPhone = lead.telefono ? lead.telefono.replace(/\D/g, "") : "";
                    const whatsappUrl = cleanPhone
                      ? `https://wa.me/34${cleanPhone}?text=${encodeURIComponent(lead.pitch)}`
                      : null;

                    return (
                      <tr key={lead.id}>
                        <td>
                          <div
                            className="jrg-lf-table-avatar"
                            onClick={() => setActiveDossierLead(lead)}
                          >
                            <img src={lead.heroImage} alt={lead.nombre} loading="lazy" />
                          </div>
                        </td>
                        <td>
                          <div
                            className="jrg-lf-table-name"
                            onClick={() => setActiveDossierLead(lead)}
                          >
                            <strong>{lead.nombre}</strong>
                            <span className="jrg-lf-table-cat">{lead.categoria}</span>
                          </div>
                        </td>
                        <td>
                          <span className="jrg-lf-table-muni">{lead.municipio}</span>
                        </td>
                        <td>
                          <span className="jrg-lf-table-sector">{lead.sector}</span>
                        </td>
                        <td>
                          {lead.reviews > 0 ? (
                            <span className="jrg-lf-table-rating">
                              ★ {lead.rating.toFixed(1)}{" "}
                              <small>({lead.reviews})</small>
                            </span>
                          ) : (
                            <span className="jrg-lf-table-rating muted">—</span>
                          )}
                        </td>
                        <td>
                          {lead.telefono ? (
                            <span className="jrg-lf-table-phone">{lead.telefono}</span>
                          ) : (
                            <span className="jrg-lf-table-phone muted">—</span>
                          )}
                        </td>
                        <td>
                          <button
                            className={`jrg-lf-status-pill ${status}`}
                            onClick={() => onToggleStatus(lead.id)}
                            title="Avanzar etapa CRM"
                          >
                            {status.toUpperCase()}
                          </button>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <div className="jrg-lf-table-actions">
                            <button
                              className="jrg-lf-btn-sm"
                              onClick={() => setActiveDossierLead(lead)}
                              title="Ver expediente"
                            >
                              Dossier
                            </button>
                            {lead.gmaps_url && (
                              <a
                                href={lead.gmaps_url}
                                target="_blank"
                                rel="noreferrer"
                                className="jrg-lf-btn-icon-sm"
                                title="Abrir Google Maps"
                              >
                                <FiExternalLink />
                              </a>
                            )}
                            {whatsappUrl && (
                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="jrg-lf-btn-wa-sm"
                                title="Enviar WhatsApp"
                              >
                                <FaWhatsapp />
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ==================================================================
            5. PAGINATION FOOTER
            ================================================================== */}
        <footer className="jrg-lf-footer">
          <div className="jrg-lf-pagination-controls">
            <button
              className="jrg-lf-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
              title="Primera Página"
            >
              « Primera
            </button>
            <button
              className="jrg-lf-page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              title="Página Anterior"
            >
              <FiChevronLeft /> Anterior
            </button>

            <span className="jrg-lf-page-indicator">
              Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
            </span>

            <button
              className="jrg-lf-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              title="Página Siguiente"
            >
              Siguiente <FiChevronRight />
            </button>
            <button
              className="jrg-lf-page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              title="Última Página"
            >
              Última »
            </button>
          </div>

          <div className="jrg-lf-footer-note">
            Presiona <strong>ESC</strong> para volver a la oficina 3D
          </div>
        </footer>
      </div>

      {/* ====================================================================
          6. DOSSIER DETALLADO DE LEAD (MODAL INTERNO DE INTELIGENCIA)
          ==================================================================== */}
      {activeDossierLead && (
        <div
          className="jrg-dossier-overlay"
          onClick={() => setActiveDossierLead(null)}
        >
          <div
            className="jrg-dossier-modal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Dossier con Foto Hero */}
            <div className="jrg-dossier-hero">
              <img
                src={activeDossierLead.heroImage}
                alt={activeDossierLead.nombre}
                className="jrg-dossier-hero-img"
              />
              <div className="jrg-dossier-hero-gradient" />
              <button
                className="jrg-dossier-close-btn"
                onClick={() => setActiveDossierLead(null)}
              >
                <FiX />
              </button>
              <div className="jrg-dossier-hero-content">
                <div className="jrg-dossier-tags-row">
                  {activeDossierLead.hasRealPhoto ? (
                    <span className="jrg-lf-badge-gmaps">
                      <FiCamera /> FOTO GMAPS VERIFICADA
                    </span>
                  ) : (
                    <span className="jrg-lf-badge-category">
                      {activeDossierLead.categoria}
                    </span>
                  )}
                  <span className="jrg-dossier-pill-muni">
                    {activeDossierLead.municipio}
                  </span>
                  <span className={`jrg-lf-status-pill ${leadStatuses[activeDossierLead.id] || "nuevo"}`}>
                    {(leadStatuses[activeDossierLead.id] || "nuevo").toUpperCase()}
                  </span>
                </div>
                <h2>{activeDossierLead.nombre}</h2>
                <p>{activeDossierLead.direccion || `${activeDossierLead.municipio}, Gipuzkoa`}</p>
              </div>
            </div>

            {/* Galería de fotos si tiene fotos adicionales */}
            {activeDossierLead.photos && activeDossierLead.photos.length > 1 && (
              <div className="jrg-dossier-gallery">
                {activeDossierLead.photos.map((ph, idx) => (
                  <img
                    key={`gal-${idx}`}
                    src={ph}
                    alt={`${activeDossierLead.nombre} ${idx}`}
                    className="jrg-dossier-gallery-thumb"
                  />
                ))}
              </div>
            )}

            {/* Cuerpo del Expediente */}
            <div className="jrg-dossier-body">
              <div className="jrg-dossier-grid">
                {/* Columna Izquierda: Datos y Contacto */}
                <div className="jrg-dossier-col">
                  <div className="jrg-dossier-card">
                    <h4>Datos Comerciales</h4>
                    <div className="jrg-dossier-info-list">
                      <div className="jrg-dossier-info-row">
                        <span>Teléfono:</span>
                        <strong>{activeDossierLead.telefono || "No disponible"}</strong>
                      </div>
                      <div className="jrg-dossier-info-row">
                        <span>Municipio / Zona:</span>
                        <strong>{activeDossierLead.municipio}</strong>
                      </div>
                      <div className="jrg-dossier-info-row">
                        <span>Sector:</span>
                        <strong>{activeDossierLead.sector}</strong>
                      </div>
                      <div className="jrg-dossier-info-row">
                        <span>Google Rating:</span>
                        <strong>
                          {activeDossierLead.reviews > 0
                            ? `★ ${activeDossierLead.rating.toFixed(1)} (${activeDossierLead.reviews} opiniones)`
                            : "Sin reseñas registradas"}
                        </strong>
                      </div>
                      {activeDossierLead.website && (
                        <div className="jrg-dossier-info-row">
                          <span>Web Actual:</span>
                          <a
                            href={activeDossierLead.website}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: "#93c5fd", textDecoration: "underline" }}
                          >
                            Visitar web <FiExternalLink style={{ verticalAlign: "middle" }} />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Acciones directas */}
                    <div className="jrg-dossier-links-row">
                      {(() => {
                        const clean = (s: string) =>
                          s
                            .toLowerCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-+|-+$/g, "");
                        const slug1 = `${clean(activeDossierLead.nombre)}-${clean(activeDossierLead.municipio)}`;
                        const matchSlug = availableDemos[slug1]
                          ? slug1
                          : Object.keys(availableDemos).find((k) =>
                              k.includes(clean(activeDossierLead.nombre).slice(0, 10))
                            );
                        if (!matchSlug) return null;
                        return (
                          <a
                            href={`/demo/${matchSlug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="jrg-dossier-link-btn"
                            style={{
                              borderColor: "rgba(255, 255, 255, 0.4)",
                              color: "#ffffff",
                              background: "rgba(255, 255, 255, 0.08)",
                            }}
                          >
                            <FiExternalLink /> Ver Demo Web en Vivo
                          </a>
                        );
                      })()}
                      {activeDossierLead.gmaps_url && (
                        <a
                          href={activeDossierLead.gmaps_url}
                          target="_blank"
                          rel="noreferrer"
                          className="jrg-dossier-link-btn"
                        >
                          <FiExternalLink /> Ficha Google Maps
                        </a>
                      )}
                      {activeDossierLead.telefono && (
                        <a
                          href={`tel:${activeDossierLead.telefono.replace(/\s+/g, "")}`}
                          className="jrg-dossier-link-btn"
                        >
                          <FiPhone /> Llamar por Teléfono
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Estado en el CRM */}
                  <div className="jrg-dossier-card">
                    <h4>Estado en el Pipeline Comercial</h4>
                    <div className="jrg-dossier-status-selector">
                      {(["nuevo", "contactado", "propuesta", "cerrado"] as const).map((st) => {
                        const current = leadStatuses[activeDossierLead.id] || "nuevo";
                        const active = current === st;
                        return (
                          <button
                            key={`dossier-st-${st}`}
                            className={`jrg-dossier-st-btn ${st} ${active ? "active" : ""}`}
                            onClick={() => onToggleStatus(activeDossierLead.id)}
                          >
                            {active && <FiCheck style={{ marginRight: "4px" }} />}
                            {st.toUpperCase()}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Columna Derecha: Pitch & Solución IA */}
                <div className="jrg-dossier-col">
                  {/* Propuesta de Solución IA */}
                  <div className="jrg-dossier-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h4>Diagnóstico de Solución Digital</h4>
                      <span className="jrg-lf-badge-category">
                        Potencial: {activeDossierLead.potencial_ia}
                      </span>
                    </div>
                    <p className="jrg-dossier-solution-desc">
                      <FiZap style={{ color: "#facc15", marginRight: "6px" }} />
                      <strong>{activeDossierLead.servicio_ia}</strong>
                    </p>
                    <div className="jrg-dossier-pricing-box">
                      <span>Presupuesto Estimado / Cobertura Kit Digital:</span>
                      <strong>{activeDossierLead.presupuesto.toLocaleString("es-ES")}€</strong>
                      <small>(100% Subvencionable por Bono Digital Segmento III)</small>
                    </div>
                  </div>

                  {/* Guion de WhatsApp Personalizado */}
                  <div className="jrg-dossier-card">
                    <h4>Guion de Prospección por WhatsApp (Iker Copy)</h4>
                    <div className="jrg-dossier-pitch-box">
                      {activeDossierLead.pitch}
                    </div>

                    {/* Botón WhatsApp */}
                    {activeDossierLead.telefono ? (
                      <a
                        href={`https://wa.me/34${activeDossierLead.telefono.replace(/\D/g, "")}?text=${encodeURIComponent(activeDossierLead.pitch)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="jrg-dossier-whatsapp-cta"
                      >
                        <FaWhatsapp style={{ fontSize: "16px" }} />
                        Enviar WhatsApp a {activeDossierLead.nombre} (+34 {activeDossierLead.telefono})
                      </a>
                    ) : (
                      <div className="jrg-dossier-whatsapp-cta disabled">
                        Sin teléfono directo para WhatsApp
                      </div>
                    )}
                  </div>

                  {/* Consulta al Agente Scout (Maider) */}
                  {onConsultAgent && (
                    <button
                      className="jrg-dossier-consult-btn"
                      onClick={() => {
                        onConsultAgent(
                          "jrg-maider",
                          `Maider, analiza la oportunidad digital y presencia de "${activeDossierLead.nombre}" en ${activeDossierLead.municipio}.`
                        );
                        setActiveDossierLead(null);
                        onClose();
                      }}
                    >
                      <FiMessageSquare /> Consultar Inteligencia de este Lead con Maider (Scout)
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadFinderModal;
