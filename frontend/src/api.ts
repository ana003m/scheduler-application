import type { Slot } from "./types";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export async function getSlots(): Promise<Slot[]> {
    const res = await fetch(`${API_URL}/api/slots`);
    if (!res.ok) throw new Error("Could not load the slots.");
    return res.json();
}
export async function bookSlot(id: number, name: string, email: string): Promise<void> {
    const res = await fetch(`${API_URL}/api/slots/${id}/book`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
    });
    if (res.status === 409) throw new Error("This slot was just booked by someone else. Please pick another.");
    if (res.status === 400) throw new Error("Please check the name and email.");
    if (!res.ok) throw new Error("Booking failed. Please try again.");
}

export async function createSlot(
    date: string,
    startTime: string,
    durationMinutes: number
): Promise<void> {
    const res = await fetch(`${API_URL}/api/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, startTime, durationMinutes }),
    });
    if (res.status === 400) throw new Error("Check the date (not in the past) and the duration (5-480 min).");
    if (!res.ok) throw new Error("The slot was not created. Please try again.");
}
