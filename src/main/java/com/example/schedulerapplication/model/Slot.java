package com.example.schedulerapplication.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
public class Slot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;
    private LocalTime startTime;
    private int durationMinutes;
    private boolean booked = false;
    private String bookedByName;
    private String bookedByEmail;

    public Slot() {}

    public Slot(LocalDate date, LocalTime startTime, int durationMinutes) {
        this.date = date;
        this.startTime = startTime;
        this.durationMinutes = durationMinutes;
    }

    public Long getId() { return id; }
    public LocalDate getDate() { return date; }
    public LocalTime getStartTime() { return startTime; }
    public int getDurationMinutes() { return durationMinutes; }
    public boolean isBooked() { return booked; }
    public String getBookedByName() { return bookedByName; }
    public String getBookedByEmail() { return bookedByEmail; }
}