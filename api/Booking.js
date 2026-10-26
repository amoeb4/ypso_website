import {
  CALENDAR_ID,
  SLOT_MINUTES,
  TZ,
  getCalendar,
  getFreeSlots,
  parisDateKey,
} from "./_google.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée." });

  const { nom, email, projet, start } = req.body || {};

  if (
    typeof nom !== "string" || !nom.trim() || nom.length > 100 ||
    typeof email !== "string" || !EMAIL_RE.test(email.trim()) || email.length > 200 ||
    typeof projet !== "string" || !projet.trim() || projet.length > 3000 ||
    typeof start !== "string" || Number.isNaN(Date.parse(start))
  ) {
    return res.status(400).json({ error: "Certaines informations sont invalides." });
  }

  const startDate = new Date(start);
  const endDate = new Date(startDate.getTime() + SLOT_MINUTES * 60000);

  try {
    // Le créneau doit exister et être encore libre au moment de la réservation
    const free = await getFreeSlots(parisDateKey(startDate));
    if (!free.includes(startDate.toISOString())) {
      return res.status(409).json({ error: "Ce créneau vient d'être pris. Choisissez-en un autre." });
    }

    const calendar = getCalendar();
    await calendar.events.insert({
      calendarId: CALENDAR_ID,
      requestBody: {
        summary: `RDV projet : ${nom.trim()}`,
        description: `Email : ${email.trim()}\n\n${projet.trim()}`,
        start: { dateTime: startDate.toISOString(), timeZone: TZ },
        end: { dateTime: endDate.toISOString(), timeZone: TZ },
        // « Peut-être » dans l'agenda : le créneau est bloqué, tu confirmes en acceptant l'événement
        status: "tentative",
      },
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "L'envoi a échoué. Réessayez dans un instant." });
  }
}