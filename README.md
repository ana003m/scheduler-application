# Booking Scheduler

A small scheduling app. A host publishes available time slots, visitors see the free ones and book one with their name and email. A booked slot disappears from the list, and two people can never book the same slot.

## What it does

- Host creates slots (date, start time, duration)
- Visitors see the list of free slots, grouped by day
- Visitors book a slot with name and email
- Booked slots are no longer shown, and double bookings are rejected

## Tech stack

- **Backend:** Java 21, Spring Boot 3, Spring Data JPA, PostgreSQL
- **Frontend:** React + TypeScript (Vite), plain CSS

## How double booking is prevented

Booking is a single atomic SQL update:

```sql
UPDATE slot SET booked = true, ... WHERE id = ? AND booked = false
```

If it updates 0 rows, the slot was already taken (or does not exist) and the API returns `409 Conflict`. The database locks the row, so two simultaneous requests cannot both succeed. The check is on the backend, not only in the UI.

## Run it locally

### Prerequisites

- Java 21, Node.js, PostgreSQL
- A PostgreSQL database named `scheduler_db`

### Backend

Set these environment variables, then run:

| Variable | Required | Description |
|---|---|---|
| `DB_PASSWORD` | yes | PostgreSQL password |
| `DB_URL` | no | defaults to `jdbc:postgresql://localhost:5432/scheduler_db` |
| `DB_USER` | no | defaults to `postgres` |

```bash
./mvnw spring-boot:run
```

The API runs on `http://localhost:8080`. Tables are created automatically.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. To point it at a different backend, set `VITE_API_URL`.

## API

| Method | Path | Description |
|---|---|---|
| POST | `/api/slots` | Create a slot `{date, startTime, durationMinutes}` |
| GET | `/api/slots` | List available slots |
| POST | `/api/slots/{id}/book` | Book a slot `{name, email}`, returns `{message}`; `409` if already booked |

Input is validated (date not in the past, duration 5-480 minutes, valid email).


## What I would improve with more time

- Reject slots that overlap with each other, and slots earlier today
- Authentication for the host (right now anyone can publish slots)
- Send the confirmation by email, and let visitors cancel a booking
- Time zone support (currently one time zone)
