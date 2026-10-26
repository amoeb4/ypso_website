import { useEffect, useMemo, useState } from "react";

// Jours ouvrés affichés (garder aligné avec api/_google.js)
const WORK_DAYS = [1, 2, 3, 4, 5];
const MIN_DAYS_AHEAD = 1;
const HORIZON_DAYS = 60;
const TZ = "Europe/Paris";

const pad = (n) => String(n).padStart(2, "0");
const toKey = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const parisKey = (iso) => new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(iso));

export function formatSlot(iso) {
  const d = new Date(iso);
  const day = d.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: TZ,
  });
  return `${day} à ${formatTime(iso)}`;
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: TZ,
  });
}

export default function SlotPicker({ value, onChange }) {
  const today = useMemo(() => {
    const t = new Date();
    return new Date(t.getFullYear(), t.getMonth(), t.getDate());
  }, []);
  const minDate = addDays(today, MIN_DAYS_AHEAD);
  const maxDate = addDays(today, HORIZON_DAYS);

  const initialDay = value ? parisKey(value) : "";
  const [day, setDay] = useState(initialDay);
  const [cursor, setCursor] = useState(() => {
    if (initialDay) {
      const [y, m] = initialDay.split("-").map(Number);
      return new Date(y, m - 1, 1);
    }
    return new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  });
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Charge les créneaux du jour choisi
  useEffect(() => {
    if (!day) return;
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setSlots([]);
    fetch(`/api/availability?date=${day}`, { signal: controller.signal })
      .then(async (res) => {
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || "Impossible de charger les créneaux.");
        setSlots(data.slots || []);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setError(err.message);
        setLoading(false);
      });
    return () => controller.abort();
  }, [day]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const lead = (new Date(year, month, 1).getDay() + 6) % 7; // semaine commençant le lundi
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const canPrev = cursor > new Date(minDate.getFullYear(), minDate.getMonth(), 1);
  const canNext = cursor < new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const monthLabel = cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const pickDay = (key) => {
    if (key !== day) {
      setDay(key);
      onChange("");
    }
  };

  return (
    <div className="slot-picker">
      <div className="slot-month">
        <button
          type="button"
          className="booking-btn"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
          disabled={!canPrev}
          aria-label="Mois précédent"
        >
          ‹
        </button>
        <span className="slot-month-label">{monthLabel}</span>
        <button
          type="button"
          className="booking-btn"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
          disabled={!canNext}
          aria-label="Mois suivant"
        >
          ›
        </button>
      </div>

      <div className="slot-grid" role="grid">
        {["L", "M", "M", "J", "V", "S", "D"].map((l, i) => (
          <span key={i} className="slot-weekday" aria-hidden="true">
            {l}
          </span>
        ))}
        {Array.from({ length: lead }, (_, i) => (
          <span key={`b${i}`} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const d = i + 1;
          const date = new Date(year, month, d);
          const key = toKey(year, month, d);
          const disabled = date < minDate || date > maxDate || !WORK_DAYS.includes(date.getDay());
          return (
            <button
              key={key}
              type="button"
              className={`slot-day${key === day ? " is-selected" : ""}`}
              disabled={disabled}
              aria-pressed={key === day}
              onClick={() => pickDay(key)}
            >
              {d}
            </button>
          );
        })}
      </div>

      <div className="slot-times" aria-live="polite">
        {loading && <p className="slot-note">Chargement des créneaux…</p>}
        {error && <p className="slot-note slot-note-error">{error}</p>}
        {!loading && !error && day && slots.length === 0 && (
          <p className="slot-note">Aucun créneau libre ce jour-là.</p>
        )}
        {slots.map((iso) => (
          <button
            key={iso}
            type="button"
            className={`slot-time${iso === value ? " is-selected" : ""}`}
            aria-pressed={iso === value}
            onClick={() => onChange(iso)}
          >
            {formatTime(iso)}
          </button>
        ))}
      </div>
    </div>
  );
}