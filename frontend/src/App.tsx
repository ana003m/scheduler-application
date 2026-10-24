import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { getSlots, bookSlot } from "./api";
import type { Slot } from "./types";
import HostForm from "./HostForm";

const formatDay = (iso: string) =>
    new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
    });

const addMinutes = (time: string, minutes: number) => {
  const [h, m] = time.split(":").map(Number);
  const total = h * 60 + m + minutes;
  const hh = String(Math.floor(total / 60) % 24).padStart(2, "0");
  const mm = String(total % 60).padStart(2, "0");
  return `${hh}:${mm}`;
};

export default function App() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const loadSlots = () =>
      getSlots()
          .then((data) => {
            setSlots(data);
            setError("");
          })
          .catch((e: Error) => setError(e.message))
          .finally(() => setLoading(false));

  useEffect(() => {
    loadSlots();
  }, []);

  const handleBook = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedId === null) return;
    setSubmitting(true);
    setMessage(null);
    try {
      await bookSlot(selectedId, name.trim(), email.trim());
      setMessage({ type: "ok", text: "You're booked! The slot is now yours." });
      setSelectedId(null);
      setName("");
      setEmail("");
    } catch (err) {
      setMessage({ type: "err", text: (err as Error).message });
    } finally {
      setSubmitting(false);
      loadSlots();
    }
  };

  const byDay = slots.reduce<Record<string, Slot[]>>((acc, s) => {
    (acc[s.date] ||= []).push(s);
    return acc;
  }, {});

  return (
      <main className="container">
        <header className="header">
          <h1>Book a time</h1>
          <p>Pick a free slot and leave your name and email to reserve it.</p>
        </header>

        {message && (
            <div className={`alert ${message.type === "ok" ? "alert-ok" : "alert-err"}`}>
              {message.text}
            </div>
        )}

        <section className="card">
          <h2>Available slots</h2>
          {loading && <p className="empty">Loading…</p>}
          {error && <div className="alert alert-err">{error}</div>}
          {!loading && !error && slots.length === 0 && (
              <p className="empty">No free slots right now. Check back soon.</p>
          )}

          {Object.entries(byDay).map(([day, daySlots]) => (
              <div key={day}>
                <h3 className="day-title">{formatDay(day)}</h3>
                {daySlots.map((s) => (
                    <div className="slot" key={s.id}>
                      <div className="slot-row">
                        <div>
                          <div className="slot-time">
                            {s.startTime.slice(0, 5)} – {addMinutes(s.startTime.slice(0, 5), s.durationMinutes)}
                          </div>
                          <div className="slot-meta">{s.durationMinutes} minutes</div>
                        </div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                              setSelectedId(s.id);
                              setMessage(null);
                            }}
                        >
                          Book
                        </button>
                      </div>

                      {selectedId === s.id && (
                          <form className="booking-form" onSubmit={handleBook}>
                            <div className="field">
                              <label htmlFor="name">Your name</label>
                              <input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="field">
                              <label htmlFor="email">Email</label>
                              <input
                                  id="email"
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  required
                              />
                            </div>
                            <div className="actions">
                              <button className="btn btn-primary" type="submit" disabled={submitting}>
                                {submitting ? "Booking…" : "Confirm booking"}
                              </button>
                              <button className="btn btn-ghost" type="button" onClick={() => setSelectedId(null)}>
                                Cancel
                              </button>
                            </div>
                          </form>
                      )}
                    </div>
                ))}
              </div>
          ))}
        </section>

        <HostForm onCreated={loadSlots} />
      </main>
  );
}