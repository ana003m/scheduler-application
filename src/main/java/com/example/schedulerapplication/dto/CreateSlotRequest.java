package com.example.schedulerapplication.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;

public record CreateSlotRequest(
        @NotNull @FutureOrPresent LocalDate date,
        @NotNull LocalTime startTime,
        @NotNull @Min(5) @Max(480) Integer durationMinutes) {}
