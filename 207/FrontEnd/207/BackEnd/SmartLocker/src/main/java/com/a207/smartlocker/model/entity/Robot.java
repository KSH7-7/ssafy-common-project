package com.a207.smartlocker.model.entity;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.*;
import java.time.LocalDateTime;

// entity/Robot.java
@Entity
@Table(name = "robots")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
public class Robot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long robotId; // Matches DB SERIAL as LongEGER

    @Column(nullable = false)
    private String robotName; // Non-nullable TEXT

    @Column(nullable = false, columnDefinition = "Longeger default 0")
    private Long completedTasks; // Default value 0, Non-nullable

    @Column(nullable = false)
    private LocalDateTime lastMaintenance; // Non-nullable TIMESTAMP

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "robot_status_id", nullable = false)
    private RobotStatus robotStatus; // Non-nullable Foreign Key reference

}