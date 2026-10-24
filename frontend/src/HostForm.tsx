import { useState } from "react";
import type { FormEvent } from "react";
import { createSlot } from "./api";

export default function HostForm({ onCreated }: { onCreated: () => void }) {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [duration, setDuration] = useState(30);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);
        try {
            await createSlot(date, startTime, duration);
            setMessage({ type: "ok", text: "Slot published." });
            setDate("");
            setStartTime("");
            onCreated();
        } catch (err) {
            setMessage({ type: "err", text: (err as Error).message });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <section className="card">
            <h2>Host: publish a slot</h2>
            {message && (
                <div className={`alert ${message.type === "ok" ? "alert-ok" : "alert-err"}`}>
                    {message.text}
                </div>
            )}
            <form onSubmit={handleSubmit} style={{ display: "grid", gap: "0.75rem" }}>
                <div className="two-cols">
                    <div className="field">
                        <label htmlFor="date">Date</label>
                        <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                    </div>
                    <div className="field">
                        <label htmlFor="time">Start time</label>
                        <input id="time" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                    </div>
                </div>
                <div className="field">
                    <label htmlFor="duration">Duration (minutes)</label>
                    <input
                        id="duration"
                        type="number"
                        min={5}
                        max={480}
                        step={5}
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                        required
                    />
                </div>
                <button className="btn btn-primary" type="submit" disabled={submitting}>
                    {submitting ? "Publishing…" : "Publish slot"}
                </button>
            </form>
        </section>
    );
}