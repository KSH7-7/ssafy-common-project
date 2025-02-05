package com.a207.smartlocker.model.entity;

import lombok.*;
import jakarta.persistence.*;

// entity/User.java
@Entity
@Table(name = "users")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId; // Matches DB SERIAL as LongEGER

    @Column(unique = true, nullable = false)
    private String phoneNumber; // Unique and Non-nullable TEXT
}
