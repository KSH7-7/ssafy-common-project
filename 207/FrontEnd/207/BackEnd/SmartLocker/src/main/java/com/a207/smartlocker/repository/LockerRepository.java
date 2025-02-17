package com.a207.smartlocker.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.a207.smartlocker.model.entity.Locker;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface LockerRepository extends JpaRepository<Locker, Long> {
    Optional<Locker> findByLockerId(Long lockerId);

    @Query("SELECT l FROM Locker l WHERE l.lockerLocation.locationId IN " +
            "(SELECT loc.locationId FROM LockerLocation loc WHERE loc.locationName = :locationName)" +
    "ORDER BY l.lockerId")
    List<Locker> findLockersByLocationName(@Param("locationName") String locationName);
}