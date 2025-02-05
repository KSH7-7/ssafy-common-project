package com.a207.smartlocker.model.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

// entity/LockerStatus.java
@Entity
@Table(name = "locker_status")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer"})
public class LockerStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lockerStatusId; // Matches DB SERIAL as LongEGER

    @Column(nullable = false)
    private String lockerStatus; // Non-nullable TEXT
}