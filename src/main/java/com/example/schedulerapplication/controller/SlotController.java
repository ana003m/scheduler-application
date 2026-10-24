package com.example.schedulerapplication.controller;

import com.example.schedulerapplication.dto.BookRequest;
import com.example.schedulerapplication.dto.CreateSlotRequest;
import jakarta.validation.Valid;
import com.example.schedulerapplication.model.Slot;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.example.schedulerapplication.service.SlotService;

import java.util.List;

@RestController
@RequestMapping("/api/slots")
@CrossOrigin(origins = "http://localhost:5173") // Vite; подоцна додај го live URL-то
public class SlotController {

    private final SlotService service;

    public SlotController(SlotService service) { this.service = service; }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Slot create(@Valid @RequestBody CreateSlotRequest r) { return service.create(r); }

    @GetMapping
    public List<Slot> list() { return service.listAvailable(); }

    @PostMapping("/{id}/book")
    public void book(@PathVariable Long id, @Valid @RequestBody BookRequest r) {
        service.book(id, r);
    }
}