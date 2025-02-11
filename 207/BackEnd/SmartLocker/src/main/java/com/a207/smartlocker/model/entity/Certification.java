package com.a207.smartlocker.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "certification")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Certification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_index")
    private Long adminIndex;

    @Column(name = "admin_id", nullable = false)
    private String adminId;

    @Column(name = "admin_password", nullable = false)
    private String adminPassword;
}
