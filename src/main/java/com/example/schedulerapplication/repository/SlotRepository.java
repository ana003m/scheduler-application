package com.example.schedulerapplication.repository;

import com.example.schedulerapplication.model.Slot;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Long> {

    List<Slot> findByBookedFalseOrderByDateAscStartTimeAsc();

    @Modifying
    @Query("UPDATE Slot s SET s.booked = true, s.bookedByName = :name, s.bookedByEmail = :email " +
            "WHERE s.id = :id AND s.booked = false")
    int book(@Param("id") Long id, @Param("name") String name, @Param("email") String email);
}