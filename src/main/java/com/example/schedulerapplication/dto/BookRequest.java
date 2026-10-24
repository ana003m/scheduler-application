package com.example.schedulerapplication.dto;


import jakarta.validation.constraints.*;

public record BookRequest(
        @NotBlank String name,
        @NotBlank @Email String email) {}