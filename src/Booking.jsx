import { useEffect, useRef, useState } from "react";
import "./App.css";
import "./Booking.css";
import SlotPicker, { formatSlot } from "./SlotPicker";

const STEPS = [
  {
    name: "nom",
    title: "Quel est votre prénom ?",
    placeholder: "",
    type: "text",
    autoComplete: "name",
    validate: (v) => (v.trim() ? "" : "Indiquez votre nom."),
  },
  {
    name: "email",
    title: "Quelle est votre adresse email ?",
    placeholder: "",
    type: "email",
    autoComplete: "email",
    validate: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
        ? ""
        : "Entrez une adresse email valide.",
  },
  {
    name: "projet",
    title: "Racontez-moi de votre projet",
    placeholder: "",
    multiline: true,
    validate: (v) => (v.trim() ? "" : "Décrivez votre projet en quelques mots."),
  },
  {
    name: "date",
    title: "Quand voulez-vous le réaliser ?",
    type: "slot",
    validate: (v) => (v ? "" : "Choisissez un créneau."),
  },
];

const LEAVE_MS = 350;

// Texte affiché dans le récap en haut à gauche
const display = (st, v) =>
  st.type === "slot" ? (v ? formatSlot(v) : "") : v.trim().split("\n")[0];

export default function Booking() {
  const [step, setStep] = useState(0);
  const [furthest, setFurthest] = useState(0); // question en attente
  const [values, setValues] = useState({ nom: "", email: "", projet: "", date: "" });
  const [error, setError] = useState("");
  const [leaving, setLeaving] = useState(false);
  const [done, setDone] = useState(false);
  const [sending, setSending] = useState(false);
  const [pickerKey, setPickerKey] = useState(0);

  const fieldRef = useRef(null);
  const timer = useRef(null);

  const current = STEPS[step];
  const value = values[current.name];
  const isLast = step === STEPS.length - 1;

  useEffect(() => () => clearTimeout(timer.current), []);

  // Focus automatique à chaque nouvelle question
  useEffect(() => {
    if (!done) {
      const id = setTimeout(() => fieldRef.current?.focus(), 100);
      return () => clearTimeout(id);
    }
  }, [step, done]);

  // Hauteur automatique du textarea
  useEffect(() => {
    const el = fieldRef.current;
    if (el && current.multiline) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [value, current.multiline]);

  // Fondu sortant, changement de contenu, puis fondu entrant (via la key)
  const transitionTo = (change) => {
    setLeaving(true);
    timer.current = setTimeout(() => {
      change();
      setLeaving(false);
    }, LEAVE_MS);
  };

  const submit = async () => {
    setSending(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: values.nom,
          email: values.email,
          projet: values.projet,
          start: values.date,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 409) {
          // Créneau pris entre-temps : on vide le choix et on recharge les créneaux
          setValues((v) => ({ ...v, date: "" }));
          setPickerKey((k) => k + 1);
        }
        throw new Error(data.error || "L'envoi a échoué. Réessayez dans un instant.");
      }
      transitionTo(() => setDone(true));
    } catch (e) {
      setError(e.message || "L'envoi a échoué. Réessayez dans un instant.");
    } finally {
      setSending(false);
    }
  };

  const next = () => {
    if (sending || leaving) return;
    const message = current.validate(value);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    if (isLast) {
      submit();
      return;
    }
    const target = step < furthest ? furthest : step + 1;
    transitionTo(() => {
      setStep(target);
      setFurthest(target);
    });
  };

  const goTo = (i) => {
    if (i === step || sending || leaving) return;
    setError("");
    transitionTo(() => setStep(i));
  };

  const back = () => {
    if (step > 0) goTo(step - 1);
  };

  const onChange = (e) => {
    setValues((v) => ({ ...v, [current.name]: e.target.value }));
    if (error) setError("");
  };

  // Entrée valide ; Maj+Entrée = retour à la ligne dans le textarea
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      next();
    }
  };

  const fieldProps = {
    ref: fieldRef,
    value,
    onChange,
    onKeyDown,
    placeholder: current.placeholder,
    "aria-label": current.title,
    className: "booking-field",
  };

  return (
    <main className="booking">
      {!done && furthest > 0 && (
        <nav1 className="booking-recap" aria-label="Vos réponses">
          {STEPS.slice(0, furthest).map((st, i) => (
            <button
              key={st.name}
              type="button"
              className={`booking-entry${i === step ? " is-active" : ""}`}
              onClick={() => goTo(i)}
              aria-label={`Modifier : ${st.title}`}
              aria-current={i === step ? "step" : undefined}
              title={st.title}
            >
              {display(st, values[st.name])}
            </button>
          ))}
        </nav1>
      )}

      {step > 0 && !done && (
        <button type="button" className="booking-btn booking-back" onClick={back}>
          Retour
        </button>
      )}

      {done ? (
        <div key="done" className="booking-stage">
          <h1 className="booking-title">
            Merci, {values.nom.trim().split(" ")[0]}.
          </h1>
          <p className="booking-thanks">
            Rendez-vous demandé : {formatSlot(values.date)}.
            <br />
            Votre demande est bien envoyée. Vous recevrez une réponse par email.
          </p>
        </div>
      ) : (
        <div
          key={step}
          className={`booking-stage${leaving ? " is-leaving" : ""}`}
        >
          <h1 className="booking-title">{current.title}</h1>

          {current.type === "slot" ? (
            <SlotPicker
              key={pickerKey}
              value={value}
              onChange={(iso) => {
                setValues((v) => ({ ...v, date: iso }));
                if (error) setError("");
              }}
            />
          ) : current.multiline ? (
            <textarea rows={3} {...fieldProps} />
          ) : (
            <input
              type={current.type}
              autoComplete={current.autoComplete}
              {...fieldProps}
            />
          )}

          <p className="booking-error" role="alert">
            {error}
          </p>

          <button
            type="button"
            className={`booking-btn booking-next${value.trim() ? "" : " is-hidden"}`}
            onClick={next}
            disabled={sending}
            tabIndex={value.trim() ? 0 : -1}
          >
            {isLast ? (sending ? "Envoi…" : "Envoyer") : "Continuer"}
          </button>
        </div>
      )}

      {!done && (
        <div className="booking-progress" aria-hidden="true">
          <span style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
      )}
    </main>
  );
}