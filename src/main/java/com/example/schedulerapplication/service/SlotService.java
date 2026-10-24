package com.example.schedulerapplication.service;

import com.example.schedulerapplication.dto.BookRequest;
import com.example.schedulerapplication.dto.CreateSlotRequest;
import com.example.schedulerapplication.model.Slot;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.example.schedulerapplication.repository.SlotRepository;

import java.util.List;

@Service
public class SlotService {
    private final SlotRepository repo;

    public SlotService(SlotRepository repo) { this.repo = repo; }

    public Slot create(CreateSlotRequest r) {
        return repo.save(new Slot(r.date(), r.startTime(), r.durationMinutes()));
    }

    public List<Slot> listAvailable() {
        return repo.findByBookedFalseOrderByDateAscStartTimeAsc();
    }

    @Transactional
    public void book(Long id, BookRequest r) {
        if (repo.book(id, r.name(), r.email()) == 0) {
            if (!repo.existsById(id)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found");
            }
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot is already booked");
        }
    }

//    @Transactional
//    public Slot book(Long id, BookRequest r) {
//        if (repo.book(id, r.name(), r.email()) == 0) {
//            if (!repo.existsById(id)) {
//                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Slot not found");
//            }
//            throw new ResponseStatusException(HttpStatus.CONFLICT, "Slot is already booked");
//        }
//        return repo.findById(id).orElseThrow();
//    }
}