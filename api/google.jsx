import { google } from "googleapis";

// ---- Réglages (à adapter) ---------------------------------------------
export const TZ = "Europe/Paris";
export const WORK_DAYS = [1, 2, 3, 4, 5]; // 0 = dimanche … 6 = samedi (garder aligné avec SlotPicker.jsx)
export const START_HOUR = 10;
export const END_HOUR = 18;
export const SLOT_MINUTES = 60;
export const MIN_NOTICE_HOURS = 24;
export const HORIZON_DAYS = 60;
// ------------------------------------------------------------------------

export const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID;

export function getCalendar() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
  return google.calendar({ version: "v3", auth });
}

// Heure « murale » Europe/Paris -> instant UTC (suffisant pour des créneaux en journée)
function parisToUtc(dateStr, hour, minute) {
  const [Y, M, D] = dateStr.split("-").map(Number);
  const guess = new Date(Date.UTC(Y, M - 1, D, hour, minute));
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: TZ,
    timeZoneName: "longOffset",
  })
    .formatToParts(guess)
    .find((p) => p.type === "timeZoneName").value; // "GMT+02:00"
  const m = label.match(/GMT([+-])(\d{2}):(\d{2})/);
  const offsetMin = m ? (m[1] === "+" ? 1 : -1) * (Number(m[2]) * 60 + Number(m[3])) : 0;
  return new Date(guess.getTime() - offsetMin * 60000);
}

// "YYYY-MM-DD" d'un instant, vu depuis Paris
export function parisDateKey(date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(date);
}

// Créneaux libres (ISO UTC) pour un jour donné
export async function getFreeSlots(dateStr) {
  const [Y, M, D] = dateStr.split("-").map(Number);
  const weekday = new Date(Date.UTC(Y, M - 1, D)).getUTCDay();
  if (!WORK_DAYS.includes(weekday)) return [];

  const now = Date.now();
  const earliest = now + MIN_NOTICE_HOURS * 3600e3;
  const latest = now + HORIZON_DAYS * 86400e3;

  const candidates = [];
  for (let min = START_HOUR * 60; min + SLOT_MINUTES <= END_HOUR * 60; min += SLOT_MINUTES) {
    const start = parisToUtc(dateStr, Math.floor(min / 60), min % 60);
    const end = new Date(start.getTime() + SLOT_MINUTES * 60000);
    if (start.getTime() >= earliest && start.getTime() <= latest) {
      candidates.push({ start, end });
    }
  }
  if (!candidates.length) return [];

  const calendar = getCalendar();
  const { data } = await calendar.freebusy.query({
    requestBody: {
      timeMin: parisToUtc(dateStr, 0, 0).toISOString(),
      timeMax: parisToUtc(dateStr, 23, 59).toISOString(),
      timeZone: TZ,
      items: [{ id: CALENDAR_ID }],
    },
  });
  const busy = (data.calendars?.[CALENDAR_ID]?.busy || []).map((b) => ({
    start: new Date(b.start),
    end: new Date(b.end),
  }));

  return candidates
    .filter((c) => !busy.some((b) => c.start < b.end && c.end > b.start))
    .map((c) => c.start.toISOString());
}