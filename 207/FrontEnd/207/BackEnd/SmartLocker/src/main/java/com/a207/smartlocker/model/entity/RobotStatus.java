package com.a207.smartlocker.model.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;

// entity/RobotStatus.java
@Entity
@Table(name = "robot_status")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class RobotStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long robotStatusId; // Matches DB SERIAL as LongEGER

    @Column(nullable = false)
    private String robotStatus; // Non-nullable TEXT
}