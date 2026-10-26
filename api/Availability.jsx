import { getFreeSlots } from "./_google.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée." });

  const { date } = req.query;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || "")) {
    return res.status(400).json({ error: "Date invalide." });
  }

  try {
    const slots = await getFreeSlots(date);
    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json({ slots });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Impossible de lire l'agenda pour le moment." });
  }
}